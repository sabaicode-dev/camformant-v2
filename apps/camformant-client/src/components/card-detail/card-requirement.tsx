import React from "react";

interface CardReqProps {
  required_experience?: string[];
}

export const CardReq: React.FC<CardReqProps> = ({ required_experience }) => {
  return (
    <div className="flex flex-col justify-center p-3 pb-5 bg-white rounded-2xl drop-shadow-md">
      <h2 className="text-sm font-semibold">Position Requirement</h2>
      <ul className="pt-2 pl-6 list-disc">
        <div className="flex flex-col gap-1 text-xs">
          {required_experience &&
            required_experience.length > 0 &&
            required_experience.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
        </div>
      </ul>
    </div>
  );
};
