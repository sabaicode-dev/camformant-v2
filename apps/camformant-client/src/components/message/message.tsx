"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { IoMdSend } from "react-icons/io";
import Background from "../background/background";
import socket from "@/utils/socketClient"; // Import the socket instance
import axiosInstance from "@/utils/axios";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";

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

interface Message {
  _id?: string;
  senderId: string;
  receiverId: string;
  message: string;
  conversationId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const SkeletonLoader = () => (
  <div className="w-full p-4">
    {/* Message Skeleton */}
    <div className="space-y-2">
      <div className="h-12 bg-gray-300 rounded-md animate-pulse"></div>
      <div className="h-12 bg-gray-300 rounded-md animate-pulse"></div>
      <div className="h-12 bg-gray-300 rounded-md animate-pulse"></div>
    </div>
  </div>
);

const Message = React.memo(
  ({
    userId,
    handleError,
    error,
    receiverId,
  }: {
    handleError: (text: string) => void;
    userId?: string;
    receiverId: string;
    error: string | null;
  }) => {
    const id = receiverId;
    const [isSend, setIsSend] = useState(false);

    const [messages, setMessages] = useState<Message[] | []>();
    const [inputMessage, setInputMessage] = useState<string>("");
    const [conversationId, setConversationId] = useState<string>("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Ref to track message container for scrolling
    const messageContainerRef = useRef<HTMLDivElement>(null);
    //

    //pagination for scroll
    const [paginationMessage, setPaginationMessage] = useState({
      currentPage: 0,
      totalPage: 0,
      limit: 0,
      skip: 0,
      totalMessages: 0,
    });

    const [conversations, setConversations] = useState<conversation | null>({
      _id: "",
      roomId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      participants: [],
      messages: [],
    });
    //
    // Play sound notification when a new message is received
    const playNotificationSound = useCallback(() => {
      if (typeof window !== "undefined") {
        const notificationTone = new Audio(
          "/iphone-sms-tone-original-mp4-5732.mp3"
        );
        notificationTone.play();
      }
    }, []);

    const onScroll = useCallback(async () => {
      if (!messageContainerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } =
        messageContainerRef.current;

      if (scrollTop === 0 && hasMore && !isLoading && messages!.length > 0) {
        await loadMoreData();
      }
    }, [hasMore, isLoading, messages, page]);
    useEffect(() => {
      const div = messageContainerRef.current;
      if (!div) return;
      div.addEventListener("scroll", onScroll);
      return () => div.removeEventListener("scroll", onScroll);
    }, [onScroll]);
    // Scroll to the bottom of the messages container
    const scrollToBottom = useCallback(() => {
      const container = messageContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, []);
    useEffect(() => {
      // Fetch messages
      const fetchMessages = async () => {
        try {
          const response = await axiosInstance.get(
            `${API_ENDPOINTS.GET_MESSAGE}/${receiverId}`
          );
          const data = await response.data;
          if (response.status === 200 && data) {
            const conversation = data.conversation;
            setConversationId(conversation._id);
            setConversations(conversation);

            setPaginationMessage({
              currentPage: data.currentPage,
              totalPage: data.totalPage,
              limit: data.limit,
              skip: data.skip,
              totalMessages: data.totalMessages,
            });
            if (data.currentPage === data.totalPage) {
              setHasMore(false);
            }
            setMessages(conversation.messages);
            scrollToBottom();
          } else if (response.status === 404) {
            handleError("Message not found");
          }
        } catch (error) {
          console.error("chat error: ", error);
          handleError("Failed to fetch messages data");
        } finally {
          setIsLoading(false);
        }
      };
      if (receiverId) {
        fetchMessages();
      }
    }, [receiverId, handleError]);
    const loadMoreData = useCallback(async () => {
      if (!hasMore || isLoading) return; // Prevent fetching if no more data or already loading

      setIsLoading(true);
      try {
        const nextPage = page + 1;
        // const query = buildQuery(nextPage, selectedPosition);
        const res = await axiosInstance.get(
          `${API_ENDPOINTS.GET_MESSAGE}/${receiverId}?page=${nextPage}`
        );

        const data = await res.data; // Adjust based on your actual response structure
        console.log("data::,", data);

        if (res.status === 200 && data) {
          const conversation = data.conversation;
          setConversations(conversation);

          setPaginationMessage({
            currentPage: data.currentPage,
            totalPage: data.totalPage,
            limit: data.limit,
            skip: data.skip,
            totalMessages: data.totalMessages,
          });
          if (data.currentPage === data.totalPage) {
            setHasMore(false);
          }

          setMessages((prevMessage) => {
            const allMessages: Message[] = [
              ...conversation.messages,
              ...prevMessage!,
            ];

            return allMessages;
          });
          setPage(nextPage);
          const container = messageContainerRef.current;
          if (container) {
            container.scrollTop = 5;
          }
        } else if (res.status === 404) {
          handleError("Message not found");
        }
      } catch (error) {
        console.error("Error fetching more conversations:", error);
        handleError(
          "Failed to load more conversations. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    }, [hasMore, isLoading, page]);
    // Join the room of conversation
    // useEffect(() => {
    //   if (!conversationId) return;

    //   socket.emit("joinRoom", { conversationId });

    //   socket.on("receiveMessage", handleReceiveMessage);

    //   // Clean up on unmount
    //   return () => {
    //     socket.emit("leaveRoom", { conversationId });
    //     socket.off("receiveMessage", handleReceiveMessage);
    //   };
    // }, [conversationId, playNotificationSound, scrollToBottom]);

    useEffect(() => {
      // Listen for real-time messages
      socket.on("receiveMessage", (newMessage: Message) => {
        setMessages([...messages!, newMessage]);
        playNotificationSound();
        scrollToBottom();
      });

      return () => {
        socket.off("receiveMessage");
      };
    }, [messages, setMessages, socket]);
    const sendMessage = async () => {
      if (inputMessage.trim() === "") return;
      const newMessage: Message = {
        message: inputMessage,
        senderId: userId!,
        receiverId: receiverId,
        conversationId: conversationId!,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Emit the message to the server
      socket.emit("sendMessage", newMessage);
      setMessages([...messages!, newMessage]);
      // Play the sending sound & Clear the input
      playNotificationSound();
      setInputMessage("");
      setIsSend(true);
    };

    if (!receiverId && !error) {
      return (
        <div className="flex flex-col w-full h-screen">
          <Background>
            <SkeletonLoader />
          </Background>
        </div>
      );
    }
    const LoadingIndicator = () => (
      <div className="py-2 text-center">
        <div className="inline-block border-2 border-orange-500 rounded-full size-8 animate-spin border-r-transparent"></div>
      </div>
    );

    return (
      <>
        {/*body section: render message*/}
        <div className="-mt-28">
          <div
            className="overflow-auto w-screen h-[70vh] p-4 rounded-md xl:h-[60vh] pb-10"
            ref={messageContainerRef} // Add ref here
          >
            {isLoading && hasMore && <LoadingIndicator />}
            {messages?.length === 0 && (
              <p className="text-lg font-semibold text-center text-gray-600">
                {"Please Send Message to Start"}
              </p>
            )}
            {messages &&
              messages.map((message, idx) => (
                <div
                  key={message._id || message.receiverId}
                  className={`${messages.length - 1 === idx ? "mb-8" : "mb-2"} flex ${message.senderId === userId ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-xs break-words ${
                      message.senderId === userId
                        ? "bg-orange-400 text-gray-900"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {message.message}
                    <div
                      className={`text-xs ${
                        message.senderId === userId
                          ? "text-left text-gray-600"
                          : "text-right text-gray-500"
                      } mt-1`}
                    >
                      {formatDistanceToNow(new Date(message.createdAt!), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Footer section: message input */}
        <div className="absolute left-0 flex items-center justify-center w-full py-4 bg-white bottom-9 xl:w-full">
          <div className="relative flex items-center justify-center w-full p-5">
            <input
              className="w-full p-4 border border-gray-200 shadow-sm rounded-3xl"
              type="text"
              placeholder="Text Message"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <span
              className="absolute text-2xl cursor-pointer right-7"
              onClick={sendMessage}
            >
              <IoMdSend />
            </span>
          </div>
        </div>
      </>
    );
  }
);

// Add displayName for the component
Message.displayName = "MessageComponent";

export default Message;
