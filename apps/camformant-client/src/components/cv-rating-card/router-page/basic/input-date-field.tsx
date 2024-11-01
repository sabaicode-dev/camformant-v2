"use client";
import { EducationParams, ExperienceParams } from "@/utils/types/user-profile";
import React, { useEffect, useState } from "react";

interface InputDateProps {
  index?: number;
  setOpen: (value: boolean) => void;
  setDay?: (value: string) => void;
  day?: string;
  setMonth?: (value: string) => void;
  month?: string;
  setYear?: (value: string) => void;
  year?: string;
  setStartYear?: React.Dispatch<React.SetStateAction<string[]>>;
  startYear?: string;
  setEndYear?: React.Dispatch<React.SetStateAction<string[]>>;
  endYear?: string;
  setValue?: (value: string) => void;
  setValueArray?: React.Dispatch<React.SetStateAction<any[]>>;
  mode: "date" | "yearRange";
  setIsPut: React.Dispatch<React.SetStateAction<boolean>>;
}

const InputDate: React.FC<InputDateProps> = ({
  index,
  setOpen,
  setDay,
  setMonth,
  setYear,
  day = "",
  month = "",
  year = "",
  setStartYear,
  startYear = "",
  setEndYear,
  endYear = "",
  mode,
  setValue,
  setValueArray,
  setIsPut,
}) => {
  const [submitEnabled, setSubmitEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (mode === "date") {
      // Enable submit if day, month, and year are provided
      if (day && month && year) {
        setSubmitEnabled(true);
      } else {
        setSubmitEnabled(false);
      }
    } else if (mode === "yearRange") {
      // Enable submit if startYear and endYear are provided
      if (startYear && endYear) {
        setSubmitEnabled(true);
      } else {
        setSubmitEnabled(false);
      }
    }
  }, [day, month, year, startYear, endYear, mode]);

  function handleSubmit() {
    if (submitEnabled) {
      setOpen(false);
      if (setValue) {
        if (mode == "date") setValue(`${day}/${month}/${year}`);
        else {
          if (endYear == startYear) setValue(startYear);
          else setValue(`${startYear} - ${endYear}`);
        }
      } else {
        setValueArray &&
          setValueArray(
            (prev: EducationParams[] | ExperienceParams[] | any[]) => {
              console.log("index", index);
              // Create a new array based on the previous one
              const updatedArray = [...prev];
              updatedArray[index!] = {
                ...updatedArray[index!],
                year:
                  startYear == endYear
                    ? startYear
                    : `${startYear} - ${endYear}`,
              };

              return updatedArray;
            }
          );
      }
      setIsPut(true);
    }
  }

  return (
    <div className="container w-full h-full flex flex-col justify-between">
      <div className="container w-full flex flex-row justify-center h-full items-center gap-4">
        {mode === "date" ? (
          <>
            <input
              type="number"
              placeholder="Day"
              min={1}
              max={31}
              className="w-24 p-5 outline-none shadow-md rounded-xl"
              value={day}
              onChange={(e) => setDay && setDay(e.target.value)}
            />
            <input
              type="number"
              placeholder="Month"
              min={1}
              max={12}
              className="w-24 p-5 outline-none shadow-md rounded-xl"
              value={month}
              onChange={(e) => setMonth && setMonth(e.target.value)}
            />
            <input
              type="number"
              placeholder="Year"
              min={1900}
              max={2099}
              className="w-24 p-5 outline-none shadow-md rounded-xl"
              value={year}
              onChange={(e) => setYear && setYear(e.target.value)}
            />
          </>
        ) : (
          <>
            <div>{index}</div>
            <input
              type="number"
              placeholder="Start Year"
              min={1950}
              max={2024}
              className="w-60 p-5 outline-none shadow-md rounded-xl"
              value={startYear}
              onChange={(e) =>
                setStartYear &&
                setStartYear((prev: string[]) => {
                  const previous = [...prev];
                  previous[index as number] = e.target.value;
                  return previous;
                })
              }
            />
            <input
              type="number"
              placeholder="End Year"
              min={1950}
              max={2024}
              className="w-60 p-5 outline-none shadow-md rounded-xl"
              value={endYear}
              onChange={(e) =>
                setEndYear &&
                setEndYear((prev: string[]) => {
                  const previous = [...prev];
                  previous[index as number] = e.target.value;
                  return previous;
                })
              }
            />
          </>
        )}
      </div>
      <div className="pb-10">
        <button
          onClick={handleSubmit}
          className={`p-5 ${submitEnabled ? "bg-orange-500" : "bg-slate-300"} w-full rounded-2xl text-white`}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default InputDate;
