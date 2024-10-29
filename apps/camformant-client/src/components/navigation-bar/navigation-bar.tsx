"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiClipboardCheck,
  HiDocument,
  HiHome,
  HiUserCircle,
} from "react-icons/hi";

export const NavigationBar: React.FC = () => {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-0 z-30 w-full bg-white border-t ">
      <div className="flex justify-around p-4 gap-x-8 text-secondaryCam">
        <Link
          href="/"
          className={`flex flex-col items-center  ${pathname === "/" || pathname === "/search" ? "text-primaryCam" : ""}`}
        >
          <HiHome className="text-xl" />
          <div className="text-xs">Home</div>
        </Link>
        <Link
          href="resume"
          className={`flex flex-col items-center ${pathname === "/resume" ? "text-primaryCam" : ""}`}
        >
          <HiDocument className="text-xl" />
          <div className="text-xs">Resume</div>
        </Link>
        <Link
          href="applied"
          className={`flex flex-col items-center ${pathname === "/applied" ? "text-primaryCam" : ""}`}
        >
          <HiClipboardCheck className="text-xl" />
          <div className="text-xs">Applied</div>
        </Link>
        <Link
          href="profile"
          className={`flex flex-col items-center ${pathname === "/profile" ? "text-primaryCam" : ""}`}
        >
          <HiUserCircle className="text-xl" />
          <div className="text-xs">Profile</div>
        </Link>
      </div>
    </div>
  );
};
