"use client";

import React, { SetStateAction, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Heading } from "@/components/heading/heading";
import { Button } from "@/components/button/button";
import { AiOutlineArrowRight } from "react-icons/ai";
import Image from "next/image";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import { Card } from "@/components/card/card";
import { useAuth } from "@/context/auth";
import SkeletonCard from "@/components/skeleton/skeleton-card";
import { jobSyncUpdate, toggleFavorite } from "@/utils/functions/job-function";
import { AddNotificationType } from "@/hooks/user-notification";
import { buildQuery, Job } from "./position-post";

export const RecommendationPost: React.FC<{
  setForSync: React.Dispatch<SetStateAction<boolean>>;
  addNotifications: AddNotificationType;
}> = ({ setForSync, addNotifications }) => {
  const { user, setUser } = useAuth();
  const [jobData, setJobData] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      let skillResponse;

      skillResponse = user
        ? await axiosInstance.get(
            `${API_ENDPOINTS.USER_PROFILE_DETAIL}/${user?._id}?category=skills`
          )
        : null;
      try {
        let jobResponse;
        if (
          user &&
          skillResponse &&
          Object.keys(skillResponse.data.data).length > 0
        ) {
          const query = buildQuery(
            1,
            skillResponse.data.data.skills.map(
              (skill: { name: string; percent: number }) => skill.name
            )
          );
          jobResponse = await axiosInstance.get(
            `${API_ENDPOINTS.JOBS}${query}`
          );
        }
        if (!user || !jobResponse?.data.data.jobs.length) {
          jobResponse = await axiosInstance.get(`${API_ENDPOINTS.JOBS}`, {
            params: {
              limit: 5,
              sort: JSON.stringify({ createdAt: "desc" }),
            },
          });
        }

        const jobs = jobResponse?.data.data.jobs;
        // Merge favorite status into jobs
        const jobsWithFavoriteStatus = jobs.map((job: Job) => ({
          ...job,
          favorite: user?.favorites.includes(job._id) || false,
        }));

        setJobData(jobsWithFavoriteStatus);
        setLoading(false);
      } catch (jobError) {
        console.error("Error fetching job data:", jobError);
        setError("Failed to fetch job data");
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

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
    <div className="container mt-2">
      <div className="flex flex-row justify-between my-2">
        <Heading title="Recommend Jobs" />
        <Image
          src={"/images/bloodbros-search.gif"}
          alt={"logo"}
          width={50}
          height={50}
          unoptimized
        />
      </div>
      <Swiper
        loop
        slidesPerView={1}
        spaceBetween={20}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
      >
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <SwiperSlide key={index}>
                <div className="p-1 mb-5">
                  <SkeletonCard />
                </div>
              </SwiperSlide>
            ))
          : jobData.map((job) => (
              <SwiperSlide key={job._id}>
                <div className="p-1 mb-5">
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
                    heart={job.favorite}
                    setHeart={() => {
                      user
                        ? toggleFavorite(
                            jobData,
                            job._id,
                            setJobData,
                            setUser,
                            setError,
                            setForSync
                          )
                        : addNotifications(
                            "Login for add to favorites",
                            "error"
                          );
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
      </Swiper>

      <div className="mb-10 mt-7">
        <Button
          text="Find Your Matching"
          link="/jobMatching"
          icon={<AiOutlineArrowRight />}
        />
      </div>
    </div>
  );
};
