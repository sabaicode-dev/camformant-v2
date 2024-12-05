"use client";

import Background from "@/components/background/background";
import Message from "@/components/message/message";
import { useAuth } from "@/context/auth";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import BackButton from "@/components/back/BackButton";
import { useSocketContext } from "@/context/SocketContext";

interface conversation {
  _id: string;
  roomId: string;
  createdAt: Date;
  messages:
    | {
        _id: string;
        senderId: string;
        receiverId: string;
        message: string;
        createdAt: Date;
        updatedAt: Date;
        conversationId: string;
      }[]
    | [];
  participants:
    | {
        participantType: "User" | "Company";
        participantId: string;
        name?: string;
        profile?: string;
      }[]
    | [];
  updatedAt: Date;
}
const MessagePage = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const socketContext = useSocketContext();
  const onlineUsers = socketContext ? socketContext.onlineUsers : [];
  const socket = socketContext?.socket;
  //participant profile
  const [participantProfile, setParticipantProfile] = useState<{
    _id: string;
    name: string;
    profile: string;
  }>({
    _id: "",
    name: "",
    profile: "https://sabaicode.com/sabaicode.jpg",
  });
  const [error, setError] = useState<string | null>(null);
  const handleError = (text: string) => {
    setError(text);
  };

  const params = useParams();
  const receiverId = params.receiverId;

  //fetch profile
  useEffect(() => {
    const getParticipantProfile = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.GET_PROFILE_COMPANY}?companiesId=${receiverId}`
        );
        const data = (await response.data).companiesProfile;

        const companiesProfile = data[0] || [];
        if (response.status === 200 && data && companiesProfile.length !== 0) {
          if (companiesProfile.name) {
            setParticipantProfile({
              _id: receiverId as string,
              name: companiesProfile.name,
              profile: companiesProfile.profile,
            });
          }
        } else {
          if (!companiesProfile.name) {
            setError("No User Found!");
          }
        }
      } catch (error) {
        console.error("chat error: ", error);
        setError("Failed to fetch participant profile data");
      }
    };
    getParticipantProfile();
  }, [receiverId]);

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

  // if (error) {
  //   return (
  //     <div className="flex flex-col h-screen">
  //       <Background>
  //         <div className="flex flex-col items-center justify-center h-full">
  //           <p className="text-xl text-red-500">{error}</p>
  //           <button
  //             onClick={() => window.location.reload()}
  //             className="px-4 py-2 mt-4 text-white bg-blue-500 rounded"
  //           >
  //             Retry
  //           </button>
  //         </div>
  //       </Background>
  //     </div>
  //   );
  // }
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
    <div className="relative flex flex-col w-screen h-screen">
      {/* Background component */}
      <Background>
        {/* Header section: company profile */}
        <div className="flex items-center justify-between w-full h-32 bg-white rounded-t-3xl">
          {participantProfile && (
            <div
              key={participantProfile._id}
              className=" absolute mt-[-250px] ml-36 gap-8 flex items-center justify-center"
            >
              {/* Back displayed in front */}
              <div className="z-10 -ml-32 ">
                <button onClick={() => router.back()}>
                  <BackButton />
                </button>
              </div>

              {/* Company profile image */}

              <div className="relative w-20 h-20 -ml-5 rounded-full">
                <Image
                  src={
                    participantProfile.profile ||
                    "https://sabaicode.com/sabaicode.jpg"
                  }
                  alt={`${participantProfile.name} profile`}
                  width={200}
                  height={200}
                  className="object-cover w-full h-full rounded-full"
                />
                {Array.isArray(onlineUsers) &&
                  onlineUsers.includes(participantProfile._id) && (
                    <span className="absolute right-0 bg-green-500 border-2 border-white rounded-full bottom-2 size-4"></span>
                  )}
              </div>

              {/* Company name and online status */}
              <div className="flex flex-col -ml-5 text-center">
                <p className="font-mono text-xl font-bold text-white xl:text-3xl">
                  {participantProfile.name || "No User"}
                </p>
              </div>
            </div>
          )}
        </div>
        {error && (
          <div className="flex flex-col items-center justify-center">
            <p className="text-xl text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 mt-4 text-white bg-blue-500 rounded"
            >
              Retry
            </button>
          </div>
        )}
        {!error && (
          <Message
            handleError={handleError}
            error={error}
            userId={user?._id}
            receiverId={receiverId as string}
          />
        )}
      </Background>
    </div>
  );
};

export default MessagePage;
