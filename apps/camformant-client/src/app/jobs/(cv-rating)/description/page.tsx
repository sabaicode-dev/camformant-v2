"use client";
import React, { useEffect, useState } from "react";
import HeaderBasic from "@/components/cv-rating-card/router-page/basic/header-basic";
import { Sheet } from "react-modal-sheet";
import { FaCheckCircle } from "react-icons/fa";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import axiosInstance from "@/utils/axios";
import SkeletonLoader from "@/components/cv-rating-card/router-page/basic/skeleton";
// Import the debounce hook
import { checkGrammar } from "@/app/api/check-grammar";
import { MatchParams } from "@/utils/types/user-profile";
import { useDebounce } from "@/hooks/use-debounce";

interface FeedbackParams {
  feedbackStren: MatchParams[];
  feedbackDesc: MatchParams[];
}

const SelfDescription: React.FC = () => {
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

  // Debounced values for strength and description
  const debouncedStrength = useDebounce(strength, 3000); // 5 seconds debounce
  const debouncedDescription = useDebounce(description, 3000);

  useEffect(() => {
    // Fetch user profile data
    async function GetData() {
      try {
        setNext(true);
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.USER_PROFILE_DETAIL}/?category=descriptions`
        );
        const data = response.data.data.descriptions;
        setStrength(data.strength || "");
        setDescription(data.description || "");
      } catch (error) {
        console.error(error);
      } finally {
        setNext(false);
      }
    }
    GetData();
  }, []);

  useEffect(() => {
    // Perform grammar check for debounced strength
    if (debouncedStrength) {
      checkGrammar(debouncedStrength).then((issues: MatchParams[]) => {
        setFeedbacks((prev) => ({
          ...prev,
          feedbackStren: issues,
        }));
      });
    }
  }, [debouncedStrength]);

  useEffect(() => {
    // Perform grammar check for debounced description
    if (debouncedDescription) {
      checkGrammar(debouncedDescription).then((issues: MatchParams[]) => {
        setFeedbacks((prev) => ({
          ...prev,
          feedbackDesc: issues,
        }));
      });
    }
  }, [debouncedDescription]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setState(e.target.value);
    setIsPut(true); // Mark as changed for saving
  };

  const handleOptionClick = (option: string) => {
    setSelectedRecommendation(option);
  };
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
  const handleSelectButtonClick = () => {
    setStrength(selectedRecommendation);
    setIsPut(true);
    setOpen(false);
  };

  async function PostData() {
    try {
      setNext(true); // Trigger loading
      const dataValue = {
        description,
        strength,
      };
      await axiosInstance.put(API_ENDPOINTS.USER_PROFILE_DETAIL, {
        descriptions: { ...dataValue },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setNext(false); // Stop loading
    }
  }

  return (
    <div>
      {next && <SkeletonLoader text={"loading..."} />}
      <HeaderBasic
        title="Self Descriptions"
        nextRoute={"/jobs/certificate"}
        {...(isPut ? { next: PostData } : {})}
      />
      <div className="p-5 font-sans">
        <div className="mb-4">
          {/* Strength Input */}
          <div className="relative">
            <input
              type="text"
              className="w-full mb-4 border shadow-md p-7 rounded-3xl"
              value={strength}
              onChange={(e) => handleInputChange(e, setStrength)}
              placeholder="Introduce your strengths in one sentence"
            />
            {feedbacks.feedbackStren.length > 0 && (
              <ul className="absolute top-[-10px] list-none flex bg-gray-300 rounded-lg">
                <span className="mx-4 font-semibold">Mistake:</span>
                {feedbacks.feedbackStren.map((issue, index) => (
                  <li
                    key={index}
                    className="mr-5 cursor-pointer"
                    onClick={() => {
                      handleSuggestionClick(
                        issue.replacements[0].value,
                        issue.offset,
                        issue.length,
                        strength,
                        setStrength,
                        "feedbackStren"
                      );
                    }}
                  >
                    {issue.replacements[0]?.value}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            className="flex justify-end w-full text-yellow-500"
            onClick={() => setOpen(true)}
          >
            Show Recommendation
          </button>

          {/* Description Input */}
          <div className="relative">
            <input
              type="text"
              className="w-full mt-5 mb-4 border shadow-md p-7 rounded-3xl"
              value={description}
              onChange={(e) => handleInputChange(e, setDescription)}
              placeholder="Describe about yourself"
            />
            {feedbacks.feedbackDesc.length > 0 && (
              <ul className="absolute top-[-10px] list-none flex bg-gray-300 rounded-lg">
                <span className="mx-4 font-semibold">Mistake:</span>
                {feedbacks.feedbackDesc.map((issue, index) => (
                  <li
                    key={index}
                    className="mr-5 cursor-pointer"
                    onClick={() => {
                      handleSuggestionClick(
                        issue.replacements[0].value,
                        issue.offset,
                        issue.length,
                        description,
                        setDescription,
                        "feedbackDesc"
                      );
                    }}
                  >
                    {issue.replacements[0]?.value}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Recommendation Modal */}
        <Sheet
          isOpen={isOpen}
          onClose={() => setOpen(false)}
          snapPoints={[500, 400, 100, 0]}
        >
          <Sheet.Container>
            <Sheet.Header />
            <Sheet.Content>
              {isOpen && (
                <div>
                  <div className="overflow-y-auto">
                    {recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="flex m-auto w-96 p-5 mb-10 border rounded-3xl shadow-md cursor-pointer"
                        onClick={() => handleOptionClick(rec)}
                      >
                        <span>{rec}</span>
                        {selectedRecommendation === rec && (
                          <span className="absolute mt-10 right-4 text-xl text-orange-500">
                            <FaCheckCircle />
                          </span>
                        )}
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
