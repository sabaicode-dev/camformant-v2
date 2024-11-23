"use client";
import React from "react";
import { usePathname } from "next/navigation";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import FormPage from "./form";



const SettingPage = () => {
  const pathname = usePathname();
  return (
    <>
      <DynamicBreadcrumb />
      {pathname}
      <FormPage/>
    </>
  );
};

export default SettingPage;
