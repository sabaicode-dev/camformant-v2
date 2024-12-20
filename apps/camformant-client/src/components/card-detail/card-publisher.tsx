import React from "react";
import Image from "next/image";

export interface CardCompanyProps {
  profile?: string;
  name?: string;
  bio?: string;
  phone_number?: string;
  email?: string;
}

export const JobPublisher: React.FC<CardCompanyProps> = ({
  name,
  bio,
  phone_number,
  email,
  profile,
}) => {
  return (
    <div className="container py-2 bg-white rounded-2xl drop-shadow-lg">
      <h1 className="text-sm font-semibold">Job Publisher</h1>
      <div className="grid grid-cols-4 gap-2 pt-4">
        <div className="col-span-1">
          <Image
            src={profile || ""}
            width={75}
            height={75}
            alt={name || "logo"}
            className="object-cover w-16 h-16 rounded-full drop-shadow-xl"
          />
        </div>
        <div className="col-span-3">
          <div className="flex flex-col gap-5 text-xs">
            <div>
              <h1 className="text-sm font-semibold">{name} </h1>
              <div className="prose pt-1 text-gray-400 " dangerouslySetInnerHTML={{__html : bio || ""}}/>
            </div>
            <div className="pb-3 text-xs">
              <h1>{phone_number} </h1>
              <p className="pt-1">{email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
