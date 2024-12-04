"use client";
import Editor from "@/features/editor/components/editor";
import React, { useEffect, useRef, useState } from "react";
import "@/app/globals.css";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import { CvContentParams } from "@/features/editor/types";
import SkeletonLoader from "@/components/cv-rating-card/router-page/basic/skeleton";
import { setStructureUserdata } from "@/features/editor/utils";
import CallToAction from "@/components/calltoaction/call-to-action";
import { BackButton_md } from "@/components/back/BackButton";
import Link from "next/link";

const Page = ({ params }: { params: { userId: string } }) => {
  const { userId } = params;
  const [cvContent, setCvContent] = useState<CvContentParams>({
    style: "",
    json: {
      version: "",
      objects: [],
      clipPath: {},
    },
    userData: {},
  });
  const hasFetched = useRef(false);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    async function fetchData() {
      if (hasFetched.current) return; // Prevent double-fetching
      hasFetched.current = true;
      try {
        setLoading(true); // Show loading spinner while fetching data
        const userTemplate = await axiosInstance.get(
          API_ENDPOINTS.USER_CUSTOM_CV
        );
        const { data } = await axiosInstance.get(
          API_ENDPOINTS.USER_PROFILE_DETAIL
        );

        setCvContent({
          ...userTemplate.data.data,
          ...setStructureUserdata(data.data),
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  if (!userId || userId == "undefined") {
    console.log("userid", userId);
    return (
      <div>
        <div className="h-10 mx-2 mt-4 mb-8 w-14">
          <Link href={"/resume"}>
            <BackButton_md styles="bg-primaryCam p-3 px-4 rounded-xl text-gray-200" />
          </Link>
        </div>
        <CallToAction
          text="Login To Generate Cv"
          buttonText="Go to Login"
          buttonLink="/login"
        />
      </div>
    );
  }
  return (
    <div className="h-full bg-muted-foreground">
      {loading ? (
        <SkeletonLoader text="loading..." />
      ) : (
        <Editor cvContent={cvContent} setCvContent={setCvContent} />
      )}
    </div>
  );
};

export default Page;
