"use client";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { Card } from "../card/card";
import { BiSolidChat } from "react-icons/bi";
import { BsFileTextFill } from "react-icons/bs";
import { IoEyeSharp } from "react-icons/io5";
import { MdFactCheck } from "react-icons/md";
import { PiTextAlignLeftFill } from "react-icons/pi";
import "react-loading-skeleton/dist/skeleton.css";
import SkeletonCard from "@/components/skeleton/skeleton-card";
import {
  ApplyParams,
  StatusLengthParams,
  StatusType,
} from "@/utils/types/jobApply";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import PopUpModal from "../popup-modal/popup-modal";
import ProcessApply from "./process-apply";
import { formatDate } from "@/utils/functions/date-to-string";

// Process Template Mapping
const processTemplate: {
  [key: string]: { text: string; status: string; icon: JSX.Element };
} = {
  "1": {
    text: "Application Submitted",
    status: "Apply",
    icon: <BsFileTextFill />,
  },
  "2": { text: "Under Review", status: "Review", icon: <IoEyeSharp /> },
  "3": {
    text: "Shortlisted",
    status: "Shortlist",
    icon: <PiTextAlignLeftFill />,
  },
  "4": {
    text: "Interview Scheduled",
    status: "Interview",
    icon: <BiSolidChat />,
  },
  "5": { text: "Accepted", status: "Accept", icon: <MdFactCheck /> },
};
interface attForUpDateParams {
  id?: string;
  status?: string;
  interviewDate?: string;
  interviewLocation?: string;
  startDate?: string;
}
interface ApplyTotal {
  applyData: ApplyParams[];
  setApplyData: React.Dispatch<SetStateAction<ApplyParams[]>>;
  setStatusLength: React.Dispatch<SetStateAction<StatusLengthParams>>;
  isLoading: boolean;
}

const CardStatus: React.FC<ApplyTotal> = ({
  applyData,
  isLoading,
  setApplyData,
  setStatusLength,
}) => {
  const [status, setStatus] = useState<string | undefined | null>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isInfoModal, setIsInfoModal] = useState<boolean>(false);
  const prevStatusArr: string[] = [];
  let [attForUse, setAttForUse] = useState<attForUpDateParams>({});
  const refToStart = useRef<(HTMLDivElement | null)[]>([]);

  const handleClick = async (id: string | undefined, index: number) => {
    if (status === "") {
      setStatus("");
      setTimeout(() => {
        setStatus(id);
        refToStart.current[index]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 500);
    } else if (status === id) {
      setStatus("");
    } else {
      setStatus("");
      setTimeout(() => {
        setStatus(id);
        refToStart.current[index]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await axiosInstance.delete(
        `${API_ENDPOINTS.JOB_APPLY}/${id}`
      );
      if (res.status === 204) {
        setApplyData((prev: ApplyParams[]) => {
          return prev.filter((element: ApplyParams) => {
            return element._id !== id;
          });
        });
        setStatusLength((prev: StatusLengthParams) => {
          return {
            ...prev,
            [attForUse!.status!]: prev[attForUse.status as StatusType] - 1,
          };
        });
      }
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="pb-20">
      <div>{attForUse.status}</div>
      {isModalOpen && (
        <PopUpModal
          bodyText={
            isInfoModal
              ? attForUse.status == "Interview"
                ? "Interview Information:"
                : "Congraulation! You can start at"
              : "Are you sure you want to delete it?"
          }
          {...(isInfoModal
            ? {}
            : { actionFunc: () => handleDelete(attForUse!.id!) })}
          closeModal={() => {
            setIsModalOpen(false);
            isInfoModal && setIsInfoModal(false);
          }}
          {...(isInfoModal
            ? attForUse.status == "Interview"
              ? { date: attForUse.interviewDate }
              : { date: attForUse.startDate }
            : {})}
          {...(isInfoModal && attForUse.status == "Interview"
            ? { location: attForUse.interviewLocation }
            : {})}
          isInfoModal={isInfoModal}
        />
      )}
      {isLoading
        ? Array(3)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="mb-5 rounded-xl drop-shadow-md">
                <SkeletonCard />
              </div>
            ))
        : applyData?.map((item: ApplyParams, index: number) => {
            prevStatusArr.length = 0;
            for (let i = 0; i < Object.values(processTemplate).length; i++) {
              const process = Object.values(processTemplate)[i];

              if (process.status !== item.userInfo.status)
                prevStatusArr.push(process.status);
              else break;
            }

            return (
              <div
                ref={(el: any) => (refToStart.current[index] = el)}
                className="container w-full p-1"
                key={item.jobId}
              >
                <Card
                  _id={item.jobId}
                  title={item.jobInfo.title}
                  position={item.jobInfo.position}
                  profile={item.jobInfo.profile}
                  min_salary={item.jobInfo.min_salary}
                  max_salary={item.jobInfo.max_salary}
                  job_opening={item.jobInfo.job_opening}
                  type={item.jobInfo.type}
                  schedule={item.jobInfo.schedule}
                  location={item.jobInfo.location}
                  deadline={new Date(item.jobInfo.deadline || new Date())}
                  deleteFunc={() => {
                    setAttForUse({
                      id: item._id,
                      status: item.userInfo.status,
                    });
                    setIsModalOpen(true);
                  }}
                  handleDropDownClick={(event: React.MouseEvent) => {
                    event.preventDefault();
                    handleClick(item._id, index);
                  }}
                />
                <div
                  className={`${status !== item._id ? "hidden" : "block"} h-full w-full pb-7`}
                >
                  {Object.entries(processTemplate).map(
                    ([key, { text, status, icon }], i) => (
                      <ProcessApply
                        key={i}
                        status={
                          status == item.userInfo.status ||
                          prevStatusArr.some((word) => status.includes(word))
                            ? true
                            : false
                        }
                        text={text}
                        icon={icon}
                        date={
                          status == item.userInfo.status
                            ? item.updatedAt
                            : undefined
                        }
                        setIsInfoModal={() => {
                          if (
                            status == item.userInfo.status &&
                            ["Interview", "Accept"].includes(status)
                          ) {
                            console.log("item::::", item);
                            setAttForUse({
                              status: item.userInfo.status,
                              interviewDate: formatDate(
                                item.companyResponse?.interviewDate
                              ),
                              interviewLocation:
                                item.companyResponse?.interviewLocation,
                              startDate: formatDate(
                                item.companyResponse?.startDate
                              ),
                            });
                            console.log("date:::", attForUse.interviewLocation);
                            setIsModalOpen(true);
                            setIsInfoModal(true);
                          }
                        }}
                      />
                    )
                  )}
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default CardStatus;
