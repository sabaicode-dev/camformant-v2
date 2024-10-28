"use client";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import { usePathname } from "next/navigation";
import React from "react";

const PostPage = () => {
    const pathname = usePathname();
    return (
        <>
            <DynamicBreadcrumb />
            {pathname}
        </>
    );
};

export default PostPage;
