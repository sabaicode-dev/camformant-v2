"use client";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";

const JobsPage = () => {
  const [jobsData, setJobsData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/jobs/corporator`
        );
        setJobsData(res.data.data);
      } catch (error) {
        console.error("Fetch jobs failed:", error);
      }
    };
    fetchData();
  }, []);

  console.log("jobsDatalikdsjhfloiuahlsioudhfas", jobsData);

  return (
    <>
      <h1>hello world</h1>
      <div className="font-roboto"> Jobs hello world</div>
      <DataTable data={jobsData || []} columns={columns} />
    </>
  );
};

export default JobsPage;
