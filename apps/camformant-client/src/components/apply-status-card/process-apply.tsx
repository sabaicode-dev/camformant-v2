import React, { ReactNode, isValidElement } from "react";
import { MdFactCheck } from "react-icons/md";

interface ProcessApply {
  date?: string;
  month?: string;
  status?: boolean;
  text?: string;
  icon?: ReactNode;
}

const ProcessApply: React.FC<ProcessApply> = ({
  date,
  status,
  month,
  icon,
  text,
}) => {
  return (
    <div className="flex flex-col justify-center w-full pt-2 ">
      <div className="container w-full ">
        <div className="flex items-center gap-10">
          <label
            className={`${status ? "block" : " opacity-0 "} flex flex-col`}
          >
            {month} <span>{date}</span>
          </label>
          <span
            className={` ${status ? "text-orange-500" : "text-gray-400"} p-5 flex justify-center rounded-full items-center text-xl bg-white shadow-md `}
          >
            {icon}
          </span>
          <label className="w-full text-sm ">{text}</label>
        </div>
        <div className="relative flex items-center w-full gap-10 ">
          <span className="flex items-center w-2 h-4" />
          <span className="flex items-center w-2 h-4" />
          <div className="flex flex-col items-center w-2 gap-2">
            <span
              className={` ${status ? "block bg-primaryCam " : " hidden"} h-3 w-3  rounded-full mt-[-6px] `}
            />
            {isValidElement(icon) && icon.type !== MdFactCheck && (
              <>
                <span
                  className={` ${status ? "bg-orange-400" : "bg-gray-400"} flex w-[2px] h-5 items-center gap-10 `}
                />
                <span
                  className={` ${status ? "bg-orange-400" : "bg-gray-400"} flex w-[2px] h-2 items-center gap-10 `}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessApply;
