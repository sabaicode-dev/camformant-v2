"use client";

import React, { useEffect, useState } from "react";
import NoApply from "./no-apply";

import CardStatus from "./card-status";

const ApplyStatus: React.FC = () => {
  const [apply, setApply] = useState<number>(1);
  const [shortList, setShortList] = useState<number>(0);
  const [interview, setInterview] = useState<number>(0);
  const [status, setStatus] = useState<boolean>(true);
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
