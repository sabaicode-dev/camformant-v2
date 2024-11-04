"use client";
import React, { useRef, useState, useEffect, useMemo } from "react";
import SkeletonLoader from "../cv-rating-card/router-page/basic/skeleton";
import axios from "axios";
import { FaFilePdf } from "react-icons/fa";

interface typeUploads {
  next: boolean;
  setNext: (next: boolean) => void;
}

const AttachedCvs: React.FC<typeUploads> = ({ next, setNext }) => {
  const [file, setFile] = useState<File | null>(null);
  const UploadsRef = useRef<HTMLInputElement | null>(null);
  const config = useMemo(
    () => ({
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }),
    []
  );

  function handleUploads() {
    UploadsRef.current?.click();
  }
  function handleSelectFile(event: React.ChangeEvent<HTMLInputElement>) {
    const cv = event.target.files?.[0];
    if (cv) {
      setFile(cv);
    }
  }

  useEffect(() => {
    async function PostCV() {
      if (!file) return;
      try {
        setNext(true);
        const formData = new FormData();
        formData.append("file_path", file);

        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/user/cv/`, // Update this to your endpoint for conversion
          formData,
          config
        );

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
  }, [file, config, setNext]);

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
