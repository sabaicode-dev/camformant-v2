"use client";
import React from "react";
import Background from "@/components/background/background";
import { FaUpload } from "react-icons/fa";
import CardResume from "@/components/resume/card-resume";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import SkeletonLoader from "@/components/cv-rating-card/router-page/basic/skeleton";

const PuzzleResume = () => {
  const route = useRouter();
  return (
    <Background style="rounded-3xl bg-mybg-linear ">
      <div className="w-full h-full flex gap-4 flex-col  ">
        <button
          className=" mt-[-10%] w-full shadow-xl rounded-3xl flex justify-start p-10 items-center bg-white"
          onClick={() => {
            route.push("/cv-ratingcvData[index]");
          }}
        >
          <span className=" pr-4 text-red-500">
            <FaUpload />
          </span>
          Create & Generate CV Online
        </button>

        <CardResume />
      </div>
    </Background>
  );
};

export default PuzzleResume;
