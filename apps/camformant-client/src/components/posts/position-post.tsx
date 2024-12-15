"use client";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import categoryPosition from "@/data/data.json";
import { Heading } from "@/components/heading/heading";
import { CategoryPosition } from "@/components/category-position/category-position";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import { Card } from "@/components/card/card";
import { useAuth } from "@/context/auth";
import SkeletonCard from "@/components/skeleton/skeleton-card";
import Image from "next/image";
import { jobSyncUpdate, toggleFavorite } from "@/utils/functions/job-function";
import { AddNotificationType } from "@/hooks/user-notification";

interface Company {
  name: string;
  profile: string;
}
export interface companiesForJobs {
  _id?: string;
  profile?: string;
  name?: string;
  location?: {
    address?: string;
    city?: string;
    country?: string;
  };
  description?: string;
  contact?: {
    phone_number?: string;
    website?: string;
  };
  email?: string;
  job_openings_count?: number;
  job_closings_count?: number;
}
export interface IJob {
  _id?: string;
  title?: string; // name of the job that company looking for. Example: Java Developer
  position?: string[]; // tags that belong to the tile: Backend Development, Programming, etc.
  workMode?: string[];
  location?: string; // location could be phnom penh, kompong-cham, etc.
  requirement?: string;
  description?: string;
  address?: string; // address could be the link address of the company (google link)
  min_salary?: number;
  max_salary?: number;
  job_opening?: number;
  type?: string[];
  schedule?: string[];
  required_experience?: string[];
  benefit?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  deadline?: string | number | Date | undefined;
  company?: companiesForJobs;
  favorite?:boolean
}
export interface Job extends IJob {
  _id: string;
  company: Company;
}

export const PositionPost: React.FC<{
  forSync: boolean;
  addNotifications: AddNotificationType;
}> = ({ forSync, addNotifications }) => {
  const { user, setUser } = useAuth();
  const [jobData, setJobData] = useState<Job[]>([]);
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
    // eslint-disable-next-line
  }, [selectedPosition, forSync]);

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
              profile={job.company?.profile || ""}
              min_salary={job.min_salary}
              max_salary={job.max_salary}
              job_opening={job.job_opening}
              type={job.type}
              schedule={job.schedule}
              location={job.location}
              deadline={new Date(job.deadline!)}
              setHeart={() => {
                user
                  ? toggleFavorite(
                      jobData,
                      job._id,
                      setJobData,
                      setUser,
                      setError
                    )
                  : addNotifications("Login for add to favorites", "error");
              }}
              heart={job.favorite}
            />
          </div>
        ))
      ) : jobData.length === 0 && !isLoading && !error ? (
        <div className="flex flex-col items-center w-full">
          <Image
            src={"/images/unavailable.png"}
            alt="No jobs available"
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

export function buildQuery(page: number, selectedPosition: string[] | string) {
  const filter = { position: selectedPosition };
  const encodedFilter = encodeURIComponent(JSON.stringify(filter));
  return `?filter=${encodedFilter}&page=${page}&limit=5`;
}
