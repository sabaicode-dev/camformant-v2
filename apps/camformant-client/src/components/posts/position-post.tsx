"use client";

import { useCallback, useEffect, useState } from "react";
import categoryPosition from "@/data/data.json";
import { Heading } from "@/components/heading/heading";
import { CategoryPosition } from "@/components/category-position/category-position";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import { Card } from "@/components/card/card";
import { useAuth } from "@/context/auth";
import { Job } from "@/app/jobs/[id]/message/page";
import SkeletonCard from "@/components/skeleton/skeleton-card";

export const PositionPost: React.FC = () => {
  const { user } = useAuth();
  const [jobData, setJobData] = useState<any[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string>("All");

  // FETCHING DATA STATE
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadMoreData = useCallback(async () => {
    if (!hasMore || isLoading) return; // Prevent fetching if no more data or already loading

    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const query = buildQuery(nextPage, selectedPosition);
      const res = await axiosInstance.get(`${API_ENDPOINTS.JOBS}${query}`);

      const { jobs, totalPages } = res.data.data; // Adjust based on your actual response structure

      if (jobs.length === 0 || nextPage >= totalPages) {
        setHasMore(false); // No more data to fetch
      }

      const jobsWithFavoriteStatus = jobs.map((job: Job) => ({
        ...job,
        favorite: user?.favorites.includes(job._id) || false,
      }));

      setJobData((prevJobs) => [...prevJobs, ...jobsWithFavoriteStatus]);
      setPage(nextPage);
    } catch (error) {
      console.error("Error fetching more jobs:", error);
      setError("Failed to load more jobs. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, isLoading, page, selectedPosition]);

  const onScroll = useCallback(async () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      hasMore &&
      !isLoading
    ) {
      await loadMoreData();
    }
  }, [hasMore, isLoading, loadMoreData]);

  const handleSelectPosition = (category: string) => {
    setSelectedPosition(category);
    setJobData([]);
    setPage(1);
    setHasMore(true);
  };

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

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);
      setJobData([]);
      setPage(1);
      setHasMore(true); // Reset hasMore when category changes

      try {
        const query = buildQuery(1, selectedPosition);
        const jobResponse = await axiosInstance.get(
          `${API_ENDPOINTS.JOBS}${query}`
        );

        const { jobs, totalPages } = jobResponse.data.data; // Adjust based on your actual response structure

        if (jobs.length === 0 || 1 >= totalPages) {
          setHasMore(false);
        }

        // Merge favorite status into jobs
        const jobsWithFavoriteStatus = jobs.map((job: any) => ({
          ...job,
          favorite: user?.favorites.includes(job._id) || false,
        }));

        setJobData(jobsWithFavoriteStatus);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError("Failed to fetch jobs. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [selectedPosition, user]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return (
    <div className="container mt-5 pb-14">
      <Heading title="Positions" subTitle="You can find more positions here" />

      <div className="flex items-center justify-start gap-5 p-1 mt-4 mb-8 overflow-x-auto">
        {categoryPosition.categoryPosition.map((x) => (
          <div key={x.text}>
            <CategoryPosition
              text={x.text}
              onClick={() => handleSelectPosition(x.text)}
              isSelected={selectedPosition === x.text}
            />
          </div>
        ))}
      </div>

      {jobData.length > 0 ? (
        jobData.map((job, idx) => (
          <div key={idx} className="mb-5">
            <Card
              _id={job._id}
              title={job.title}
              position={job.position}
              profile={job.companyId?.profile}
              min_salary={job.min_salary}
              max_salary={job.max_salary}
              job_opening={job.job_opening}
              type={job.type}
              schedule={job.schedule}
              location={job.location}
              deadline={new Date(job.deadline)}
              setHeart={() => toggleFavorite(job._id)}
              heart={job.favorite}
            />
          </div>
        ))
      ) : isLoading ? (
        Array(5)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="mb-4 rounded-xl drop-shadow-md">
              <SkeletonCard />
            </div>
          ))
      ) : (
        <p className="flex items-center justify-center w-full h-56 mb-20">
          No jobs available
        </p>
      )}

      {isLoading && hasMore && (
        <p className="text-center text-gray-500">Loading more jobs...</p>
      )}
      {!hasMore && jobData.length > 0 && (
        <p className="my-10 text-center text-gray-500">
          You have seen all jobs.
        </p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}
    </div>
  );
};

function buildQuery(page: number, selectedPosition: string) {
  const filter = { position: selectedPosition };
  const encodedFilter = encodeURIComponent(JSON.stringify(filter));
  return `?filter=${encodedFilter}&page=${page}&limit=5`;
}
