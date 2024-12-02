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
  const jobData = useState<Jobs>();
  useEffect(() => {
    async function fetchData() {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.JOBS}/${params.jobId}`
      );
      console.log("response");
    }
    fetchData();
  });
  return (
    <>
      <DynamicBreadcrumb />
      {pathname}
      <InputForm formTitle="Update Job" />
    </>
  );
};

export default page;
