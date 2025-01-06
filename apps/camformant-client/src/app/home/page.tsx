"use client";
import Chat from "@/components/chat-home/chat";
import { Header } from "@/components/header/header";
import { PositionPost } from "@/components/posts/position-post";
import { RecommendationPost } from "@/components/posts/recommendation-post";
import { useNotification } from "@/hooks/user-notification";
import { useState } from "react";

export default function Home() {
  const [forSync,setForSync]=useState<boolean>(false)
  const { addNotification, NotificationDisplay } = useNotification();
  return (
    <>
      <NotificationDisplay />
      <Header />
      <RecommendationPost setForSync={setForSync} addNotifications={addNotification}/>
      <PositionPost forSync={forSync} addNotifications={addNotification}/>
      <Chat className="fixed bottom-20 right-0 p-4 bg-gradient-to-br from-orange-400 via-pink-300 to-yellow-300 shadow-2xl rounded-full text-white transform transition-transform hover:scale-105" />
    </>
  );
}
