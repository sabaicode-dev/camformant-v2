import React from "react";
import Image from "next/image";
import Link from "next/link";

interface typeProfile {
  pic?: string | File;
  rating?: number;
  username: string | null;
  userId: string | null;
}

const ProfileRating: React.FC<typeProfile> = ({ pic, rating, username,userId }) => {
  return (
    <div className="flex flex-col justify-center w-full gap-3 p-8 bg-white shadow-md shadow-slate-100 rounded-se-2xl rounded-ss-2xl">
      <div className="container flex items-center gap-x-5">
        <div className="w-24 h-24 overflow-hidden border-t-2 border-b-2 border-l-2 border-r-2 border-orange-500 rounded-full ">
          <div
            className={`w-8 h-8 rounded-full ml-5 mt-3 bg-mybg-linear ${pic ? "hidden" : ""} `}
          ></div>
          <div
            className={`w-24 h-24 rounded-full mt-2 ml-[-10px] bg-mybg-linear ${pic ? "hidden" : ""} `}
          ></div>
          {pic && (
            <Image
              className={` ${pic ? "" : "hidden"}`}
              src={pic.toString()}
              height={200}
              width={200}
              alt={pic?.toString() || ""}
            />
          )}
        </div>
        <div className="flex flex-col gap-y-2 ip14:pl-0 ipse:pl-5">
          <h1 className="text-lg font-semibold">
            {username ? username : "No nickname"}
          </h1>
          <Link href={rating?`/editor/${userId}`:"/jobs/basic"}>
            <span className="text-primaryCam">Preview</span>
          </Link>
        </div>
      </div>
      <div className="container flex flex-col gap-2 ">
        <p className="text-gray-400 ">Completed {rating} %</p>
        <div className="w-full h-1 bg-gray-300 ">
          <div
            style={{ width: rating + "%" }}
            className={` transition-all duration-1000  h-1  bg-primaryCam `}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileRating;
