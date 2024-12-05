"use client";
import React, { useEffect, useState } from "react";
import MiniCardResume from "../resume/mini-card-resume";
import { BackButton_md } from "../back/BackButton";
import { ImCheckmark } from "react-icons/im";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import axiosInstance from "@/utils/axios";
import SkeletonLoader from "@/components/cv-rating-card/router-page/basic/skeleton";
import CallToAction from "@/components/calltoaction/call-to-action";
import { CvData } from "@/utils/types/user-profile";

const SelectCV = () => {
  const [cvs, setCvs] = useState<CvData | null>(null);
  const [next, setNext] = useState<boolean>(false);
  const [reFetch, setRefetch] = useState<boolean>(false);

  useEffect(() => {
    const getCv = async () => {
      try {
        setRefetch(true);
        const check_cv = await axiosInstance.get(
          API_ENDPOINTS.USER_SERVICE_CV_FILE
        );

        if (check_cv.status === 200) {
          setCvs(check_cv.data.data);
        }
      } catch (error) {
      } finally {
        setRefetch(false);
      }
    };
    getCv();
  }, [next]);

  const handleSelectCV = async (item: { url: string; _id: string }) => {
    try {
      const response = await axiosInstance.put(
        API_ENDPOINTS.USER_PROFILE_DETAIL,
        { cv: item.url }
      );
      console.log("cv into user detial", response);
    } catch (error) {
      console.log("error wirh upload cv to user profile detail", error);
    } finally {
      history.back();
    }
  };

  return (
    <div className="w-full ">
      {reFetch && <SkeletonLoader text="loading..." />}
      {cvs?.cv.length! <= 0 ||
        (!cvs && (
          <CallToAction
            text="No Cv Please Upload"
            buttonText="Upload Cv"
            buttonLink="/resume"
          />
        ))}
      <span onClick={() => history.back()}>
        {" "}
        <BackButton_md styles="absolute bg-white p-3 px-4 rounded-xl top-9 left-4 " />
      </span>
      <div className="flex flex-col w-full h-full gap-3 pb-20 overflow-scroll ">
        {cvs?.cv?.map((item: { url: string; _id: string }, index: number) => (
          <div
            className="relative h-full bg-white rounded-lg shadow-lg "
            key={index}
          >
            <MiniCardResume
              item={item}
              handlePush={() => handleSelectCV(item)}
              ReactNode_Child={<ImCheckmark className="text-green-600" />}
              index={index}
              next={next}
              setNext={setNext}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectCV;
