"use client";
import React from "react";
import { usePathname } from "next/navigation";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import InputForm from "./input-form";


const Post = () => {
  const pathname = usePathname();
  return (
    <>
      <DynamicBreadcrumb />
      {pathname}
      <InputForm/>
    </>
  );
};

export default Post;
