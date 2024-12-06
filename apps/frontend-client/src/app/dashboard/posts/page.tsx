"use client";
import React from "react";
import { usePathname } from "next/navigation";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import InputForm from "@/components/input-job";
import InputForms from "@/components/inputForm";

const PostPage = () => {
  const pathname = usePathname();
  return (
    <>
      <DynamicBreadcrumb />
      {pathname}
      {/* <InputForm formTitle="Post Job"/> */}
      <InputForms/>
    </>
  );
};

export default PostPage;
