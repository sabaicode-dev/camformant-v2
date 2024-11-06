/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import HeaderBasic from "@/components/cv-rating-card/router-page/basic/header-basic";
import InputComponent from "@/components/input-field/input-component";
import Button from "@/components/cv-rating-card/router-page/basic/button-addremove";
import React, { useEffect, useState } from "react";
import SkeletonLoader from "@/components/cv-rating-card/router-page/basic/skeleton";
import CustomLabel from "@/components/user-profile/profile-label";
import {
  addEntry,
  deleteEntry,
  handleInputChange,
} from "@/utils/functions/input-functions";
import DropDownMenu from "@/components/user-profile/dropdown-menu";
import {
  ExpertiseParams,
  LanguageParams,
  SkillParams,
} from "@/utils/types/user-profile";
import axiosInstance from "@/utils/axios";
import { useAuth } from "@/context/auth";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";

const Page: React.FC = () => {
  const [skillEntries, setSkillEntries] = useState<SkillParams[]>([
    {
      name: "",
      percent: "",
    },
  ]);
  const [expertiseEntries, setExpertiseEntries] = useState<ExpertiseParams[]>([
    {
      name: "",
      proficiency: "",
    },
  ]);
  const [languageEntries, setLanguageEntries] = useState<LanguageParams[]>([
    {
      name: "",
      proficiency: "",
    },
  ]);
  const { user } = useAuth();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [next, setNext] = useState<boolean>(false);
  const [isPut, setIsPut] = useState<boolean>(false); //for check if our page have any change that must put or not

  // const ip = 'http://172.20.10.5:3030'
  // const ip = 'http://localhost:3040'

  useEffect(() => {
    async function GetData() {
      try {
        setNext(true);
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.USER_PROFILE_DETAIL}/?category=ability`
        );
        const data = response.data.data;
        console.log("abiloty", data);
        data.skills.length && setSkillEntries(data.skills);
        data.expertise.length && setExpertiseEntries(data.expertise);
        data.languages.length && setLanguageEntries(data.languages);
        console.log("lanuage", languageEntries);
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
      const dataValue: {
        skills: SkillParams[];
        expertise: ExpertiseParams[];
        languages: LanguageParams[];
      } = {
        skills: skillEntries,
        expertise: expertiseEntries,
        languages: languageEntries,
      };

      const response = await axiosInstance.put(
        API_ENDPOINTS.USER_PROFILE_DETAIL,
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
        title="Ability"
        {...(isPut ? { next: PostData } : {})}
        nextRoute="/jobs/description"
      />
      {next && <SkeletonLoader text="Loading ..." />}
      <CustomLabel text={"Skills"} />
      {skillEntries.map((entry, index) => (
        <div>
          {Object.entries(entry).map(([key, value]) => (
            <InputComponent
              key={key}
              values={typeof value === "string" ? value : value?.toString()}
              setFocused={setFocusedField}
              focused={focusedField}
              txt={key} // Helper function to get label text if needed
              typeofInput={key.includes("date") ? "date" : "text"} // Set type based on key
              setValues={(newValue) => {
                handleInputChange(
                  setSkillEntries,
                  skillEntries,
                  index,
                  key,
                  newValue
                );
                newValue == value.toString() || setIsPut(true);
              }}
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
          setIsPut(true);
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
                setValues={(newValue) =>{
                  handleInputChange(
                    setExpertiseEntries,
                    expertiseEntries,
                    index,
                    key,
                    newValue
                  )
                  newValue == value || setIsPut(true);
                }
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
                  newValue == value || setIsPut(true);
                }}
                currentText={value}
                title={"proficiency"}
                arrText={["","Beginner", "Intermediate", "Advanced"]}
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
        onDelete={() => {
          deleteEntry(setExpertiseEntries, expertiseEntries);
          setIsPut(true);
        }}
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
                setValues={(newValue) => {
                  handleInputChange(
                    setLanguageEntries,
                    languageEntries,
                    index,
                    key,
                    newValue
                  );
                  newValue == value || setIsPut(true);
                }}
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
                  newValue == value || setIsPut(true);
                }}
                currentText={value}
                title={"proficiency"}
                arrText={["","Beginner", "Native", "Fluent"]}
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
        onDelete={() => {
          deleteEntry(setLanguageEntries, languageEntries);
          setIsPut(true);
        }}
      />
    </div>
  );
};

export default Page;
