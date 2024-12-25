"use client";

import React, { useEffect, useRef, useState } from "react";
import NoApply from "./no-apply";

import CardStatus from "./card-status";
import { useAuth } from "@/context/auth";
import CallToAction from "../calltoaction/call-to-action";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import {
  ApplyParams,
  StatusLengthParams,
  StatusType,
} from "@/utils/types/jobApply";
const ApplyStatus: React.FC = () => {
  const [statusLength, setStatusLength] = useState<StatusLengthParams>({
    Apply: 0,
    Review: 0,
    Shortlist: 0,
    Interview: 0,
    Accept: 0,
  });
  const [fetching, setFetching] = useState<boolean>(false);
  const [allStatusData, setAllStatusData] = useState<ApplyParams[]>([]);
  const { isAuthenticated, user } = useAuth();
  const uniqueIds = useRef<string[]>([]); //for unnqiue id when count the length

  const setLength = (status: string, id: string) => {
    if (!uniqueIds.current.includes(id)) {
      uniqueIds.current.push(id);
      setStatusLength((prevStatus: StatusLengthParams) => ({
        ...prevStatus,
        [status]: prevStatus[status as StatusType] + 1,
      }));
    }
  };
  useEffect(() => {
    async function fetchData() {
      try {
        if (!user) return;
        setFetching(true);
        const res = await axiosInstance.get(
          `${API_ENDPOINTS.JOB_APPLY}?userId=${user!._id}`
        );
        setAllStatusData(res.data.data);
        res.data.data.forEach((applyData: ApplyParams) => {
          switch (applyData.userInfo.status) {
            case "Apply": {
              setLength("Apply", applyData._id);
              break;
            }
            case "Shortlist": {
              setLength("Shortlist", applyData._id);
              break;
            }
            case "Interview": {
              setLength("Interview", applyData._id);
              break;
            }
            case "Review": {
              setLength("Review", applyData._id);
              break;
            }
            case "Accept": {
              setLength("Accept", applyData._id);
              break;
            }
          }
        });
      } catch (error) {
        console.error("Error fetching apply data:", error);
      } finally {
        setFetching(false);
      }
    }
    fetchData();
  }, [user]);
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center px-8 gap-y-10">
        <div className="flex items-center justify-start w-full mt-20 text-xl"></div>
        <CallToAction
          text="Please Login to your Account"
          buttonLink="/login"
          buttonText="Login"
        />
      </div>
    );
  }
  return (
    <div className="container flex flex-col justify-start h-screen gap-5 pt-12 ipse:text-sm ipx:text-base">
      <div className="flex items-center justify-center gap-5 p-4 bg-white drop-shadow-md rounded-xl">
        {Object.entries(statusLength).map(([key, value]) => {
          return (
            <div
              key={key}
              className="flex flex-col items-center justify-center gap-1"
            >
              <span>{value}</span>
              <span className="text-sm">{key}</span>
            </div>
          );
        })}
      </div>
      {!allStatusData.length && !fetching ? (
        <NoApply />
      ) : (
        <div>
          <CardStatus
            applyData={allStatusData}
            isLoading={fetching}
            setApplyData={setAllStatusData}
            setStatusLength={setStatusLength}
          />
        </div>
      )}
    </div>
  );
};

export default ApplyStatus;
