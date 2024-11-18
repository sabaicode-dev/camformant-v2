"use client";
import React, { useRef, useState, useEffect, useMemo } from "react";
import SkeletonLoader from "../cv-rating-card/router-page/basic/skeleton";
import axios from "axios";
import { FaFilePdf } from "react-icons/fa";
import axiosInstance from "@/utils/axios";
import { uploadToS3 } from "@/utils/functions/upload-to-s3";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";

interface typeUploads {
  next: boolean;
  setNext: (next: boolean) => void;
}

const AttachedCvs: React.FC<typeUploads> = ({ next, setNext }) => {
  const [file, setFile] = useState<string | null>(null);
  const UploadsRef = useRef<HTMLInputElement | null>(null);

  function handleUploads() {
    console.log("clicked");
    UploadsRef.current?.click();
  }

  async function handleSelectFile(event: React.ChangeEvent<HTMLInputElement>) {
    const cv = event.target.files?.[0];
    const file = await uploadToS3(cv!);
    console.log("file from s3", file);
    if (file) {
      setFile(file);
    }
  }

  useEffect(() => {
    async function PostCV() {
      if (!file) return;
      try {
        setNext(true);
        const res = await axiosInstance.post(
          API_ENDPOINTS.USER_SERVICE_CV_FILE, // Update this to your endpoint for conversion
          { url: file }
        );
        console.log("post res", res);
        if (res.status === 200) {
          console.log("Successfully");
        } else {
          console.log("Error uploading CV");
        }
      } catch (error) {
        console.error("Error during upload and conversion:", error);
      } finally {
        setNext(false);
      }
    }

    PostCV();
  }, [file, setNext]);

  return (
    <div>
      {next && (
        <div className="absolute">
          <SkeletonLoader text="Loading ..." />
        </div>
      )}
      <button
        onClick={handleUploads}
        className="flex items-center justify-start w-full p-10 bg-white shadow-xl rounded-3xl"
      >
        <span className="pr-4 text-red-500 ">
          <FaFilePdf />
        </span>
        Uploads CV / Attached CV
      </button>

      <input
        onChange={handleSelectFile}
        ref={UploadsRef}
        className="hidden"
        type="file"
        accept="application/pdf"
      />
    </div>
  );
};

export default AttachedCvs;
