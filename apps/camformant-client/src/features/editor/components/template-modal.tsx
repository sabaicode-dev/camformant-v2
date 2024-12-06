import { Cross2Icon } from "@radix-ui/react-icons";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { ActiveTool, CvContentParams, Editor } from "../types";
import Image from "next/image";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import SkeletonLoader from "@/components/cv-rating-card/router-page/basic/skeleton";
import { CustomCvDataParams } from "@/utils/types/user-profile";
interface cvDataParams {
  style: string;
  thumbnail: string;
  json: any;
}
const TemplateModal: React.FC<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  onChangeActiveTool: (tool: ActiveTool) => void;
  userData: CustomCvDataParams | {};
  setCvContent: React.Dispatch<SetStateAction<CvContentParams>>;
  editor: Editor | undefined;
}> = ({
  isOpen,
  setIsOpen,
  onChangeActiveTool,
  userData,
  editor,
  setCvContent,
}) => {
  const closeModal = () => {
    setIsOpen(false);
    onChangeActiveTool("templates");
  };

  const [isLoading, setIsLoading] = useState<boolean>();
  const [cvData, setCvData] = useState<cvDataParams[]>([]);
  const hasFetched = useRef(false);
  useEffect(() => {
    async function fetchData() {
      try {
        if (hasFetched.current) return; // Prevent double-fetching
        hasFetched.current = true;
        setIsLoading(true);
        const response = await axiosInstance.get(API_ENDPOINTS.USER_CV_STYLE);
        setCvData(response.data.data);
        setIsLoading(false);
      } catch (err) {
        throw err;
      }
    }
    isOpen && fetchData();
  }, [isOpen]);
  const resetCvContent = (index: number) => {
    editor?.loadJson(cvData[index].json, cvData[index].style, userData);
    setCvContent((previous: CvContentParams) => {
      return {
        ...previous,
        json: cvData[index].json,
        style: cvData[index].style,
      };
    });
    //postCv(cvData[index]);
  };
  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      {/* Background overlay */}
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeModal}
      ></div>

      {/* Popup content */}
      <div
        className={`relative w-full max-w-md bg-white px-6 rounded-t-2xl shadow-lg transform transition-transform duration-500 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Close button */}
        <button
          className="absolute text-gray-500 top-3 right-3 hover:text-gray-700"
          onClick={closeModal}
        >
          <Cross2Icon className="w-5 h-5" />
        </button>
        {isLoading && (
          <div className="h-[500px]">
            <div>
              <SkeletonLoader text="Loading ..." />
            </div>
          </div>
        )}
        {cvData && (
          <div className="max-h-[500px] overflow-auto grid grid-cols-2 my-9 gap-4">
            {cvData!.map((template, index) => (
              <Image
                key={template.style}
                src={template.thumbnail}
                alt="template"
                width={150} // Set the specific width of each image here
                height={200} // Set the specific height of each image here
                className="object-cover w-full"
                quality={100}
                onClick={(e) => {
                  e.preventDefault();
                  resetCvContent(index);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateModal;
