"use client";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";


const Jobs = () => {
    const {jobs} = useAuth();
    const jobsData = jobs?.jobStats.recentJobs;
    useEffect(() => {
        console.log("jobs:::::::::::::::::::::::::;", jobs?.jobStats.recentJobs);
    }, [jobs]);

    return (
        <>
            <DynamicBreadcrumb />
            Jobs
            <DataTable data={jobsData || []} columns={columns} />
        </>
    );
};

export default Jobs;
