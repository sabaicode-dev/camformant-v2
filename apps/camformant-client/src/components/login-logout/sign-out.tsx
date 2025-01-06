import React from "react";
import { RxExit } from "react-icons/rx";

interface LogoutProps {
  isLogout: string | null;
  onHandleLogout: React.MouseEventHandler<HTMLSpanElement>;
}

const ButtonSignOut: React.FC<LogoutProps> = ({ isLogout, onHandleLogout }) => {
  return (
    <div className="flex items-center justify-start w-full p-4 bg-white drop-shadow-md rounded-3xl">
      <span
        onClick={onHandleLogout}
        className="flex items-center gap-5 text-lg cursor-pointer text-primaryCam"
      >
        <RxExit className="text-2xl" />
        {isLogout ? "Sign Out" : "Login to Your Account"}
      </span>
    </div>
  );
};

export default ButtonSignOut;
