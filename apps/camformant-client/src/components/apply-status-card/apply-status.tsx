"use client";

import React, { useEffect, useState } from "react";
import NoApply from "./no-apply";

import CardStatus from "./card-status";
import { useAuth } from "@/context/auth";
import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ApplyStatus: React.FC = () => {
  const [apply, setApply] = useState<number>(1);
  const [shortList, setShortList] = useState<number>(0);
  const [interview, setInterview] = useState<number>(0);
  const [status, setStatus] = useState<boolean>(true);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center px-8 gap-y-10">
        <div className="flex items-center justify-start w-full mt-20 text-xl">
          <span
            className="p-2 text-3xl text-white rounded-lg hover:cursor-pointer bg-primaryCam"
            onClick={() => router.back()}
          >
            <IoArrowBack />
          </span>
        </div>
        <h1 className="text-xl text-center text-primaryCam">
          Please Login to your Account
        </h1>

        <Link href="/login" className="p-3 text-white rounded-xl bg-primaryCam">
          Login
        </Link>
      </div>
    );
  }
  return (
    <div className="container flex flex-col justify-start h-screen gap-5 pt-12 ipse:text-sm ipx:text-base">
      <div className="flex items-center justify-center gap-5 p-4 bg-white drop-shadow-md rounded-xl">
        <div className="flex flex-col items-center justify-center gap-1 ">
          <span>{apply}</span>
          <span className="text-sm">Job Applied</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 ">
          <span>{interview}</span>
          <span className="text-sm">Interview</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 ">
          <span>{shortList}</span>
          <span className="text-sm">Short List</span>
        </div>
      </div>
      {apply === 0 ? (
        <NoApply />
      ) : (
        <div>
          <CardStatus setTotal={setApply} total={apply} />
        </div>
      )}
    </div>
  );
};

export default ApplyStatus;
