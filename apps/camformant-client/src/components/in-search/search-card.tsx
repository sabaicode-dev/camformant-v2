import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Card } from "../card/card";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import { useDebounce } from "@/hooks/use-debounce";
import { FilterValueParams } from "@/components/in-search/search-home-page";
import SkeletonCard from "@/components/skeleton/skeleton-card";
import { IJob } from "../type-data/TypeofData";
import { useAuth } from "@/context/auth";
import Image from "next/image";

const SearchCard = ({
  searchValue,
  filterValues,
  onChangeFilterValues,
}: {
  searchValue: string;
  filterValues: FilterValueParams;
  onChangeFilterValues: (value: FilterValueParams) => void;
}) => {
  const { user } = useAuth();
  const [jobData, setJobData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [love, setLove] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  const debouncedSearchValue = useDebounce(searchValue, 1200);
  const newValue = debouncedSearchValue;
  // const toggleFavorite = (jobId: string) => {
  //   setJobData((prevData: any) =>
  //     prevData.map((job: any) =>
  //       job._id === jobId ? { ...job, favorite: !job.favorite } : job
  //     )
  //   );
  // };

  const toggleFavorite = async (jobId: string) => {
    const jobIndex = jobData.findIndex((job) => job._id === jobId);
    if (jobIndex === -1) return;

    const currentFavoriteStatus = jobData[jobIndex].favorite;
    const newFavoriteStatus = !currentFavoriteStatus;

    const updatedJobs = [...jobData];
    updatedJobs[jobIndex].favorite = newFavoriteStatus;
    setJobData(updatedJobs);

    try {
      if (newFavoriteStatus) {
        await axiosInstance.post(API_ENDPOINTS.FAVORITE, { jobId });
      } else {
        await axiosInstance.delete(`${API_ENDPOINTS.FAVORITE}/${jobId}`);
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
      setError("Failed to update favorite status. Please try again later.");

      // Revert the UI change if the API call fails
      updatedJobs[jobIndex].favorite = currentFavoriteStatus;
      setJobData(updatedJobs);
    }
  };
  const loadMoreData = useCallback(async () => {
    if (!hasMore || loading) return; // Prevent fetching if no more data or already loading

    setLoading(true);
    try {
      const nextPage = page + 1;
      const salary = {
        min_salary: filterValues.minSalary > 0 ? filterValues.minSalary : 0,
        max_salary: filterValues.maxSalary > 0 ? filterValues.maxSalary : 5000,
      };
      //todo:transtack query
      const cleanedSalary = Object.fromEntries(
        Object.entries(salary).filter(([_, value]) => value !== undefined)
      );
      const filterSalary =
        Object.keys(cleanedSalary).length > 0 ? cleanedSalary : undefined;

      const filter = {
        schedule: filterValues.schedule || undefined,
        type: filterValues.type || undefined,
        workMode: filterValues.workMode || undefined,
        required_experience: filterValues.required_experience || undefined,
        salary: filterSalary,
      };
      const query = buildQuery(nextPage, filter, newValue);
      const res = await axiosInstance.get(`${API_ENDPOINTS.JOBS}${query}`);

      const { jobs, totalPages, currentPage } = res.data.data; // Adjust based on your actual response structure

      const jobsWithFavoriteStatus = jobs.map((job: IJob) => ({
        ...job,
        favorite: user?.favorites.includes(job._id!) || false,
      }));

      setJobData((prevJobs) => [...prevJobs, ...jobsWithFavoriteStatus]);
      setPage(nextPage);
      if (jobs.length === 0 || currentPage === totalPages) {
        setHasMore(false); // No more data to fetch
      }
    } catch (error) {
      console.error("Error fetching more jobs:", error);
      setError("Failed to load more jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
    console.log("job load::: ", jobData);
  }, [
    hasMore,
    loading,
    page,
    user?.favorites,
    filterValues.workMode,
    filterValues.maxSalary,
    filterValues.minSalary,
    filterValues.required_experience,
    filterValues.schedule,
    filterValues.type,
    newValue,
    jobData,
  ]);
  const onScroll = useCallback(async () => {
    if (
      window.innerHeight + window.scrollY >= document.body.scrollHeight - 200 &&
      hasMore &&
      !loading &&
      jobData.length > 0
    ) {
      await loadMoreData();
    }
  }, [hasMore, loading, loadMoreData, jobData]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);
  console.log("filter in search card:::", filterValues);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      setJobData([]);
      setPage(1);
      setHasMore(true); // Reset hasMore when category changes
      //=====filter======
      const salary = {
        min_salary: filterValues.minSalary > 0 ? filterValues.minSalary : 0,
        max_salary: filterValues.maxSalary > 0 ? filterValues.maxSalary : 5000,
      };

      const cleanedSalary = Object.fromEntries(
        Object.entries(salary).filter(([_, value]) => value !== undefined)
      );
      const filterSalary =
        Object.keys(cleanedSalary).length > 0 ? cleanedSalary : undefined;

      const filter = {
        schedule: filterValues.schedule || undefined,
        type: filterValues.type || undefined,
        workMode: filterValues.workMode || undefined,
        required_experience: filterValues.required_experience || undefined,
        salary: filterSalary,
      };

      try {
        const query = buildQuery(1, filter, newValue);
        const jobResponse = await axiosInstance.get(
          `${API_ENDPOINTS.JOBS}${query}`
        );

        const { jobs, totalPages, currentPage } = jobResponse.data.data; // Adjust based on your actual response structure

        // Merge favorite status into jobs
        const jobsWithFavoriteStatus = jobs.map((job: IJob) => ({
          ...job,
          favorite: user?.favorites.includes(job._id!) || false,
        }));

        setJobData(jobsWithFavoriteStatus);
        if (jobs.length === 0 || currentPage === totalPages) {
          setHasMore(false);
        }
        console.log("jobs::::, ", jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError("Failed to fetch jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user, filterValues, newValue]);
  // console.log("filter::: inner", filterValues);
  console.log("totalJobs:::", jobData);
  console.log("filterValue kon:::", filterValues);

  const isFilterEmpty = (filterValues: FilterValueParams) => {
    return (
      !filterValues.schedule &&
      !filterValues.type &&
      !filterValues.workMode &&
      !filterValues.required_experience &&
      filterValues.minSalary === 0 &&
      filterValues.maxSalary === 0
    );
  };

  if (!searchValue && isFilterEmpty(filterValues)) {
    return null;
  }

  return (
    <Suspense>
      <div
        className="flex flex-col w-full h-full gap-4 pt-6 pb-20"
        // ref={heighRef}
      >
        {!loading && jobData.length === 0 ? (
          // Display this section when no jobs are found
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/images/unavailable.png"
              alt="No jobs found"
              width={1280}
              height={1280}
              className="w-72 h-72"
            />
            <h2 className="mt-1 text-lg font-semibold text-gray-700">
              No Jobs Found
            </h2>
            <p className="max-w-md mt-2 text-center text-gray-500">
              We could not find any jobs matching your criteria. Try clearing
              the filters or search with different keywords.
            </p>
          </div>
        ) : (
          jobData.map((job: any, index: any) => (
            <div key={index} className="container">
              <Card
                _id={job._id}
                title={job.title}
                position={job.position}
                profile={job?.companyId?.profile}
                min_salary={job.min_salary}
                max_salary={job.max_salary}
                job_opening={job.job_opening}
                type={job.type}
                schedule={job.schedule}
                location={job.location}
                deadline={new Date(job.deadline)}
                heart={job.favorite}
                setHeart={() => toggleFavorite(job._id)}
              />
            </div>
          ))
        )}
        {loading &&
          Array.from({ length: 3 }).map((_, index) => (
            <div className="p-1 mb-2" key={index}>
              <SkeletonCard />
            </div>
          ))}
        {error && (
          <div className="w-full text-center text-red-500">{error}</div>
        )}
      </div>
    </Suspense>
  );
};

export default SearchCard;
function buildQuery(page: number, filter?: {}, debouncedSearchValue?: string) {
  const lastFilter = filter && JSON.stringify(filter);
  console.log("=====lastFilter=====", lastFilter);
  let query = `?&page=${page}&limit=5`;
  if (debouncedSearchValue) query += `&search=${debouncedSearchValue}`;
  if (lastFilter) query += `&filter=${lastFilter}`;
  return query;
}
