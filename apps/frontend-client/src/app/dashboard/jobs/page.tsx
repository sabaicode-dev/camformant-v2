"use client";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";



const JobsPage = () => {
  const { jobs } = useAuth();

  const jobsData = jobs?.jobStats.recentJobs;
 console.log(jobsData)
  useEffect(() => {
    console.log("jobs:::::::::::::::::::::::::;", jobs?.jobStats.recentJobs);
  }, [jobs]);

  return (
    <>
      <DynamicBreadcrumb />
      <h1>hello world</h1>
     <div className="font-roboto"> Jobs hello world</div>
      <DataTable data={jobsData||[]} columns={columns} />
    </>
  );
};

export default JobsPage;
