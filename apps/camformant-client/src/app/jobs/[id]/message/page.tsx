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
interface Company {
  name: string;
  profile: string;
}

export interface Job {
  _id: string;
  companyId: Company;
}

const ChatPage = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  // if (!isAuthenticated) {
  //   router.push("/login");
  // }
  const params = useParams();
  const companyId = params.id as string | undefined;

  const [job, setJob] = useState<Job>();
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  // Fetch job data
  const fetchJob = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.JOBS}/${companyId}`
      );

      if (response.status === 200 && response.data.data) {
        setJob(response.data.data);

        // Once job data is fetched, call getConversationId
        await getConversationId({
          companyName: response.data.data.companyId.name,
          companyProfile: response.data.data.companyId.profile,
        });
      } else {
        setError("Job not found");
      }
    } catch (error) {
      console.error("chat error: ", error);
      setError("Failed to fetch job data");
    }
  }, [companyId, user]);

  useEffect(() => {
    if (companyId) {
      // console.log("fetch job");
      fetchJob();
    }
  }, [companyId, fetchJob]);

  // Function to get conversation ID
  const getConversationId = async ({
    companyName,
    companyProfile,
  }: {
    companyName: string;
    companyProfile: string;
  }) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.CONVERSATIONS, {
        companyId,
        companyProfile,
        companyName,
        userId: user!._id,
        username: user!.username,
        userProfile: user!.profile,
      });

      setConversationId(response.data.data._id);
    } catch (error) {
      console.error("ChatPage getConversationId() error::: ", error);
    }
  };

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
  return <Message conversationId={conversationId} job={job!} />;
};

export default ChatPage;
