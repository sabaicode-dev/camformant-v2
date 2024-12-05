"use client";
import { MdCalendarToday } from "react-icons/md";
import { dateFormat } from "@/utils/date";
import { FaMapMarkerAlt } from "react-icons/fa";
import "react-loading-skeleton/dist/skeleton.css";
import Heart from "./heart";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImCross } from "react-icons/im";
import React, { SetStateAction } from "react";

interface CardProps {
  userId?: string;
  _id?: string;
  deadline?: Date;
  title?: string;
  position?: string[];
  profile?: string;
  min_salary?: number;
  max_salary?: number;
  job_opening?: string | number;
  type?: string[];
  schedule?: string[];
  location?: string;
  day?: number | string;
  isFavorite?: boolean;
  setHeart?: () => void;
  heart?: boolean;
  deleteFunc?: () => void;
  handleDropDownClick?: (e: React.MouseEvent) => void;
}

export const Card: React.FC<CardProps> = (props) => {
  const {
    _id,
    title,
    position,
    schedule,
    job_opening,
    deadline,
    profile,
    min_salary,
    max_salary,
    location,
    type,
    heart,
    setHeart,
    deleteFunc,
    handleDropDownClick,
  } = props;
  const router = useRouter();
  return (
    <div className="p-5 bg-white shadow drop-shadow-md rounded-2xl">
      <div
        className="flex justify-between"
        onClick={() => {
          if (deleteFunc) router.push(`/jobs/${_id}`);
        }}
      >
        <section className="flex items-center gap-x-5">
          <Image
            src={profile||""}
            alt={title! || profile!}
            width={48}
            height={48}
            className="object-cover w-12 h-12 rounded-full"
          />
          <div>
            <h1 className="font-semibold text-md text-secondaryCam">{title}</h1>
            <span className="text-sm text-secondaryCam">
              {position?.map((text) => `${text} `)}
            </span>
          </div>
        </section>

        {heart != undefined && setHeart && (
          <section>
            <Heart heart={heart} handleLove={setHeart} />
          </section>
        )}
        {deleteFunc && (
          <ImCross
            className="text-red-600 mt-2"
            onClick={(event: React.MouseEvent) => {
              event.stopPropagation();
              deleteFunc();
            }}
          />
        )}
      </div>
      <div
        onClick={(e: React.MouseEvent) => {
          if (handleDropDownClick) handleDropDownClick(e);
          else router.push(`/jobs/${_id}`);
        }}
      >
        <div>
          <div className="flex flex-wrap space-x-2 text-xs text-primaryCam ">
            {type &&
              type.length > 0 &&
              type.map((item, index) => (
                <span
                  key={index}
                  className="bg-orange-50 px-3 py-1.5 rounded-full mt-5 "
                >
                  {item}
                </span>
              ))}
          </div>
          <div className="flex flex-wrap mt-3 space-x-2 text-xs text-primaryCam ">
            {schedule &&
              schedule.length > 0 &&
              schedule.map((item, index) => (
                <span
                  key={index}
                  className=" bg-orange-50 px-3 py-1.5 rounded-full"
                >
                  {item}
                </span>
              ))}
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-400">
              {job_opening} Job Opening
            </div>
            <div className="text-lg font-semibold text-primaryCam">{`${min_salary}$-${max_salary}$`}</div>
          </div>

          {deadline && (
            <div className="flex justify-between mt-3">
              <div className="flex items-center space-x-2 text-secondaryCam">
                <label className="text-sm ">
                  <MdCalendarToday />
                </label>
                <span className="text-xs">{dateFormat(deadline, "en-US")}</span>
              </div>
              <div className="flex space-x-2 text-secondaryCam">
                <label className="text-sm">
                  <FaMapMarkerAlt />
                </label>
                <span className="text-xs">{location}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
