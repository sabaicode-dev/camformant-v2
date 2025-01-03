/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import HeaderBasic from "@/components/cv-rating-card/router-page/basic/header-basic";
import InputComponent from "@/components/input-field/input-component";
import Button from "@/components/cv-rating-card/router-page/basic/button-addremove";
import React, { useEffect, useState } from "react";
import SkeletonLoader from "@/components/cv-rating-card/router-page/basic/skeleton";
import { Sheet } from "react-modal-sheet";
import InputDateField from "@/components/input-date/Input-date";
import InputDate from "@/components/cv-rating-card/router-page/basic/input-date-field";
import {
  addEntry,
  deleteEntry,
  handleInputChange,
} from "@/utils/functions/input-functions";
import { ExperienceParams } from "@/utils/types/user-profile";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import { useAuth } from "@/context/auth";

const Page: React.FC = () => {
  const inputEmpty = {
    position: "",
    company: "",
    description: "",
    year: "",
  };
  const { user } = useAuth();
  const [experEntries, setExperEntries] = useState<ExperienceParams[]>([
    inputEmpty,
  ]);
  const [isPut, setIsPut] = useState<boolean>(false);
  const [indexForUpdate, setIndexForUpdate] = useState(0);
  const [startYear, setStartYear] = useState<string[]>([]);
  const [endYear, setEndYear] = useState<string[]>([]);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [next, setNext] = useState<boolean>(false);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    async function GetData() {
      try {
        setNext(true);
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.USER_PROFILE_DETAIL}/${user?._id}?category=experiences`
        );
        const data = response.data.data.experiences;
        data.length && setExperEntries(data);
        let updatedEndYears = data.map(
          (entry: ExperienceParams) => entry.year.split("-")[0]
        );
        setStartYear(updatedEndYears);
        updatedEndYears = data.map(
          (entry: ExperienceParams) =>
            entry.year.split("-")[1] || entry.year.split("-")[0]
        );
        setEndYear(updatedEndYears);
      } catch (error) {
      } finally {
        setNext(false);
      }
    }
    GetData();
  }, []);

  async function PostData() {
    try {
      const dataValue = {
        experiences: experEntries,
      };

      const response = await axiosInstance.put(
        API_ENDPOINTS.USER_PROFILE_DETAIL,
        { ...dataValue }
      );
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="pb-20">
      <HeaderBasic
        title="Experience"
        {...(isPut ? { next: PostData } : {})}
        nextRoute={"/jobs/ability"}
      />
      {next && <SkeletonLoader text="Loading ..." />}
      {experEntries.map((entry, index) => (
        <div key={`${index}`}>
          {Object.entries(entry).map(([key, value]) => {
            return key != "year" ? (
              <InputComponent
                key={key}
                values={value}
                setFocused={setFocusedField}
                focused={focusedField}
                txt={key} // Helper function to get label text if needed
                typeofInput={key.includes("date") ? "date" : "text"} // Set type based on key
                setValues={(newValue) => {
                  handleInputChange(
                    setExperEntries,
                    experEntries,
                    index,
                    key,
                    newValue
                  );
                  value == newValue || setIsPut(true);
                }}
                valuesFouce={`education-${key}-${index}`}
              />
            ) : (
              <InputDateField
                setOpen={() => {
                  setOpen(true);
                  setIndexForUpdate(index);
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
              setValueArray={setExperEntries}
              setIsPut={setIsPut}
            />
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
      <Button
        lengthofData={experEntries.length}
        onAdd={() => addEntry(setExperEntries, experEntries, inputEmpty)}
        onDelete={() => {
          deleteEntry(setExperEntries, experEntries);
          setIsPut(true);
        }}
      />
    </div>
  );
};

export default Page;
