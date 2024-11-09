"use client";
import { useCallback, useEffect, useState } from "react";
import categoryPosition from "@/data/data.json";
import { Heading } from "@/components/heading/heading";
import { CategoryPosition } from "@/components/category-position/category-position";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import { Card } from "@/components/card/card";
import { useAuth } from "@/context/auth";
import SkeletonCard from "@/components/skeleton/skeleton-card";
import Image from "next/image";
import { Job } from "@/app/jobs/[id]/message/page";
export enum EmploymentSchedule {
  FULL_TIME = "Full-Time",
  PART_TIME = "Part-Time",
  FLEXIBLE_HOURS = "Flexible-Hours",
  PROJECT_BASED = "Project-Based",
}
export enum EmploymentType {
  CONTRACT = "Contract",
  INTERNSHIP = "Internship",
}
export enum WorkMode {
  REMOTE = "Remote",
  ON_SITE = "On-Site",
  HYBRID = "Hybrid",
}
interface IJob {
  _id?: string;
  companyId?: string;
  title?: string; // name of the job that company looking for. Example: Java Developer
  position?: string[]; // tags that belong to the tile: Backend Development, Programming, etc.
  workMode?: WorkMode[];
  location?: string; // location could be phnom penh, kompong-cham, etc.
  requirement?: string;
  address?: string; // address could be the link address of the company (google link)
  description?: string;
  min_salary?: number;
  max_salary?: number;
  deadline?: Date;
  job_opening?: number;
  type?: EmploymentType[];
  schedule?: EmploymentSchedule[];
  required_experience?: string[];
  benefit?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

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
  }, [hasMore, isLoading, page, selectedPosition, user?.favorites]);

  const onScroll = useCallback(async () => {
    if (
      window.innerHeight + window.scrollY >= document.body.scrollHeight - 200 &&
      hasMore &&
      !isLoading &&
      jobData.length > 0
    ) {
      await loadMoreData();
    }
  }, [hasMore, isLoading, loadMoreData, jobData]);

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
        console.log("jobs::::, ", jobs);

        // Merge favorite status into jobs
        const jobsWithFavoriteStatus = jobs.map((job: IJob) => ({
          ...job,
          favorite: user?.favorites.includes(job._id!) || false,
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
    <div className="container mt-5 pb-28">
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
      ) : jobData.length === 0 ? (
        <div className="flex flex-col items-center w-full">
          <Image
            src={"/images/unavailable.png"}
            alt=""
            width={1280}
            height={1280}
            className="w-full lg:w-1/2"
          />
          <p className="mb-10 ">No jobs available</p>
        </div>
      ) : (
        ""
      )}

      {isLoading &&
        hasMore &&
        Array.from({ length: 3 }).map((_, index) => (
          <div className="p-1 mb-2" key={index}>
            <SkeletonCard />
          </div>
        ))}
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
