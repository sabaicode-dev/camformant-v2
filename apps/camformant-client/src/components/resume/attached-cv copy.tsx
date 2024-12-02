"use client";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import SkeletonLoader from "../cv-rating-card/router-page/basic/skeleton";
import Image from "next/image";

const AttachedCvs: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [next, setNext] = useState<boolean>(false);
  const [imageURL, setImageURL] = useState<string | null>(null); // To store the converted image URL
  const UploadsRef = useRef<HTMLInputElement | null>(null);

  function handleUploads() {
    UploadsRef.current?.click();
  }

  const config = {
    headers: {
      "Content-Type": "multipart/form-data", // Ensure this is correct
    },
    withCredentials: true,
  };


  function handleSelectFile(event: React.ChangeEvent<HTMLInputElement>) {
    const cv = event.target.files?.[0];
    if (cv) {
      console.log(`Selected CV: ${cv.name}`);
      // setImageURL(cv)
    }
  }

  return (
    <div>
      {next && (
        <div className="absolute w-full h-screen">
          <SkeletonLoader />
        </div>
      )}

      {imageURL ? (
        // Show the converted image
        <div className="mt-4">
          <Image
            src={imageURL}
            alt="Converted CV"
            className="h-auto max-w-full rounded-lg"
          />
        </div>
      ) : (
        // Show the upload button if no image is available
        <button
          onClick={handleUploads}
          className="flex items-center justify-start w-full p-10 bg-white shadow-xl rounded-3xl"
        >
          Attach CV
        </button>
      )}

      <input
        onChange={handleSelectFile}
        ref={UploadsRef}
        className="hidden"
        type="file"
        accept="application/pdf" // Restrict to PDF files
      />
    </div>
  );
};

export default AttachedCvs;
