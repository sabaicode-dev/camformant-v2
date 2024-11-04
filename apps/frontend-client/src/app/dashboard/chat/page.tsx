"use client";
import React from "react";
import { usePathname } from "next/navigation";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import ContactSearch from "@/components/contact-search";

import ChatPage from "./chat";


const Chat = () => {
  const pathname = usePathname();
  return (
    <>
      <DynamicBreadcrumb />
      {pathname}
      <div className="flex h-[132px]">
        <ContactSearch />
      </div>
      <div className="">
        <ChatPage />
      </div>
    </>
  );
};

export default Chat;
