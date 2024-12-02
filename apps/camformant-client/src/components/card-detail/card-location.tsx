/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";

interface CardLocationProps {
  address?: string;
}

export const CardLocation: React.FC<CardLocationProps> = ({ address }) => {
  // Use the address directly as the src for the iframe
  const googleMapsUrl =
    `https://www.google.com/maps/embed/v1/place?q=${address}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}` ||
    "";
  return (
    <div>
      <h1 className="pb-4 pl-3 text-sm font-semibold">Location</h1>
      <iframe
        className="w-full h-52 rounded-3xl"
        src={googleMapsUrl}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};
