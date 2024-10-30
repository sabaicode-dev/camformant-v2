/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import HeaderBasic from "@/components/cv-rating-card/router-page/basic/header-basic";
import InputComponent from "@/components/input-field/input-component";
import Button from "@/components/cv-rating-card/router-page/basic/button-addremove";
import React, { useEffect, useState } from "react";
import axios from "axios";
import SkeletonLoader from "@/components/cv-rating-card/router-page/basic/skeleton";
import CustomLabel from "@/components/user-profile/profile-label";
import {
  addEntry,
  deleteEntry,
  handleInputChange,
} from "@/utils/functions/inputFunctions";
import DropDownMenu from "@/components/user-profile/dropdown-menu";

const Page: React.FC = () => {
  const [experience, setExperience] = useState<string>("");

  const [skillEntries, setSkillEntries] = useState([
    {
      name: "",
      percent: "",
    },
  ]);
  const [expertiseEntries, setExpertiseEntries] = useState([
    {
      name: "",
      proficiency: "",
    },
  ]);
  const [languageEntries, setLanguageEntries] = useState([
    {
      name: "",
      proficiency: "",
    },
  ]);

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [next, setNext] = useState<boolean>(false);
  const [isPut,setIsPut]=useState<boolean>(false)//for check if our page have any change that must put or not

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
        setExperience(data.years_of_experience);
        setSkillEntries(
          data.skills.map((entry: { name: string; percent: number }) => ({
            name: entry.name || "",
            percent:
              Number(entry.percent) == 0 ? Number(entry.percent) == 0 : "",
          }))
        );
        setExpertiseEntries(
          data.expertise.map(
            (entry: { name: string; proficiency: string }) => ({
              name: entry.name || "",
              proficiency: entry.proficiency || "",
            })
          )
        );
        setLanguageEntries(
          data.langauges.map(
            (entry: { name: string; proficiency: string }) => ({
              name: entry.name || "",
              proficiency: entry.proficiency || "",
            })
          )
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
      const DataValue = {
        skills: skillEntries,
        expertise: expertiseEntries,
        languageEntries: languageEntries,
      };

      const respone = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/user/ability/`,
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
      <HeaderBasic title="Ability" 
      {...(isPut ? { next: PostData } : {})}
      nextRoute="/self/description" />
      {next && <SkeletonLoader text="Loading ..." />}
      <CustomLabel text={"Skills"} />
      {skillEntries.map((entry, index) => (
        <div>
          {Object.entries(entry).map(([key, value]) => (
            <InputComponent
              key={key}
              values={value}
              setFocused={setFocusedField}
              focused={focusedField}
              txt={key} // Helper function to get label text if needed
              typeofInput={key.includes("date") ? "date" : "text"} // Set type based on key
              setValues={(newValue) =>
                handleInputChange(
                  setSkillEntries,
                  skillEntries,
                  index,
                  key,
                  newValue
                )
              }
              valuesFouce={`skill-${key}-${index}`}
            />
          ))}
        </div>
      ))}
      <Button
        lengthofData={skillEntries.length}
        onAdd={() =>
          addEntry(setSkillEntries, skillEntries, {
            name: "",
            percent: "",
          })
        }
        onDelete={() => {
          deleteEntry(setSkillEntries, skillEntries);
        }}
      />
      <CustomLabel text={"Expertise"} />
      {expertiseEntries.map((entry, index) => (
        <div>
          {Object.entries(entry).map(([key, value]) =>
            key != "proficiency" ? (
              <InputComponent
                key={key}
                values={value}
                setFocused={setFocusedField}
                focused={focusedField}
                txt={key} // Helper function to get label text if needed
                typeofInput={key.includes("date") ? "date" : "text"} // Set type based on key
                setValues={(newValue) =>
                  handleInputChange(
                    setExpertiseEntries,
                    expertiseEntries,
                    index,
                    key,
                    newValue
                  )
                }
                valuesFouce={`expertise-${key}-${index}`}
              />
            ) : (
              <DropDownMenu
                setValue={(newValue) => {
                  handleInputChange(
                    setExpertiseEntries,
                    expertiseEntries,
                    index,
                    key,
                    newValue
                  );
                  newValue==value||setIsPut(true)
                }}
                currentText={value}
                arrText={["Beginner", "Intermediate", "Advanced"]}
              />
            )
          )}
        </div>
      ))}
      <Button
        lengthofData={expertiseEntries.length}
        onAdd={() =>
          addEntry(setExpertiseEntries, expertiseEntries, {
            name: "",
            proficiency: "",
          })
        }
        onDelete={() => deleteEntry(setExpertiseEntries, expertiseEntries)}
      />
      <CustomLabel text={"Langauges"} />

      {languageEntries.map((entry, index) => (
        <div>
          {Object.entries(entry).map(([key, value]) =>
            key != "proficiency" ? (
              <InputComponent
                key={key}
                values={value}
                setFocused={setFocusedField}
                focused={focusedField}
                txt={key} // Helper function to get label text if needed
                typeofInput={key.includes("date") ? "date" : "text"} // Set type based on key
                setValues={(newValue) =>{
                  handleInputChange(
                    setLanguageEntries,
                    languageEntries,
                    index,
                    key,
                    newValue
                  )
                  newValue==value||setIsPut(true)
                }
                }
                valuesFouce={`language-${key}-${index}`}
              />
            ) : (
              <DropDownMenu
                setValue={(newValue) => {
                  handleInputChange(
                    setLanguageEntries,
                    languageEntries,
                    index,
                    key,
                    newValue
                  );
                }}
                currentText={value}
                arrText={["Beginner", "Intermediate", "Advanced"]}
              />
            )
          )}
        </div>
      ))}
      <Button
        lengthofData={languageEntries.length}
        onAdd={() =>
          addEntry(setLanguageEntries, languageEntries, {
            name: "",
            proficiency: "",
          })
        }
        onDelete={() => deleteEntry(setLanguageEntries, languageEntries)}
      />
    </div>
  );
};

export default Page;
