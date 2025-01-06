"use client";

import { BackButton_md } from "@/components/back/BackButton";
import { Card } from "@/components/card/card";
import SkeletonCard from "@/components/skeleton/skeleton-card";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import { IJob, IJobFav } from "@/components/type-data/TypeofData";
import Image from "next/image";

const Page: React.FC = () => {
  const { user, onChangeUser, setUser } = useAuth();
  const [jobData, setJobData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  //todo: realtime favorite
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
        await axiosInstance.post(`${API_ENDPOINTS.FAVORITE}`, {
          jobId,
        });
        onChangeUser(jobId);
      } else {
        await axiosInstance.delete(`${API_ENDPOINTS.FAVORITE}/${jobId}`);
        // Remove the job from the list if unfavorited
        let dataForDelete: any;
        setJobData((prevData) => {
          dataForDelete = prevData.filter((job: IJobFav) => job._id !== jobId);
          setUser((prevData) =>
            prevData
              ? {
                  ...prevData,
                  favorites:
                    dataForDelete.map(({ _id }: { _id: string }) => _id) ?? [],
                }
              : null
          );
          return dataForDelete;
        });
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
    const fetchFavoriteJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("user:::", user);

        // Get the user's favorite job IDs
        const favoriteJobIds = user?.favorites || [];

        if (!favoriteJobIds.length) {
          setJobData([]);
          setLoading(false);
          return;
        }
        const userFav = user?.favorites.join(",");
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.JOBS}?userFav=${userFav}`
        );

        const jobs: IJob[] = response.data.data.jobs;
        console.log("user fav:::", jobs);

        // Set favorite status to true for these jobs
        const jobsWithFavoriteStatus = jobs.map((job) => ({
          ...job,
          favorite: true,
        }));
        setJobData(jobsWithFavoriteStatus);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching favorite jobs:", error);
        setError("Failed to fetch favorite jobs.");
        setLoading(false);
      }
    };

    fetchFavoriteJobs();
    // eslint-disable-next-line
  }, []);

  if (error) {
    return (
      <div className="container mt-8">
        <div className="mt-10 text-center">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container pt-2 mb-20">
      <div className="h-10 mt-4 mb-8 w-14">
        <Link href={"/profile"}>
          <BackButton_md styles="bg-primaryCam p-3 px-4 rounded-xl text-gray-200" />
        </Link>
      </div>
      {loading ? (
        Array(5)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="mb-4 rounded-xl drop-shadow-md">
              <SkeletonCard />
            </div>
          ))
      ) : jobData.length > 0 ? (
        jobData.map((job) => (
          <div key={job._id} className="mb-5">
            <Card
              _id={job._id}
              title={job.title}
              position={job.position}
              profile={job.company?.profile}
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
      ) : (
        <div className="flex flex-col items-center w-full p-5 mt-20 gap-y-5">
          <p className="w-full text-center">No favorite jobs available</p>
          <Image
            src={"/images/favorite.png"}
            alt="no favorite"
            width={2000}
            height={1762}
            className="w-full lg:w-1/2"
          />
        </div>
      )}
    </div>
  );
};

export default Page;
