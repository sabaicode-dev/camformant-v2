import { User } from "@/context/auth";
import { SetStateAction } from "react";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import { Job } from "@/components/posts/position-post";

export async function jobSyncUpdate(
  type: string,
  setAction: React.Dispatch<SetStateAction<User | null>>,
  jobId: string
) {
  if (type == "post") {
    setAction((prevData: User | null) =>
      prevData
        ? {
            ...prevData,
            favorites: [...prevData.favorites, jobId],
          }
        : null
    );
    await axiosInstance.post(API_ENDPOINTS.FAVORITE, { jobId });
  } else {
    setAction((prevData: User | null) =>
      prevData
        ? {
            ...prevData,
            favorites: prevData.favorites.filter((fav) => fav !== jobId),
          }
        : null
    );
    await axiosInstance.delete(`${API_ENDPOINTS.FAVORITE}/${jobId}`);
  }
}

export const toggleFavorite = async (
  jobData: Job[],
  jobId: string,
  setJobData: React.Dispatch<SetStateAction<Job[]>>,
  setUser: React.Dispatch<SetStateAction<User | null>>,
  setError?: React.Dispatch<SetStateAction<string | null>>,
  setForSync?: React.Dispatch<SetStateAction<boolean>>
) => {
  const jobIndex = jobData.findIndex((job: Job) => job._id === jobId);
  if (jobIndex === -1) return;

  const currentFavoriteStatus = jobData[jobIndex].favorite;
  const newFavoriteStatus = !currentFavoriteStatus;

  const updatedJobs = [...jobData];
  updatedJobs[jobIndex].favorite = newFavoriteStatus;
  setJobData(updatedJobs);

  try {
    if (newFavoriteStatus) {
      jobSyncUpdate("post", setUser, jobId);
    } else {
      jobSyncUpdate("delete", setUser, jobId);
    }
    setForSync && setForSync((prev: boolean) => !prev);
  } catch (error) {
    console.error("Error updating favorite status:", error);
    setError &&
      setError("Failed to update favorite status. Please try again later.");

    // Revert the UI change if the API call fails
    updatedJobs[jobIndex].favorite = currentFavoriteStatus;
    setJobData(updatedJobs);
  }
};
