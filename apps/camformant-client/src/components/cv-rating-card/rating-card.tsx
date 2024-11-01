"use client";

import React, { ReactNode } from "react";
import { FaRegUser } from "react-icons/fa6";

interface typeCrad {
  icon?: ReactNode;
  txt?: string;
  rating?: number;
}

const CardRating: React.FC<typeCrad> = ({ icon, txt, rating }) => {
  return (
    <div className="container flex flex-col w-full h-full  justify-evenly">
      <div className="flex items-center gap-6">
        <span>
          <FaRegUser />
        </span>
        <div className="w-full h-1 bg-gray-300 ">
          <div
            style={{ width: rating + "%" }}
            className={`  h-1  bg-primaryCam `}
          ></div>
        </div>
        <p>{rating}%</p>
      </div>

      <h1>{txt}</h1>
    </div>
  );
};

export default CardRating;
