import Link from "next/link";
import React, { ReactNode } from "react";

interface Props {
  text: string;
  link: string;
  icon?: ReactNode;
}

export const Button: React.FC<Props> = ({ link, text, icon }) => {
  return (
    <div className="flex items-center justify-center px-10 py-4 space-x-4 text-white bg-primaryCam rounded-xl">
      <Link href={link} className="text-md">
        {text}
      </Link>
      <div>{icon}</div>
    </div>
  );
};
