"use client";
import React, { useRef, useState, useEffect, SetStateAction } from "react";
import { FaFilePdf } from "react-icons/fa";
import axiosInstance from "@/utils/axios";
import { S3FileResParams, uploadToS3 } from "@/utils/functions/upload-to-s3";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import { useNotification } from "@/hooks/user-notification";

interface typeUploads {
  setNext: React.Dispatch<SetStateAction<boolean>>;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
}

const AttachedCvs: React.FC<typeUploads> = ({ setNext, setLoading }) => {
  const [file, setFile] = useState<string | null>(null);
  const UploadsRef = useRef<HTMLInputElement | null>(null);
  const { addNotification, NotificationDisplay } = useNotification();
  function handleUploads() {
    console.log("clicked");
    UploadsRef.current?.click();
  }

  async function handleSelectFile(event: React.ChangeEvent<HTMLInputElement>) {
    const cv = event.target.files?.[0];
    setLoading(true);
    const file: S3FileResParams | undefined = await uploadToS3(cv!);
    setLoading(false);
    if (file) {
      file.statusCode == 200 && file.value
        ? setFile(file.value)
        : addNotification(file.errorMessage!, "error");
    }
  }
  useEffect(() => {
    async function PostCV() {
      if (!file) return;
      try {
        const res = await axiosInstance.post(
          API_ENDPOINTS.USER_SERVICE_CV_FILE, // Update this to your endpoint for conversion
          { url: file }
        );
        if (res.status === 200) {
          console.log("Successfully");
        } else {
          console.log("Error uploading CV");
        }
      } catch (error) {
        console.error("Error during upload and conversion:", error);
      } finally {
        setNext((prev: boolean) => !prev);
      }
    }

    PostCV();
  }, [file, setNext]);

  return (
    <div>
      <NotificationDisplay />

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
