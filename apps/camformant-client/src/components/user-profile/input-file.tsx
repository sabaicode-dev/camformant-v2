"use client";
import { FileParams } from "@/app/jobs/(cv-rating)/certificate/page";
import { useAuth } from "@/context/auth";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import { uploadToS3 } from "@/utils/functions/upload-to-s3";
import { useState } from "react";
export interface InputFileParams {
  setFiles: React.Dispatch<React.SetStateAction<FileParams[]>>;
  setIsPost: React.Dispatch<React.SetStateAction<boolean>>;
}
const InputFile: React.FC<InputFileParams> = ({ setFiles, setIsPost }) => {
  const [fileName, setFileName] = useState("No file chosen");
  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const image: string | undefined = await uploadToS3(file);
      setFileName(file.name);
      image &&
        setFiles((previous: FileParams[]) => {
          return [...previous, { url: image }];
        });
      setIsPost(true);
    } else {
      setFileName("No file chosen");
    }
  };
  return (
    <div className="w-full container relative pt-10 `w-full outline-none rounded-2xl p-5 shadow-md shadow-black-300 pl-7">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Custom button styled with Tailwind */}
      <div className="flex items-center w-full">
        <label
          htmlFor="file-upload"
          className="px-5 py-2 bg-orange-500 text-white font-semibold rounded-lg cursor-pointer hover:bg-orange-600 whitespace-nowrap"
        >
          Choose File
        </label>

        {/* Display selected file name */}
        <span className="text-gray-600 ml-3 whitespace-nowrap overflow-hidden overflow-ellipsis">
          {fileName}
        </span>
      </div>
    </div>
  );
};

export default InputFile;
