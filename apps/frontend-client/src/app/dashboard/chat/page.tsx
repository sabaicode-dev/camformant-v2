"use client";
import React from "react";
import { usePathname } from "next/navigation";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import ContactSearch from "@/components/contact-search";

import Chat from "./chat";


const ChatPage = () => {
  const pathname = usePathname();
  return (
    <>
      <DynamicBreadcrumb />
      {pathname}
      <div className="flex h-[132px]">
        <ContactSearch />
      </div>
      <div className="">
        <Chat />
      </div>
    </>
  );
};

export default ChatPage;
