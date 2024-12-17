"use client";
import Link from "next/link";
import { BackButton_md } from "@/components/back/BackButton";
import { useCallback, useEffect, useRef, useState } from "react";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import { useAuth } from "@/context/auth";
import CallToAction from "../calltoaction/call-to-action";
import SkeletonCard from "../skeleton/skeleton-card";
import { Card } from "../card/card";
import { toggleFavorite } from "@/utils/functions/job-function";
import { useNotification } from "@/hooks/user-notification";
import { buildQuery, Job } from "@/components/posts/position-post";

const JobMatching = () => {
  const { user, setUser } = useAuth();
  const skillsRef = useRef<string[]>([]);
  const [jobData, setJobData] = useState<Job[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { addNotification, NotificationDisplay } = useNotification();

  const loadMoreData = useCallback(async () => {
    if (!hasMore || isLoading) return; // Prevent fetching if no more data or already loading

    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const query = buildQuery(nextPage, skillsRef.current);
      const res = await axiosInstance.get(`${API_ENDPOINTS.JOBS}${query}`);
      const { jobs, totalPages } = res.data.data;
      if (jobs.length === 0 || nextPage >= totalPages) {
        setHasMore(false);
      }

      const jobsWithFavoriteStatus = jobs.map((job: Job) => ({
        ...job,
        favorite: user?.favorites.includes(job._id) || false,
      }));

      setJobData((prevJobs) => [...prevJobs, ...jobsWithFavoriteStatus]);
      setPage(nextPage);
    } catch (error) {
      console.error("Error fetching more jobs:", error);
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, isLoading, page, user?.favorites]);
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
  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);
  useEffect(() => {
    async function fetchSKill() {
      setPage(1);
      setHasMore(true);
      try {
        const userSkill = await axiosInstance.get(
          `${API_ENDPOINTS.USER_PROFILE_DETAIL}/${user?._id}?category=skills`
        );
        skillsRef.current = userSkill.data.data.skills.map(
          (skill: { name: string; percent: number }) => skill.name
        );
        if (skillsRef.current) {
          const query = buildQuery(1, skillsRef.current);
          const response = await axiosInstance.get(
            `${API_ENDPOINTS.JOBS}${query}`
          );
          const { jobs, totalPages } = response.data.data;
          if (jobs.length === 0 || 1 >= totalPages) {
            setHasMore(false);
          }
          const jobsWithFavoriteStatus = jobs.map((job: Job) => ({
            ...job,
            favorite: user?.favorites.includes(job._id) || false,
          }));
          setJobData(jobsWithFavoriteStatus);
        }
      } catch (err) {
        console.error("Error fetching skills:", err);
      } finally {
        setIsLoading(false);
      }
    }
    user && fetchSKill();
  }, [user]);
  return (
    <div className="pb-10">
      <NotificationDisplay />
      <div className=" sticky top-0 p-5 mb-3 bg-white z-10">
        <div className="flex justify-between items-center">
          <Link href={"/"}>
            <BackButton_md styles="bg-primaryCam p-3 px-4 rounded-xl text-gray-200" />
          </Link>
          <p className="text-xl font-bold">{user && "Job Matching"}</p>
        </div>
      </div>

      {!user ? (
        <CallToAction
          buttonLink="/login"
          buttonText="Login"
          text="Login To See Job Matching"
        />
      ) : !isLoading ? (
        !skillsRef.current.length ? (
          <CallToAction
            buttonLink="/cv-rating"
            buttonText="Click Here"
            text="Skill is required for matching"
          />
        ) : jobData.length > 0 ? (
          jobData.map((job, index) => (
            <div key={index} className="mb-5 container">
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
                    ? toggleFavorite(jobData, job._id, setJobData, setUser)
                    : addNotification("Login for add to favorites", "error");
                }}
                heart={job.favorite}
              />
            </div>
          ))
        ) : (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-primaryCam">
            No Matching For You
          </div>
        )
      ) : (
        Array.from({ length: 3 }).map((_, index) => (
          <div className="p-1 mb-2" key={index}>
            <SkeletonCard />
          </div>
        ))
      )}
    </div>
  );
};

export default JobMatching;
