import React, { ReactNode, SetStateAction, isValidElement } from "react";
import { MdFactCheck } from "react-icons/md";

interface ProcessApply {
  date?: Date;
  status?: boolean;
  text?: string;
  icon?: ReactNode;
  setIsInfoModal?: () => void;
}

const ProcessApply: React.FC<ProcessApply> = ({
  date,
  status,
  icon,
  text,
  setIsInfoModal,
}) => {
  const dateObject: {
    month: string;
    day: string;
  } = {
    month: "",
    day: "",
  };
  if (date) {
    const realDate = new Date(date);
    const formattedDate = realDate.toLocaleDateString("en-US", {
      month: "short", // Abbreviated month (e.g., "Jan", "Feb")
      day: "2-digit", // Two-digit day (e.g., "01", "28")
    });
    dateObject.month = formattedDate.split(" ")[0];
    dateObject.day = formattedDate.split(" ")[1];
  }
  return (
    <div className="flex flex-col justify-center w-full pt-2 ">
      <div className="container w-full ">
        <div className="flex items-center gap-10">
          <label
            className={`${status ? "block" : " opacity-0 "} flex flex-col w-[60px]`}
          >
            {dateObject.month} <span>{dateObject.day}</span>
          </label>
          <span
            className={` ${status ? "text-orange-500" : "text-gray-400"} p-5 flex justify-center rounded-full items-center text-xl bg-white shadow-md `}
            onClick={() => {
              if (setIsInfoModal) {
                setIsInfoModal();
              }
            }}
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
                  className={` ${status ? "bg-orange-400" : "bg-gray-400"} flex w-[2px] h-5 items-center gap-20 `}
                />
                <span
                  className={` ${status ? "bg-orange-400" : "bg-gray-400"} flex w-[2px] h-2 items-center gap-20 `}
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
