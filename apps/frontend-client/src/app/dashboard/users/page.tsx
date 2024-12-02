"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import { useAuth } from "@/context/AuthContext";

const UserPage = () => {
  const pathname = usePathname();
  return (
    <>
      <DynamicBreadcrumb />
      {pathname}
    </>
  );
};

export default UserPage;
