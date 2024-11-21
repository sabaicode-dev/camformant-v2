"use client";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { Eye } from "lucide-react";


export type ApplicantProps = {
    _id: string;
    company_id: string;
    title: string;
}
const JobsPage = () => {
  
  const { jobs } = useAuth();
  const jobsData = jobs?.jobStats.recentJobs;
  useEffect(() => {
    console.log("jobs:::::::::::::::::::::::::;", jobs?.jobStats.recentJobs);
  }, [jobs]);

  return (
    <>
      <DynamicBreadcrumb />
      Jobs
      <DataTable data={jobsData||[]} columns={columns} />
    </>
  );
};

export default JobsPage;
