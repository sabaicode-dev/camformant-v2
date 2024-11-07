"use client";
import React, { useEffect, useState } from "react";
import HeaderBasic from "@/components/cv-rating-card/router-page/basic/header-basic";
import { Sheet } from "react-modal-sheet";
import { FaCheckCircle } from "react-icons/fa";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import axiosInstance from "@/utils/axios";
import { useAuth } from "@/context/auth";
import { truncateSync } from "fs";
import { checkGrammar } from "@/app/api/check-grammar";
import { MatchParams } from "@/utils/types/user-profile";
import SkeletonLoader from "@/components/cv-rating-card/router-page/basic/skeleton";

interface FeedbackParams {
  feedbackStren: MatchParams[];
  feedbackDesc: MatchParams[];
}
const SelfDescription: React.FC = () => {
  const { user } = useAuth();
  const [isPut, setIsPut] = useState<boolean>(false);
  const [strength, setStrength] = useState("");
  const [description, setDescription] = useState("");
  const [feedbacks, setFeedbacks] = useState<FeedbackParams>({
    feedbackStren: [],
    feedbackDesc: [],
  });
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
          `${API_ENDPOINTS.USER_PROFILE_DETAIL}/?category=descriptions`
        );
        if (!response) {
          return null;
        }

        const data = response.data.data.descriptions;
        setStrength(data.strength);
        setDescription(data.description);
        console.log("feedback",feedbacks)
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
        API_ENDPOINTS.USER_PROFILE_DETAIL,
        { descriptions: { ...dataValue } }
      );
      return response;
    } catch (error) {
      console.error(error);
    } finally {
      setNext(false); // Stop loading
    }
  }
  async function handleChange(
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<string>>,
    key: string
  ) {
    setState(e.target.value);
    const issues: MatchParams[] = await checkGrammar(e.target.value);
    setFeedbacks((prev: FeedbackParams) => {
      return {
        ...prev,
        [key]: issues,
      };
    });
  }
  function handleSuggestionClick(
    replacement: string,
    offset: number,
    length: number,
    stateValue: string,
    setState: React.Dispatch<React.SetStateAction<string>>,
    key: string
  ) {
    const beforeText = stateValue.substring(0, offset);
    const afterText = stateValue.substring(offset + length);
    const newText = beforeText + replacement + afterText;
    setState(newText);

    // Recheck the grammar after the replacement
    checkGrammar(newText).then((issues: MatchParams[]) => {
      setFeedbacks((prev: FeedbackParams) => {
        return {
          ...prev,
          [key]: issues,
        };
      });
    });
  }

  return (
    <div>
      {next&&<SkeletonLoader text={"loading..."} />}
      <HeaderBasic
        title="Self Descriptions"
        nextRoute={"/jobs/certificate"}
        {...(isPut ? { next: PostData } : {})}
      />
      <div className=" p-5 font-sans">
        <div className=" mb-4">
          <div className="relative">
            <input
              type="text"
              className="w-full p-7 mb-4 border rounded-3xl shadow-md"
              value={strength}
              onChange={(e) => {
                handleChange(e, setStrength, "feedbackStren");
                e.target.value == strength || setIsPut(true);
              }}
              placeholder="Introduce your strengths in one sentence"
            />
            {feedbacks.feedbackStren.length ? (
              <ul className="absolute top-[-10px] list-none flex bg-gray-300 rounded-lg">
                <span className="font-semibold mx-4">Mistake:</span>
                {feedbacks.feedbackStren.map(
                  (element: MatchParams, index: number) => (
                    <li
                    className="mr-5 cursor-pointer"
                      key={element.offset}
                      onClick={() =>
                        handleSuggestionClick(
                          element.replacements[0].value,
                          element.offset,
                          element.length,
                          strength,
                          setStrength,
                          "feedbackStren"
                        )
                      }
                    >
                      {element.replacements[0]?.value && element.replacements[0].value}
                    </li>
                  )
                )}
              </ul>
            ):<></>}
          </div>
          <button
            className="text-yellow-500  w-full flex justify-end"
            onClick={() => setOpen(true)}
          >
            Show Recommendation
          </button>

          <div className="relative">
            <input
              type="text"
              className="w-full p-7 mb-4 border rounded-3xl shadow-md mt-5"
              value={description}
              onChange={(e) => {
                handleChange(e, setDescription, "feedbackDesc");
                e.target.value == description || setIsPut(true);
              }}
              placeholder="Describe about yourself"
            />
            {feedbacks.feedbackDesc.length ? (
              <ul className="absolute top-[-10px] list-none flex bg-gray-300 rounded-lg">
                <span className="font-semibold mx-4">Mistake:</span>
                {feedbacks.feedbackDesc.map(
                  (element: MatchParams, index: number) => (
                    <li
                      className="mr-5 cursor-pointer"
                      key={element.offset}
                      onClick={() =>
                        handleSuggestionClick(
                          element.replacements[0].value,
                          element.offset,
                          element.length,
                          description,
                          setDescription,
                          "feedbackDesc"
                        )
                      }
                    >
                      {element.replacements[0]?.value && element.replacements[0].value}
                    </li>
                  )
                )}
              </ul>
            ):<></>}
          </div>
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
