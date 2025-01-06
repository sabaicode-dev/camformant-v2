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
import { useNotification } from "@/hooks/user-notification";

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
  const { addNotification, NotificationDisplay } = useNotification();

  useEffect(() => {
    async function GetData() {
      try {
        setNext(true);
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.USER_PROFILE_DETAIL}/${user?._id}?category=ability`
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
  }, [user?._id]);

  async function PostData() {
    try {
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
    }
  }

  return (
    <div className="pb-20">
      <NotificationDisplay />
      <HeaderBasic
        title="Ability"
        {...(isPut ? { next: PostData } : {})}
        nextRoute="/jobs/description"
      />
      {next && <SkeletonLoader text="Loading ..." />}
      <CustomLabel text={"Skills"} />
      {skillEntries.map((entry, index) => (
        <div key={`skill-${index}`}>
          {Object.entries(entry).map(([key, value]) => (
            <InputComponent
              key={`skill-${key}-${index}`}
              values={typeof value === "string" ? value : value?.toString()}
              setFocused={setFocusedField}
              focused={focusedField}
              txt={key} // Helper function to get label text if needed
              typeofInput={key.includes("date") ? "date" : "text"} // Set type based on key
              setValues={(newValue) => {
                if (key == "percent") {
                  if (!isNaN(Number(newValue))) {
                    if (Number(newValue) > 100) {
                      addNotification(
                        "Percent should be less than 100",
                        "error"
                      );
                    } else {
                      handleInputChange(
                        setSkillEntries,
                        skillEntries,
                        index,
                        key,
                        newValue
                      );
                      newValue == value.toString() || setIsPut(true);
                    }
                  } else {
                    addNotification("Percent should be a number", "error");
                  }
                } else {
                  handleInputChange(
                    setSkillEntries,
                    skillEntries,
                    index,
                    key,
                    newValue
                  );
                  newValue == value.toString() || setIsPut(true);
                }
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
        <div key={`expertise-${index}`}>
          {Object.entries(entry).map(([key, value]) =>
            key != "proficiency" ? (
              <InputComponent
                key={`expertise-${key}-${index}`}
                values={value}
                setFocused={setFocusedField}
                focused={focusedField}
                txt={key} // Helper function to get label text if needed
                typeofInput={key.includes("date") ? "date" : "text"} // Set type based on key
                setValues={(newValue) => {
                  handleInputChange(
                    setExpertiseEntries,
                    expertiseEntries,
                    index,
                    key,
                    newValue
                  );
                  newValue == value || setIsPut(true);
                }}
                valuesFouce={`expertise-${key}-${index}`}
              />
            ) : (
              <DropDownMenu
                key={`expertise-${key}-${index}`}
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
                arrText={["", "Beginner", "Intermediate", "Advanced"]}
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
        <div key={`lang-${index}`}>
          {Object.entries(entry).map(([key, value]) =>
            key != "proficiency" ? (
              <InputComponent
                key={`lang-${key}-${index}`}
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
                key={`language-${key}-${index}`}
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
                arrText={["", "Beginner", "Native", "Fluent"]}
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
