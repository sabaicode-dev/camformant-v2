"use client";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";

const Jobs = () => {
    const [jobsData, setJobsData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/jobs/corporator`);
                setJobsData(res.data.data);
            } catch (error) {
                console.error("Fetch jobs failed:", error);
            }
        };
        fetchData();
    } , []);

    console.log("jobsDatalikdsjhfloiuahlsioudhfas", jobsData);

    return (
        <>
            <DynamicBreadcrumb />
            Jobs
            <DataTable data={jobsData || []} columns={columns} />
        </>
    );
};

export default Jobs;
