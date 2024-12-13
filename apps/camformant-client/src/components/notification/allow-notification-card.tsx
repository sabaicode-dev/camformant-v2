import React from "react";
import Image from "next/image";
import { useNotification } from "@/hooks/user-notification";

const AllowNotificationCard = ({
  isShowPopup = false,
  handlePopupNotification,
}: {
  isShowPopup: boolean;
  handlePopupNotification?: () => void;
}) => {
  const { addNotification } = useNotification();
  async function checkPermission() {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      addNotification("Notification Access Dined", "error");
      return;
    } else if (permission === "granted") {
      addNotification("Notification Enabled", "success");
      return "granted";
    }
  }
  const handlePermissionNotification = async () => {
    checkPermission();
  };
  if (isShowPopup) {
    return (
      <div
        className="bg-white rounded-lg drop-shadow-md
       fixed z-50 w-[310px] h-[200px] transform -translate-x-1/2 top-5 left-1/2 flex flex-col items-center justify-evenly"
      >
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/icons/bell-notification.png"
            alt="bell"
            width={2500}
            height={2500}
            className="size-14"
          />
          <p className="text-lg font-semibold text-secondaryCam">
            Please Allow Notification!
          </p>
          <p className="text-sm font-medium text-secondaryCam">
            Keep up with new annoucement.
          </p>
        </div>
        <div className="flex items-center gap-12 justify-normal">
          <p
            className="px-4 py-2 text-sm text-red-500 rounded-md hover:cursor-pointer hover:bg-slate-100"
            onClick={handlePopupNotification}
          >
            Cancel
          </p>
          <p
            className="px-4 py-2 text-sm text-white rounded-md bg-mybg-linear hover:cursor-pointer"
            onClick={() => {
              handlePopupNotification!();
              handlePermissionNotification();
            }}
          >
            Allow
          </p>
        </div>
      </div>
    );
  }
  return;
};

export default AllowNotificationCard;
