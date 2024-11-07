"use client";
import Button from "@/components/cv-rating-card/router-page/basic/button-addremove";
import HeaderBasic from "@/components/cv-rating-card/router-page/basic/header-basic";
import SkeletonLoader from "@/components/cv-rating-card/router-page/basic/skeleton";
import InputComponent from "@/components/input-field/input-component";
import { useAuth } from "@/context/auth";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import {
  addEntry,
  deleteEntry,
  handleInputChange,
} from "@/utils/functions/input-functions";
import { PortfolioParam } from "@/utils/types/user-profile";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { user } = useAuth();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [next, setNext] = useState<boolean>(false);
  const [isPut, setIsPut] = useState<boolean>(false);
  const [portfoEntries, setPortfoEntries] = useState<PortfolioParam[]>([
    {
      name: "",
      url: "",
    },
  ]);

  useEffect(() => {
    async function GetData() {
      try {
        setNext(true);
        console.log("user", user);
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.USER_PROFILE_DETAIL}/${user?._id}?category=portfolio`
        );
        if (!response) {
          return null;
        }
        const data = response.data.data.portfolio;
        data.length && setPortfoEntries(data);
      } catch (error) {
      } finally {
        setNext(false);
      }
    }
    GetData();
  }, []);
  async function PostData() {
    try {
      setNext(true); // Trigger loading
      const dataValue = {
        portfolio: portfoEntries,
      };

      const response = await axiosInstance.put(
        `${API_ENDPOINTS.USER_PROFILE_DETAIL}/${user!._id}`,
        { ...dataValue }
      );
      console.log("response", response);
      return response;
    } catch (error) {
      console.error(error);
    } finally {
      setNext(false); // Stop loading
    }
  }
  return (
    <div>
      <HeaderBasic
        title="Portfilo"
        nextRoute={"/jobs/references"}
        {...(isPut ? { next: PostData } : {})}
      />
      {next && <SkeletonLoader text="Loading ..." />}
      {portfoEntries.map((entry, index) => (
        <div>
          {Object.entries(entry).map(([key, value]) => (
            <InputComponent
              key={key}
              values={value}
              setFocused={setFocusedField}
              focused={focusedField}
              txt={key} // Helper function to get label text if needed
              typeofInput={key.includes("date") ? "date" : "text"} // Set type based on key
              setValues={(newValue) => {
                handleInputChange(
                  setPortfoEntries,
                  portfoEntries,
                  index,
                  key,
                  newValue
                );
                newValue == value || setIsPut(true);
              }}
              valuesFouce={`portfo-${key}-${index}`}
            />
          ))}
        </div>
      ))}
      <Button
        lengthofData={portfoEntries.length}
        onAdd={() =>
          addEntry(setPortfoEntries, portfoEntries, {
            name: "",
            url: "",
          })
        }
        onDelete={() => {
          deleteEntry(setPortfoEntries, portfoEntries);
          setIsPut(true);
        }}
      />
    </div>
  );
};

export default Page;
