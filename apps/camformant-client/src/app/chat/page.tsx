"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Background from "@/components/background/background";
import SkeletonCard from "@/components/message/SkeletonCard"; // Import SkeletonCard
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import Image from "next/image";
import { useAuth } from "@/context/auth";
import Link from "next/link";
import { useSocketContext } from "@/context/SocketContext";

interface AllConversations {
  _id: string;
  receiver: string;
  messages: string[];
  updatedAt: Date;
  role: string;
  name: string;
  profile: string;
}
interface RespondGetConversations {
  conversations: AllConversations[];
  totalConversation: number;
  currentPage: number;
  totalPage: number;
  limit: number;
  skip: number;
}
const Chat = () => {
  const router = useRouter();
  const [conversations, setConversations] = useState<AllConversations[] | []>(
    []
  );
  const [pagination, setPagination] = useState({
    totalConversation: 0,
    currentPage: 0,
    totalPage: 0,
    limit: 0,
    skip: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const { isAuthenticated } = useAuth();
  const socketContext = useSocketContext();
  const onlineUsers = socketContext ? socketContext.onlineUsers : [];
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const divRef = useRef<HTMLDivElement>(null);
  //todo: scroll conversations
  const loadMoreData = useCallback(async () => {
    if (!hasMore || isLoading) return; // Prevent fetching if no more data or already loading

    setIsLoading(true);
    try {
      const nextPage = page + 1;
      // const query = buildQuery(nextPage, selectedPosition);
      const query = `?page=${nextPage}`;
      const res = await axiosInstance.get(
        `${API_ENDPOINTS.GET_CONVERSATIONS}${query}`
      );

      const data = res.data; // Adjust based on your actual response structure
      const { conversations, totalConversation, currentPage, totalPage } = data;

      if (conversations.length === 0 || nextPage >= totalPage) {
        setHasMore(false); // No more data to fetch
      }

      setConversations((prevCons) => [...prevCons, ...conversations]);
      setPage(nextPage);
    } catch (error) {
      console.error("Error fetching more conversations:", error);
      setError("Failed to load more conversations. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, isLoading, page]);

  const onScroll = useCallback(async () => {
    if (
      divRef.current?.clientHeight! + window.scrollY >=
        divRef.current?.clientHeight! &&
      hasMore &&
      !isLoading &&
      conversations.length > 0
    ) {
      console.log("hi");

      await loadMoreData();
    }
  }, [hasMore, isLoading, loadMoreData, conversations]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        setIsLoading(true);
        setHasMore(true);
        setPage(1);
        setConversations([]);
        const res = await axiosInstance.get(API_ENDPOINTS.GET_CONVERSATIONS);
        const conversations: RespondGetConversations = res.data;
        setPagination({
          totalConversation: conversations.totalConversation,
          currentPage: conversations.currentPage,
          totalPage: conversations.totalPage,
          limit: conversations.limit,
          skip: conversations.skip,
        });
        setConversations(conversations.conversations);
        if (
          conversations.totalPage <= 1 ||
          conversations.conversations.length === 0
        ) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    getConversations();
  }, []);
  console.log("hasmore", hasMore);
  console.log("height", divRef.current?.clientHeight);
  console.log("window::", window.innerHeight);
  console.log("window.scrollY::", window.scrollY);
  console.log("document.body.scrollHeight::", document.body.scrollHeight);

  const handleConversationClick = (conId: string) => {
    router.push(`/chat/${conId}`);
  };
  //todo: scroll for more conversations
  return (
    <div className="relative h-screen">
      <Background>
        <div className="absolute inset-0 flex flex-col bg-slate-50/75 mt-28 rounded-3xl xl:mt-32">
          <div className="flex-1 p-4 pb-20 overflow-auto" ref={divRef}>
            <p className="absolute mt-[-80px] text-white font-mono text-3xl font-bold">
              Contact
            </p>

            {isLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : !isAuthenticated ? (
              <div className="flex flex-col items-center justify-center gap-y-5">
                <p className="w-full mt-10 text-center text-md">
                  Please Login and try again.
                </p>
                <Link
                  href="/login"
                  className="p-3 text-white rounded-xl bg-primaryCam"
                >
                  Login
                </Link>
              </div>
            ) : error ? (
              <p className="w-full mt-10 text-center text-md">
                Something went wrong! Please try again.
              </p>
            ) : conversations.length === 0 ? (
              <p className="w-full text-center text-md">
                {"No users available."}
              </p>
            ) : (
              conversations.map((con, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-8 p-4 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleConversationClick(con.receiver)}
                >
                  {/* Container for image and status */}
                  <div className="relative">
                    {Array.isArray(onlineUsers) &&
                      onlineUsers.includes(con.receiver) && (
                        <span className="absolute bottom-0 right-0 bg-green-500 border-2 border-white rounded-full size-4"></span>
                      )}
                    {con.profile && (
                      <Image
                        src={con.profile}
                        alt={`${con.name} profile`}
                        width={7087}
                        height={7087}
                        className="object-cover rounded-full size-16"
                      />
                    )}
                  </div>
                  <p>{con.name}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </Background>
    </div>
  );
};

export default Chat;
