"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import InputForm from "@/components/input-job";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
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
          `${API_ENDPOINTS.JOBS}/${params.jobId}`
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
