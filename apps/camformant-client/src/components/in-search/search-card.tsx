import React, { Suspense, useCallback, useEffect, useState } from "react";
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
}: {
  searchValue: string;
  filterValues: FilterValueParams;
}) => {
  const { user } = useAuth();
  const [jobData, setJobData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [love, setLove] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  // Debounced search value (waits 1s after the user stops typing)
  const debouncedSearchValue = useDebounce(searchValue, 1000);

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
    console.log("page::: ", page);

    if (!hasMore || loading) return; // Prevent fetching if no more data or already loading

    setLoading(true);
    setPage((curr) => curr + 1);
    const salary = {
      min_salary:
        filterValues.minSalary > 0 ? filterValues.minSalary : undefined,
      max_salary:
        filterValues.maxSalary > 0 ? filterValues.maxSalary : undefined,
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

    const params: Record<string, any> = {
      limit: 5,
      sort: JSON.stringify({ createdAt: "desc" }),
      filter: JSON.stringify(filter),
      page: page,
    };

    if (debouncedSearchValue) {
      params.search = debouncedSearchValue;
    }
    try {
      const query = buildQuery(page);
      const res = await axiosInstance.get(`${API_ENDPOINTS.JOBS}`, { params });
      console.log("jobs:::", res.data.data);

      const { jobs, totalPages, currentPage } = res.data.data; // Adjust based on your actual response structure

      if (jobs.length === 0 || currentPage === totalPages) {
        setHasMore(false); // No more data to fetch
      }
      // setJobData((job) => [...job, ...jobs]);
      const jobsWithFavoriteStatus = jobs.map((job: IJob) => ({
        ...job,
        favorite: user?.favorites.includes(job._id!) || false,
      }));

      setJobData((prevJobs) => [...prevJobs, ...jobsWithFavoriteStatus]);
    } catch (error) {
      console.error("Error fetching more jobs:", error);
      setError("Failed to load more jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, page]);
  const onScroll = useCallback(async () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 1 &&
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

  useEffect(() => {
    // console.log(filterValues);
    // console.log(searchValue);

    const fetchJobData = async () => {
      if (!debouncedSearchValue && isFilterEmpty(filterValues)) return;

      try {
        setLoading(true);
        setError(null);
        setJobData([]);
        setPage(1);
        setHasMore(true);

        const salary = {
          min_salary:
            filterValues.minSalary > 0 ? filterValues.minSalary : undefined,
          max_salary:
            filterValues.maxSalary > 0 ? filterValues.maxSalary : undefined,
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

        const params: Record<string, any> = {
          limit: 5,
          sort: JSON.stringify({ createdAt: "desc" }),
          filter: JSON.stringify(filter),
          page: page,
        };

        if (debouncedSearchValue) {
          params.search = debouncedSearchValue;
        }

        const jobResponse = await axiosInstance.get(`${API_ENDPOINTS.JOBS}`, {
          params,
        });
        const jobs: IJob[] = jobResponse?.data?.data?.jobs || [];
        if (
          jobResponse?.data?.data?.totalPages >
          jobResponse?.data?.data?.currentPage
        ) {
          setHasMore(true);
          setPage(jobResponse?.data?.data?.currentPage + 1);
        }
        console.log("obResponse?.data? ", jobResponse?.data);

        // setJobData(jobs);
        const jobsWithFavoriteStatus = jobs.map((job: IJob) => ({
          ...job,
          favorite: user?.favorites.includes(job._id!) || false,
        }));

        setJobData(jobsWithFavoriteStatus);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch job data");
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [debouncedSearchValue, filterValues, searchValue, user?.favorites]);

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
      <div className="flex flex-col w-full h-full gap-4 pt-6 pb-20">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div className="p-1 mb-2" key={index}>
              <SkeletonCard />
            </div>
          ))
        ) : jobData.length === 0 ? (
          // Display this section when no jobs are found
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/images/unavailable.png"
              alt="No jobs found"
              width={500}
              height={500}
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
                profile={job?.companyId?.profile || "defaultProfileUrl"}
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
        {error && (
          <div className="w-full text-center text-red-500">{error}</div>
        )}
      </div>
    </Suspense>
  );
};

export default SearchCard;
function buildQuery(page: number) {
  return `?&page=${page}&limit=5`;
}
