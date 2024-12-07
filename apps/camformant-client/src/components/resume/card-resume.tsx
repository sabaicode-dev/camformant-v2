"use client";

import React, { useEffect, useState } from "react";
import Mypic from "../../../public/images/Croods User Interface.png";
import AttachedCvs from "@/components/resume/attached-cv";
import Image from "next/image";
import MiniCardResume from "./mini-card-resume";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import SkeletonLoader from "../cv-rating-card/router-page/basic/skeleton";
import { CvData } from "@/utils/types/user-profile";

const CardResume: React.FC = () => {
  const [show, setShow] = useState<boolean>(false);
  const [cvs, setCvs] = useState<CvData | null>(null);
  const [next, setNext] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getCv = async () => {
      try {
        setLoading(true);
        const check_cv = await axiosInstance.get(
          API_ENDPOINTS.USER_SERVICE_CV_FILE
        );
        if (check_cv.status == 200) {
          setCvs(check_cv.data.data); // Set the entire response data, which includes the 'cv' array
          setShow(check_cv.data.data.cv.length > 0); // Set show based on whether there are CVs
        } else {
          setShow(false);
        }
      } catch (error) {
        console.error("Error fetching CV data:", error);
        setShow(false);
      } finally {
        setLoading(false);
      }
    };
    getCv();
  }, [next]);

  return (
    <div className="h-[400px] ">
      <AttachedCvs setNext={setNext} setLoading={setLoading} />

      {!show && (
        <div className="flex flex-col items-center justify-center pt-5">
          <h1 className="w-full pb-5 text-xl font-semibold">My Resume</h1>
          <Image
            src={Mypic}
            alt="Default profile image"
            width={252}
            height={188}
          />
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-sm">Sorry, You Do not Have a Resume Yet.</h1>
            <p className="text-xs text-gray-400">You will see your data when</p>
            <p className="text-xs text-gray-400">you have uploaded your CV.</p>
          </div>
        </div>
      )}

      {loading && <SkeletonLoader text="Loading..." />}

      {show && (
        <div className="flex flex-col items-center justify-center pt-5 pb-20">
          <h1 className="w-full pb-5 text-xl font-semibold">My Resume</h1>
          <div className="flex flex-col w-full gap-3 ">
            {cvs?.cv?.map(
              (item: { url: string; _id: string }, index: number) => (
                <div key={index} className="relative w-full h-full">
                  <MiniCardResume
                    item={item}
                    index={index}
                    setNext={setNext}
                    style="translate-x-[-70px]"
                  />
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardResume;
