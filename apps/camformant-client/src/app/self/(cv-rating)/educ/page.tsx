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
} from "@/utils/functions/inputFunctions";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Sheet } from "react-modal-sheet";
export interface EducationParams {
  academic: string;
  school: string;
  major: string;
  year: string;
}

const Page = () => {
  const inputEmpty = {
    academic: "",
    school: "",
    major: "",
    year: "",
  };
  const { user } = useAuth();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [educationEntries, setEducationEntries] = useState([inputEmpty]);
  const [startYear, setStartYear] = useState<string[]>([]);
  const [endYear, setEndYear] = useState<string[]>([]);
  let [indexForUpdate, setIndexForUdate] = useState<number>(0);
  const [next, setNext] = useState<boolean>(false);
  const [isOpen, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isPut,setIsPut]=useState<boolean>(false)

  // const ip = 'http://172.20.10.5:3030'
  // const ip = 'http://localhost:3040'

  useEffect(() => {
    async function GetData() {
      try {
        setNext(true);
        setLoading(true);
        console.log("user",user)
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.USER_PROFILE_DETAIL}/${user?._id}?category=educations`
        );
        if (!response) {
          return null;
        }
        const data = response.data;
        console.log("data",data)
        setEducationEntries(
          data.map((entry: EducationParams) => ({
            academic: entry.academic || "",
            school: entry.school || "",
            major: entry.major || "",
            year: entry.year || "",
          }))
        );
        for (let i = 0; i < educationEntries.length; i++) {
          setStartYear((prev) => {
            const updatedStartYear = [...prev];
            updatedStartYear[i] = educationEntries[i].year.split("-")[0];
            return updatedStartYear;
          });
          setEndYear((prev) => {
            const updatedEndYear = [...prev];
            updatedEndYear[i] = educationEntries[i].year.split("-")[1];
            return updatedEndYear;
          });
        }
      } catch (error) {
      } finally {
        setNext(false);
        setLoading(false);
      }
    }
    GetData();
  }, []);

  async function PostData() {
    try {
      setNext(true); // Trigger loading
      const DataValue = {
        educations: educationEntries,
      };

      const response = await axiosInstance.put(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/user/education/`,
        DataValue
      );
      return response;
    } catch (error) {
      console.error(error);
    } finally {
      setNext(false); // Stop loading
    }
  }

  return (
    <div className="pb-20">
      <HeaderBasic title="Education"
       {...(isPut?{next:PostData}:{})}
        nextRoute={"/self/exp"}
        />
      {next && <SkeletonLoader text="Loading ..." />}
      {educationEntries.map((entry, index) => (
        <div>
          {Object.entries(entry).map(([key, value]) => {
            return key != "year" ? (
              <InputComponent
                key={key}
                values={value}
                setFocused={setFocusedField}
                focused={focusedField}
                txt={key} // Helper function to get label text if needed
                typeofInput={key.includes("date") ? "date" : "text"} // Set type based on key
                setValues={(newValue) =>{
                  handleInputChange(
                    setEducationEntries,
                    educationEntries,
                    index,
                    key,
                    newValue
                  )
                    newValue==value||setIsPut(true)
                }
                }
                valuesFouce={`education-${key}-${index}`}
              />
            ) : (
              <InputDateField
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
        onDelete={() => deleteEntry(setEducationEntries, educationEntries)}
      />
    </div>
  );
};

export default Page;
