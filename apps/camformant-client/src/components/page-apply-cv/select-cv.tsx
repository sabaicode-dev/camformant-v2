"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import MiniCardResume from "../resume/mini-card-resume";
import SkeletonLoader from "../cv-rating-card/router-page/basic/skeleton";
import { BackButton_md } from "../back/BackButton";
import { ImCheckmark } from "react-icons/im";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import axiosInstance from "@/utils/axios";

interface CvData {
  cv: string[];
}
const SelectCV = () => {
  const [cvs, setCvs] = useState<CvData | null>(null);
  const [next, setNext] = useState<boolean>(false);
  const [cvIndex, setCvIndex] = useState<number>(0);
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

  const handleSelectCV = (index: number) => {
    try {
      setCvIndex(index);
      localStorage.setItem("selectedCvIndex", index.toString());
    } catch (error) {
    } finally {
      history.back();
    }
  };

  return (
    <div className="w-full ">
      <span onClick={() => history.back()}>
        {" "}
        <BackButton_md styles="absolute bg-white p-3 px-4 rounded-xl top-9 left-4 " />
      </span>
      <div className="flex flex-col w-full h-full gap-3 pb-20 overflow-scroll ">
        {cvs?.cv?.map((item: string, index: number) => (
          <div
            className="relative h-full bg-white rounded-lg shadow-lg "
            key={index}
          >
            <MiniCardResume
              handlePush={() => handleSelectCV(index)}
              ReactNode_Child={<ImCheckmark className="text-green-600" />}
              name={item}
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
