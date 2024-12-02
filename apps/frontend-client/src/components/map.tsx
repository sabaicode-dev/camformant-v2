"use client";
import { Jobs } from "@/utils/types/form-type";
import { Loader } from "@googlemaps/js-api-loader";
import React, { SetStateAction, useEffect, useRef, useState } from "react";


const Map: React.FC<{
  setFormData: React.Dispatch<SetStateAction<Jobs>>;
}> = ({ setFormData }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<google.maps.Marker | null>(null); // Store the marker reference
  const [initialLocation, setInitialLocation] =
    useState<google.maps.LatLngLiteral | null>(null); // To store the initial location
  const [location, setLocation] = useState<string>(""); // State to store the current address
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State to handle error messages

  // Reverse geocoding function to convert lat/lng to an address
  const reverseGeocode = (location: google.maps.LatLngLiteral) => {
    const geocoder = new google.maps.Geocoder();
    geocoder
      .geocode({ location })
      .then((response) => {
        if (response.results && response.results.length > 0) {
          const formattedAddress = response.results[0].formatted_address;

          console.log("hello user", location); //current address user
          const locArr = formattedAddress.split(",").slice(-2);
          const locationString = `${locArr[0].trim()}, ${locArr[1].trim()}`;
          setFormData((prev: Jobs) => {
            return {
              ...prev,
              location: locationString,
              address:`${location.lat},${location.lng}`
            };
          });
          console.log("adree",locArr)
          setLocation(formattedAddress); // Set the current address state
        } else {
          console.error("No address found for this location.");
        }
      })
      .catch((error) => {
        console.error("Error during geocoding:", error);
      });
  };

  // Function to check geolocation permissions
  const checkGeolocationPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: "geolocation" });
      if (result.state === "denied") {
        setErrorMessage(
          "Geolocation access denied. Please enable location permissions."
        );
        return false;
      }
      return true;
    } catch (error) {
      setErrorMessage("Error checking geolocation permissions.");
      return false;
    }
  };

  useEffect(() => {
    const initializeMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string, // Replace with your actual API key
          version: "quarterly",
        });

        // Load Google Maps libraries
        const { Map } = (await loader.importLibrary(
          "maps"
        )) as typeof google.maps;
        const { Marker } = (await loader.importLibrary(
          "marker"
        )) as google.maps.MarkerLibrary;

        // Check if the browser supports Geolocation
        if (!navigator.geolocation) {
          setErrorMessage("Geolocation is not supported by this browser.");
          return;
        }

        // Check if geolocation permissions are granted
        const hasPermission = await checkGeolocationPermission();
        if (!hasPermission) return;

        // Get user's current location with higher accuracy
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            console.log("User Location:", userLocation); // Log the location to verify it's correct
            setInitialLocation(userLocation); // Store the initial location

            // Map options
            const mapOptions: google.maps.MapOptions = {
              center: userLocation,
              zoom: 15, // Closer zoom to focus on the user's location
            };

            // Initialize the map
            const map = new Map(mapRef.current as HTMLDivElement, mapOptions);

            // Initialize marker at user's location
            const userMarker = new Marker({
              position: userLocation,
              map: map,
              title: "You are here", // Tooltip text
              draggable: true, // Enable marker dragging
            });

            // Store the marker reference in useRef
            markerRef.current = userMarker;

            // Add dragend event listener to update position when the marker is moved
            userMarker.addListener("dragend", () => {
              const newPosition = userMarker.getPosition();
              if (newPosition) {
                const newLocation = newPosition.toJSON();
                console.log(
                  "New Marker Position:",
                  newLocation,
                  initialLocation
                );
                // You could update the address when the marker is dragged as well
                reverseGeocode(newLocation);
                console.log("adressafter drag", location);
              }
            });

            // Reverse geocode to get the address from coordinates
            await reverseGeocode(userLocation);

            console.log("Map and Marker initialized successfully.");
          },
          (error) => {
            console.error("Error getting current position:", error);
            setErrorMessage(
              "Failed to retrieve location. Please check your permissions or try again later."
            );
          },
          {
            enableHighAccuracy: true, // Request higher accuracy
            timeout: 10000, // Wait for 10 seconds before timeout
            maximumAge: 0, // Ensure the location is fresh
          }
        );
      } catch (error) {
        console.error("Error loading Google Maps:", error);
        setErrorMessage("Error initializing map. Please try again later.");
      }
    };

    initializeMap();
  }, []);

  const resetToCurrentLocation = (e: React.MouseEvent) => {
    e.preventDefault();
    if (markerRef.current && initialLocation) {
      markerRef.current.setPosition(initialLocation); // Reset marker position to initial location
      // Optionally, update address when resetting location
      reverseGeocode(initialLocation);
    }
  };

  return (
    <div>
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      <div style={{ height: "400px", width: "100%" }} ref={mapRef}></div>
      <div style={{ marginTop: "10px" }}>
        <strong>Current Address:</strong>
        <p>{location || "Fetching address..."}</p>
      </div>
      <button onClick={resetToCurrentLocation} style={{ marginTop: "10px" }}>
        Reset to Current Location
      </button>
    </div>
  );
};

export default Map;
