"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import InputForm from "@/components/input-job";
import axiosInstance from "@/utils/axios";
import { Jobs } from "@/utils/types/form-type";

const page = ({ params }: { params: { jobId: string } }) => {
  const pathname = usePathname();
  const [jobData, setJobData] = useState<Jobs>();
  const [isLoading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `http://localhost:4000/v1/jobs/${params.jobId}`
        );
        console.log("response:", response);
        setJobData(response.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  return (
    <>
      <DynamicBreadcrumb />
      {pathname}
      {!isLoading && (
        <InputForm formTitle="Update Job" existingData={jobData} typeOfForm="PUT" />
      )}
    </>
  );
};

export default page;
