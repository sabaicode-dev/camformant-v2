"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import { IJob, JobApplication } from "@/utils/types/job";
import { DataTable } from "./data-table";
import { columns } from "./columns";

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
      .then(response => response.data.data.map(application => ({ ...application }))));

      const applicationsResponses = await Promise.all(applicationsPromises);
      
      // Flatten and set applications
      const allApplications = applicationsResponses.flat();

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

  if (isLoading) {
    return <div>Loading applications...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="">
      {jobApplications.length === 0 ? (
        <p>No applications found</p>
      ) : (
        <DataTable data={jobApplications} columns={columns}/>
      )}
    </div>
  );
};

export default ApplicantPage;