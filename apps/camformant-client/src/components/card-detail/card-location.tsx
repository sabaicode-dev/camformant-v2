/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";

interface CardLocationProps {
  address?: string;
}

export const CardLocation: React.FC<CardLocationProps> = ({ address }) => {
  // Use the address directly as the src for the iframe
  const googleMapsUrl = address || "";
  console.log("googleMapsUrl:", googleMapsUrl);

  return (
    <div>
      <h1 className="pb-4 pl-3 text-sm font-semibold">Location</h1>
      <Link href={address || ""} target="_blank">
        <iframe
          className="w-full h-52 rounded-3xl"
          src={googleMapsUrl}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </Link>
    </div>
  );
};
