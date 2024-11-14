"use client";

import Background from "@/components/background/background";
import Message from "@/components/message/message";
import { useAuth } from "@/context/auth";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";

const MessagePage = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [paginationMessage, setPaginationMessage] = useState({
    currentPage: 0,
    totalPage: 0,
    limit: 0,
    skip: 0,
    totalMessages: 0,
  });
  const params = useParams();
  const receiverId = params.receiverId;
  console.log("receiverId:::", receiverId);

  const [error, setError] = useState<string | null>(null);
  // const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch job data to get companyId
    const fetchJob = async () => {
      try {
        const response = await axiosInstance.get(
          `http://localhost:4000/v1/messages/${receiverId}`
        );
        const data = response.data;
        if (response.status === 200 && data) {
          console.log("dataaaaaa:::::::", response.data);
          setPaginationMessage({
            currentPage: data.currentPage,
            totalPage: data.totalPage,
            limit: data.limit,
            skip: data.skip,
            totalMessages: data.totalMessages,
          });
        } else {
          setError("Message not found");
        }
      } catch (error) {
        console.error("chat error: ", error);
        setError("Failed to fetch job data");
      }
    };
    if (receiverId) {
      fetchJob();
    }
  }, [receiverId]);
  console.log("pagination", paginationMessage);
  // console.log("pagination",);

  // Function to get conversation ID
  const getConversationId = useCallback(
    async ({
      companyName,
      companyProfile,
      userId,
      companyId,
    }: {
      companyName: string;
      companyProfile: string;
      userId?: string;
      companyId: string;
    }) => {
      try {
        const params = {
          companyId,
          companyProfile,
          companyName,
          userId,
          username: user!.username,
          userProfile: user!.profile,
        };

        const response = await axiosInstance.post(
          API_ENDPOINTS.CONVERSATIONS,
          params
        );
      } catch (error) {
        console.error("ChatPage getConversationId() error::: ", error);
      }
    },
    [user]
  );

  if (error) {
    return (
      <div className="flex flex-col h-screen">
        <Background>
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-xl text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 mt-4 text-white bg-blue-500 rounded"
            >
              Retry
            </button>
          </div>
        </Background>
      </div>
    );
  }
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center px-8 gap-y-10">
        <div className="flex items-center justify-start w-full mt-20 text-xl">
          <span
            className="p-2 text-3xl text-white rounded-lg hover:cursor-pointer bg-primaryCam"
            onClick={() => router.back()}
          >
            <IoArrowBack />
          </span>
        </div>
        <h1 className="text-xl text-center text-primaryCam">
          Please Login to your Account
        </h1>

        <Link href="/login" className="p-3 text-white rounded-xl bg-primaryCam">
          Login
        </Link>
      </div>
    );
  }
  return (
    <Message
      conversationId={""}
      job={{
        _id: "string",
        companyId: {
          _id: "string",
          name: "string",
          profile: "string",
        },
      }}
      userId={user?._id}
    />
  );
};

export default MessagePage;
