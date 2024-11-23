"use client";
import React from "react";
import { usePathname } from "next/navigation";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import ProfilePage from "./profile";



const SettingPage = () => {
  const pathname = usePathname();
  return (
    <>
      <DynamicBreadcrumb />
      {pathname}
      <ProfilePage/>
    </>
  );
};

export default SettingPage;
