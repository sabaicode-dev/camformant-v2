"use client";
import Button from "@/components/cv-rating-card/router-page/basic/button-addremove";
import HeaderBasic from "@/components/cv-rating-card/router-page/basic/header-basic";
import InputDate from "@/components/cv-rating-card/router-page/basic/input-date-field";
import SkeletonLoader from "@/components/cv-rating-card/router-page/basic/skeleton";
import InputDateField from "@/components/input-date/Input-date";
import InputComponent from "@/components/input-field/input-component";
import { useAuth } from "@/context/auth";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import {
  addEntry,
  deleteEntry,
  handleInputChange,
} from "@/utils/functions/input-functions";
import { EducationParams } from "@/utils/types/user-profile";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Sheet } from "react-modal-sheet";

const Page = () => {
  const inputEmpty = {
    academic: "",
    school: "",
    major: "",
    year: "",
  };
  const { user } = useAuth();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [educationEntries, setEducationEntries] = useState<EducationParams[]>([
    inputEmpty,
  ]);
  const [startYear, setStartYear] = useState<string[]>([]);
  const [endYear, setEndYear] = useState<string[]>([]);
  let [indexForUpdate, setIndexForUdate] = useState<number>(0);
  const [next, setNext] = useState<boolean>(false);
  const [isOpen, setOpen] = useState(false);
  const [isPut, setIsPut] = useState<boolean>(false);

  // const ip = 'http://172.20.10.5:3030'
  // const ip = 'http://localhost:3040'

  useEffect(() => {
    async function GetData() {
      try {
        console.log("user id", user!._id);
        setNext(true);
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.USER_PROFILE_DETAIL}/${user?._id}?category=educations`
        );

        const data = response.data.data.educations;
        console.log("education data in get", response.data);
        if (data.length == 0) return;
        setEducationEntries(data);
        let updatedEndYears = data.map(
          (entry: EducationParams) => entry.year.split("-")[0]
        );
        setStartYear(updatedEndYears);
        updatedEndYears = data.map(
          (entry: EducationParams) =>
            entry.year.split("-")[1] || entry.year.split("-")[0]
        );
        setEndYear(updatedEndYears);
      } catch (error) {
        console.error(error);
      } finally {
        setNext(false);
      }
    }
    GetData();
  }, [user]);

  async function PostData() {
    try {
      const dataValue = {
        educations: educationEntries,
      };
      console.log("data value", dataValue);
      const response = await axiosInstance.put(
        API_ENDPOINTS.USER_PROFILE_DETAIL,
        { ...dataValue }
      );
      console.log("post respone", response);
      return response;
    } catch (error) {
      console.error(error);
    } 
  }

  return (
    <div className="pb-20">
      <HeaderBasic
        title="Education"
        {...(isPut ? { next: PostData } : {})}
        nextRoute={"/jobs/exp"}
      />
      {next && <SkeletonLoader text="Loading ..." />}
      {educationEntries.map((entry, index) => (
        <div key={`${index}`}>
          {Object.entries(entry).map(([key, value]) => {
            return key != "year" ? (
              <InputComponent
                // key={`education-${key}-${index}`}
                values={value}
                setFocused={setFocusedField}
                focused={focusedField}
                txt={key} // Helper function to get label text if needed
                typeofInput={key.includes("date") ? "date" : "text"} // Set type based on key
                setValues={(newValue) => {
                  handleInputChange(
                    setEducationEntries,
                    educationEntries,
                    index,
                    key,
                    newValue
                  );
                  newValue == value || setIsPut(true);
                }}
                valuesFouce={`education-${key}-${index}`}
              />
            ) : (
              <InputDateField
                key={`education-date-${index}`}
                setOpen={() => {
                  setOpen(true);
                  setIndexForUdate(index);
                }}
                date={value}
              />
            );
          })}
        </div>
      ))}
      <Sheet
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        snapPoints={[400, 200, 100, 0]}
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <InputDate
              index={indexForUpdate}
              mode="yearRange"
              setOpen={setOpen}
              setStartYear={setStartYear}
              startYear={startYear[indexForUpdate]}
              setEndYear={setEndYear}
              endYear={endYear[indexForUpdate]}
              setValueArray={setEducationEntries}
              setIsPut={setIsPut}
            />
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
      <Button
        lengthofData={educationEntries.length}
        onAdd={() =>
          addEntry(setEducationEntries, educationEntries, inputEmpty)
        }
        onDelete={() => {
          deleteEntry(setEducationEntries, educationEntries);
          setIsPut(true);
        }}
      />
    </div>
  );
};

export default Page;
