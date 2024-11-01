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
import { ReferenceParams } from "@/utils/types/user-profile";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Page = () => {
  const inputEmpty = {
    name: "",
    career: "",
    email: "",
    company: "",
    phonenumber: "",
  };
  const { user } = useAuth();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [refEntries, setRefEntries] = useState<ReferenceParams[]>([inputEmpty]);
  const [next, setNext] = useState<boolean>(false);
  const [isPut, setIsPut] = useState<boolean>(false);

  // const ip = 'http://localhost:3040'
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true, // Make sure cookies are handled properly
  };

  useEffect(() => {
    async function GetData() {
      try {
        setNext(true);
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.USER_PROFILE_DETAIL}/${user?._id}?category=references`
        );
        const data = response.data.data.references;
        data.length&&setRefEntries(
          data
        );
      } catch (error) {
      } finally {
        setNext(false);
      }
    }
    GetData();
  }, []);

  async function PostData() {
    try {
      setNext(true);
      const dataValue = {
        references: refEntries,
      };

      const response = await axiosInstance.put(
        `${API_ENDPOINTS.USER_PROFILE_DETAIL}/${user!._id}`,
        { ...dataValue }
      );
      return response;
    } catch (error) {
      console.error(error);
    } finally {
      setNext(false);
    }
  }

  return (
    <div className="pb-20">
      <HeaderBasic
        title="Reference"
        {...(isPut ? { next: PostData } : {})}
        nextRoute="/"
      />
      {next && <SkeletonLoader text="Loading ..." />}
      {refEntries.map((entry, index) => (
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
                  setRefEntries,
                  refEntries,
                  index,
                  key,
                  newValue
                );
                newValue == value || setIsPut(true);
              }}
              valuesFouce={`skill-${key}-${index}`}
            />
          ))}
        </div>
      ))}
      {/* <InputComponent values={} setValues={}  setFocused={} focused={} txt='' valuesFouce=''  /> */}
      <Button
        lengthofData={refEntries.length}
        onAdd={() => addEntry(setRefEntries, refEntries, inputEmpty)}
        onDelete={() => {
          deleteEntry(setRefEntries, refEntries);
          setIsPut(true)
        }}
      />
    </div>
  );
};

export default Page;
