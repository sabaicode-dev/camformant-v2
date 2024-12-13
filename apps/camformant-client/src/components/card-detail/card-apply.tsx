/* eslint-disable @next/next/no-img-element */
import React from "react";
import Image from "next/image";
import { dateFormat, getRelativeTime } from "@/utils/date";
import { MdCalendarToday } from "react-icons/md";

interface CardApplyProps {
  profile?: string;
  name?: string;
  location?: string;
  job_opening?: string;
  deadline?: Date;
  createdAt?: Date;
}

export const CardApply: React.FC<CardApplyProps> = ({
  profile,
  name,
  location,
  deadline,
  job_opening,
  createdAt,
}) => {
  // Check if createdAt is a valid Date object
  const validCreatedAt =
    createdAt instanceof Date && !isNaN(createdAt.getTime());

  return (
    <div className="flex flex-col p-5 bg-white shadow-md rounded-2xl">
      <div className="flex items-start justify-start gap-5 ">
        <Image
          src={profile || ""}
          width={75}
          height={75}
          alt={name || "logo"}
          className="object-cover w-16 h-16 rounded-full drop-shadow-xl"
        />
        <div className="flex flex-col justify-center gap-4">
          <div>
            <h1 className="text-base font-semibold text-secondaryCam">
              {name}
            </h1>
            <p className="pt-1 text-xs text-gray-400">{location}</p>
          </div>
          <p className="text-xs text-gray-400">{job_opening} Job Opening </p>
        </div>
      </div>
      <div className="flex justify-between mt-9">
        {deadline && (
          <span className="flex items-center gap-2 text-xs text-red-500 ">
            <MdCalendarToday />
            {dateFormat(deadline, "en-US")}
          </span>
        )}
        {validCreatedAt ? (
          <p className="text-xs text-gray-400">{getRelativeTime(createdAt)}</p>
        ) : (
          <p className="text-xs text-gray-400">No deadline provided</p>
        )}
      </div>
    </div>
  );
};
