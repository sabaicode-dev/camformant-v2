/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import HeaderBasic from "@/components/cv-rating-card/router-page/basic/header-basic";
import InputComponent from "@/components/input-field/input-component";
import Button from "@/components/cv-rating-card/router-page/basic/button-addremove";
import React, { useEffect, useState } from "react";
import axios from "axios";
import SkeletonLoader from "@/components/cv-rating-card/router-page/basic/skeleton";
import { Sheet } from "react-modal-sheet";
import InputDateField from "@/components/input-date/Input-date";
import InputDate from "@/components/cv-rating-card/router-page/basic/input-date-field";
import { addEntry, deleteEntry, handleInputChange } from "@/utils/functions/inputFunctions";
export interface ExperienceParams {
  position: string;
  company: string;
  description: string;
  year: string;
}
const Page: React.FC = () => {
  const inputEmpty = {
    position: "",
    company: "",
    description: "",
    year: "",
  };
  const [experEntries, setExperEntries] = useState([inputEmpty]);
  const [isPut,setIsPut]=useState<boolean>(false)
  const [indexForUpdate,setIndexForUpdate] = useState(0)
  const [startYear, setStartYear] = useState<string[]>([]);
  const [endYear, setEndYear] = useState<string[]>([]);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [next, setNext] = useState<boolean>(false);
  const [isOpen, setOpen] = useState(false);

  // const ip = 'http://172.20.10.5:3030'
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
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/user/experience/`,
          config
        );
        const data = response.data;
        setExperEntries(
          data.map((entry: ExperienceParams) => ({
            postion: entry.position || "",
            company: entry.company || "",
            description: entry.description || "",
            year: entry.year || "",
          }))
        );
        for (let i = 0; i <experEntries.length; i++) {
          setStartYear((prev) => {
            const updatedStartYear = [...prev];
            updatedStartYear[i] = experEntries[i].year.split("-")[0];
            return updatedStartYear;
          });
          setEndYear((prev) => {
            const updatedEndYear = [...prev];
            updatedEndYear[i] = experEntries[i].year.split("-")[1];
            return updatedEndYear;
          });
        }
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
      const DataValue = {
        experiences:experEntries
      };

      const respone = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/user/experience/`,
        DataValue,
        config
      );
      return respone;
    } catch (error) {
      console.error(error);
    } finally {
      setNext(false);
    }
  }

  return (
    <div className="pb-20">
      <HeaderBasic title="Experience"
       {...(isPut ? { next: PostData } : {})}  
       nextRoute={"/self/ability"}/>
      {next && <SkeletonLoader text="Loading ..." />}
      {experEntries.map((entry, index) => (
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
                    setExperEntries,
                    experEntries,
                    index,
                    key,
                    newValue
                  )
                    value==newValue|| setIsPut(true)
                }
                }
                valuesFouce={`education-${key}-${index}`}
              />
            ) : (
              <InputDateField
                setOpen={() =>{ 
                  setOpen(true)
                  setIndexForUpdate(index)
                }
                }
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
        onAdd={() =>
          addEntry(setExperEntries, experEntries, inputEmpty)
        }
        onDelete={
          () => deleteEntry(setExperEntries, experEntries)
        }
      />
    </div>
  );
};

export default Page;
