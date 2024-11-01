"use client";
import React, { useEffect, useState } from "react";
import HeaderBasic from "@/components/cv-rating-card/router-page/basic/header-basic";
import { Sheet } from "react-modal-sheet";
import { FaCheckCircle } from "react-icons/fa";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import axiosInstance from "@/utils/axios";
import { useAuth } from "@/context/auth";
import { truncateSync } from "fs";

const SelfDescription: React.FC = () => {
  const { user } = useAuth();
  const [isPut, setIsPut] = useState<boolean>(false);
  const [strength, setStrength] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [next, setNext] = useState<boolean>(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState("");

  const recommendations = [
    "I am a keen, hard working, reliable and excellent time keeper.",
    "I have strong communication skills and work well in a team.",
    "I am highly motivated and always eager to learn new skills.",
  ];

  const handleOptionClick = (option: string) => {
    setSelectedRecommendation(option);
  };

  const handleSelectButtonClick = () => {
    setStrength(selectedRecommendation);
    selectedRecommendation == strength || setIsPut(true);

    setOpen(false);
  };
  useEffect(() => {
    async function GetData() {
      try {
        setNext(true);
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.USER_PROFILE_DETAIL}/${user?._id}?category=descriptions`
        );
        if (!response) {
          return null;
        }

        const data = response.data.data.descriptions;
        setStrength(data.strength);
        setDescription(data.description);
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
          description,
          strength,
      };

      const response = await axiosInstance.put(
        `${API_ENDPOINTS.USER_PROFILE_DETAIL}/${user!._id}`,
        { descriptions: { ...dataValue } }
      );
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
        title="Self Descriptions"
        nextRoute={"/jobs/certificate"}
        {...(isPut ? { next: PostData } : {})}
      />
      <div className=" p-5 font-sans">
        <div className=" mb-4">
          <input
            type="text"
            className="w-full p-7 mb-4 border rounded-3xl shadow-md"
            value={strength}
            onChange={(e) => {
              setStrength(e.target.value);
              e.target.value == strength || setIsPut(true);
            }}
            placeholder="Introduce your strengths in one sentence"
          />
          <button
            className="text-yellow-500  w-full flex justify-end"
            onClick={() => setOpen(true)}
          >
            Show Recommendation
          </button>

          <input
            type="text"
            className="w-full p-7 mb-4 border rounded-3xl shadow-md mt-5"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              e.target.value == description || setIsPut(true);
            }}
            placeholder="Describe about yourself"
          />
        </div>

        <Sheet
          isOpen={isOpen}
          onClose={() => setOpen(false)}
          snapPoints={[500, 100, 400, 0]}
        >
          <Sheet.Container>
            <Sheet.Header />
            <Sheet.Content>
              {isOpen && (
                <div>
                  <div className="overflow-y-auto">
                    {recommendations.map((rec, index) => (
                      <div key={index}>
                        <p className="absolute ml-6 mt-[-9px] text-xs text-gray-400 bg-white">
                          Introduce your strengths in one sentence
                        </p>
                        <div
                          className={`flex m-auto w-96 p-5 mb-10 border rounded-3xl shadow-md cursor-pointer xl:w-full xl:left-0 xl:p-7 }`}
                          onClick={() => handleOptionClick(rec)}
                        >
                          <div className="flex justify-between items-center ">
                            <span>{rec}</span>
                            {selectedRecommendation === rec && (
                              <span className=" absolute right-4 mt-10">
                                <div className="text-orange-500 text-xl">
                                  <FaCheckCircle />
                                </div>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className={`w-96 absolute left-1 ${
                      selectedRecommendation ? "bg-[#FF7F00]" : "bg-[#FBC79A]"
                    } text-white p-2 rounded-2xl xl:w-full xl:left-0`}
                    onClick={handleSelectButtonClick}
                  >
                    Select
                  </button>
                </div>
              )}
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop />
        </Sheet>
      </div>
    </div>
  );
};

export default SelfDescription;
