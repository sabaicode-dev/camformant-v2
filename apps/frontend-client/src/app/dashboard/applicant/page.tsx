"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import Image from "next/image";
import { IJob, JobApplication } from "@/utils/types/job";

const ApplicantPage = () => {
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobApplications = async () => {
    try {
      // Fetch jobs first
      const jobsResponse = await axiosInstance.get<{ data: IJob[] }>(API_ENDPOINTS.JOBS);
      const fetchedJobs = jobsResponse.data.data;

      // Fetch applications for each job
      const applicationsPromises = fetchedJobs.map(job => 
        axiosInstance.get<{ data: JobApplication[] }>(`${API_ENDPOINTS.JOB_APPLY}?jobId=${job._id}`)
      );

      const applicationsResponses = await Promise.all(applicationsPromises);
      
      // Flatten and set applications
      const allApplications = applicationsResponses
        .flatMap(response => response.data.data)
        .filter(application => application !== null);

      setJobApplications(allApplications);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching job applications:", error);
      setError("Failed to load job applications");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobApplications();
  }, []);
  console.log(jobApplications);

  if (isLoading) {
    return <div>Loading applications...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-yellow-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Job Applications</h1>
      {jobApplications.length === 0 ? (
        <p>No applications found</p>
      ) : (
        <div className="space-y-4">
          {jobApplications.map(application => (
            <div 
              key={application._id} 
              className="bg-white shadow-md rounded-lg p-4"
            >
              <div className="flex items-center space-x-4">
                <Image 
                  src={application.userInfo.profile} 
                  alt={application.userInfo.name}
                  className="w-16 h-16 rounded-full"
                  width={64}
                  height={64}
                />
                <div>
                  <h2 className="text-lg font-semibold">{application.userInfo.name}</h2>
                  <p>Applied on: {new Date(application.appliedAt).toLocaleDateString()}</p>
                  <p>Status: {application.userInfo.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicantPage;