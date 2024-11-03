"use client";
import React from "react";
import { usePathname } from "next/navigation";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";

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
