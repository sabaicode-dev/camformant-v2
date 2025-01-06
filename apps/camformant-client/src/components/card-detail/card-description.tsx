import Data2 from "@/components/type-data/TypeofData";
import React from "react";

interface CardApplyProps {
  title?: string;
  min_salary?: string;
  max_salary?: string;
  schedule?: string[];
  description?: string;
  benefit?: string[];
}

export const CardDescription: React.FC<CardApplyProps> = ({
  title,
  min_salary,
  max_salary,
  schedule,
  description,
  benefit,
}) => {
  return (
    <div className="flex flex-col justify-center w-full p-3 pb-6 bg-white shadow-md rounded-2xl">
      <div className="flex justify-between w-full ">
        <h2 className="text-sm font-semibold ">{title}</h2>
        {/* <p className="text-sm text-gray-400 ">5 Application</p>s */}
      </div>
      <div className="text-xs">
        <div className="pt-3 text-base font-semibold text-primaryCam">
          {min_salary}$-{max_salary}$
        </div>
        <div className="flex flex-wrap pt-3 space-x-3 text-sm font-semibold text-primaryCam">
          {schedule &&
            schedule.length > 0 &&
            schedule.map((item, index) => <span key={index}>{item}</span>)}
        </div>
        <div className="flex flex-wrap pt-1 space-x-3 text-sm font-semibold text-primaryCam">
          {benefit &&
            benefit.length > 0 &&
            benefit.map((item, index) => <span key={index}>{item}</span>)}
        </div>

        <h2 className="pt-3 text-base font-semibold">Job Description </h2>
        <p className="pt-2 text-xs ">{description}</p>
      </div>
    </div>
  );
};
