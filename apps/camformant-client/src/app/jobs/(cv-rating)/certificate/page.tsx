"use client"
import HeaderBasic from "@/components/cv-rating-card/router-page/basic/header-basic";
import SkeletonLoader from "@/components/cv-rating-card/router-page/basic/skeleton";
import InputFile from "@/components/user-profile/input-file";
import UploadedFile from "@/components/user-profile/uploadedFile";
import { useAuth } from "@/context/auth";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import React, { useEffect, useState } from "react";
export interface FileParams {
  url: string;
}
const Page = () => {
  const { user } = useAuth();
  const [filesEntries, setFilesEntries] = useState<FileParams[]>([{ url: "" }]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const removeFile = (index: number) => {
    setFilesEntries(filesEntries.filter((file, i) => i !== index));
  };
  useEffect(() => {
    async function getData() {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.USER_PROFILE_DETAIL}/${user?._id}?category=certificates`
      );
      const data = response.data.data.certificates;
      setLoading(true);
      data.length && setFilesEntries(data);
    }

    getData();
  });
  const PostData = async () => {
    try {
      const dataValue = {
        certificates: filesEntries,
      };
      console.log("Data", dataValue);
      setLoading(true);
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.USER_PROFILE_DETAIL}/${user!._id}`,
        { ...dataValue }
      );
      console.log("response", response);
      return response;
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <HeaderBasic title="Certificates" nextRoute="/self/portfolio" />
      <InputFile setFiles={setFilesEntries} />
      <UploadedFile files={filesEntries} removeFile={removeFile} />
    </div>
  );
};

export default Page;
