import React, { ReactNode, useState } from "react";
import axios from "axios";
import { FcFullTrash } from "react-icons/fc";
import { SwipeableHandlers, useSwipeable } from "react-swipeable";
import Skeleton from "react-loading-skeleton";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { BsPersonVcard } from "react-icons/bs";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import axiosInstance from "@/utils/axios";

interface typeMiniCard {
  item:{url: string; _id: string }
  index: number;
  next: boolean;
  setNext: (next: boolean) => void;
  ReactNode_Child?: ReactNode;
  handlePush?: React.MouseEventHandler<HTMLSpanElement>;
  style?: string;
  isLoading?: boolean;
}

const MiniCardResume: React.FC<typeMiniCard> = ({
  item,
  index,
  next,
  setNext,
  ReactNode_Child,
  handlePush,
  isLoading = false,
  style = "translate-x-[-120px]",
}) => {
  const [isSwiped, setIsSwiped] = useState<boolean>(false);
  const handlers: SwipeableHandlers = useSwipeable({
    onSwipedLeft: () => setIsSwiped(true),
    onSwipedRight: () => setIsSwiped(false),
    preventScrollOnSwipe: true,
    trackMouse: true,
  })
  const handleDelete = async () => {
    try {
      setNext(true);
      const res = await axiosInstance.delete(
        `${API_ENDPOINTS.USER_SERVICE_CV_FILE}/${item._id}`,
      );
      if (res.status === 200) {
        console.log("CV deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting CV:", error);
      alert("Error deleting CV");
    } finally {
      setNext(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex items-center w-full max-w-lg gap-4 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
          <Skeleton height={40} width={40} className="rounded-lg" />
          <div className="flex-1">
            <Skeleton height={35} width="80%" className="mb-2" />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div
            {...handlers}
            key={index}
            className={` z-10 duration-300 transition-all ${isSwiped ? style : "translate-x-0"} flex w-full max-w-lg p-6 items-center rounded-lg shadow-md gap-4 bg-white border border-gray-200 hover:shadow-lg transform hover:scale-105`}
          >
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center w-full h-full gap-4"
            >
              <span
                aria-label="File icon"
                className="p-1 text-3xl text-primaryCam "
              >
                <BsPersonVcard />
              </span>
              <span className="text-lg font-semibold text-gray-800">
                CV / Resume {index + 1}
              </span>
              <span className="absolute text-2xl text-primaryCam right-4 animate-back-and-forth">
                <MdOutlineKeyboardDoubleArrowLeft
                  className={`${isSwiped ? " rotate-180 " : ""}`}
                />
              </span>
            </a>
          </div>
          <div className="flex justify-between gap-5">
            <span
              onClick={handlePush}
              className={`text-2xl ${isSwiped ? " translate-x-[-70px] " : " hidden"}`}
            >
              {ReactNode_Child}
            </span>
            <span
              onClick={handleDelete}
              className={`text-3xl duration-500 transition-all absolute  ${isSwiped ? " right-5 z-20 top-6 " : " z-0 right-5 top-0 "}`}
            >
              <FcFullTrash />
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniCardResume;
