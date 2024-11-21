"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";

const UserPage = () => {
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    useEffect(() => {
        axiosInstance
            .get(API_ENDPOINTS.GET_CONVERSATIONS)
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => {
                console.log("iushdfiouhasoidufhas", err);
            });
    }, []);
    console.log("user:::", user);
    return (
        <>
            <DynamicBreadcrumb />
            {pathname}
        </>
    );
};

export default UserPage;
