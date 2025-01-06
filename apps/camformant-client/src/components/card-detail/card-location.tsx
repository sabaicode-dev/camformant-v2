/* eslint-disable @next/next/no-img-element */
import { GoogleMap, Marker } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";

interface CardLocationProps {
  address?: string;
}
export const CardLocation: React.FC<CardLocationProps> = ({ address }) => {
  const [center, setCenter] = useState<google.maps.LatLngLiteral | null>(null);
  // Use the address directly as the src for the iframe
  const googleMapsUrl = `https://www.google.com/maps?q=${center ? center.lat : ""},${center ? center.lng : ""}`;
  useEffect(() => {
    if (address) {
      let mapCenter: google.maps.LatLngLiteral = { lat: 0, lng: 0 }; // Default center

      // Check if the address is in lat,lng format (e.g., "12.34, 56.78")
      const latLng = address.split(",");
      if (latLng.length === 2) {
        const lat = parseFloat(latLng[0].trim());
        const lng = parseFloat(latLng[1].trim());
        if (!isNaN(lat) && !isNaN(lng)) {
          mapCenter = { lat, lng };
        }
      }

      // Update the center state
      setCenter(mapCenter);
    }
  }, [address]);
  if (!center) return null;
  return (
    <div>
      <h1 className="pb-4 pl-3 text-sm font-semibold">Location</h1>
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "200px",
          borderRadius: "12px",
        }}
        center={center!}
        zoom={14}
        options={{
          draggable: true, // Ensure the map is draggable
        }}
      >
        <Marker position={center!} />
      </GoogleMap>
      <div className="flex justify-center font-semibold">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primaryCam hover:underline mt-4 inline-block text-center"
        >
          Open in Google Maps
        </a>
      </div>
    </div>
  );
};
