"use client";

import { CardGeneral } from "@/components/card-notification/card-general";
// import { CardTips } from "@/components/card-notification/card-tips";
import { CategoryPosition } from "@/components/category-position/category-position";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";

export interface INotificationHistory {
  _id?: string;
  title?: string;
  description?: string;
  icon?: string;
  url?: string;
  updatedAt?: Date;
}
// Assuming CategoryPositionData is an array of categories
interface typeMee {
  id: number;
  text: string;
}
const CategoryPositionData: typeMee[] = [
  { id: 1, text: "General" },
  { id: 2, text: "Job Listings" },
  { id: 3, text: "Apply" },
];

const Page: React.FC = () => {
  const [contentId, setContentId] = useState(1);
  const typeQuery =
    contentId === 1 ? undefined : contentId === 2 ? "Job Listings" : "Apply";
  const query = typeQuery ? `?search=${typeQuery}` : "";
  const [data, setData] = useState<INotificationHistory[]>([]);
  //todo: pagination notification
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const res = await axiosInstance.get(
          `${API_ENDPOINTS.GET_NOTIFICATIONS}${query}`
        );
        const data = res.data.data as INotificationHistory[];
        setData(data);
        console.log(data);
      } catch (error) {
        console.log("error::: fetchNotification()");
        throw error;
      }
    };
    fetchNotification();
  }, [query]);

  function handleClickId(id: number) {
    setContentId(id);
  }

  return (
    <div>
      <div className="w-screen bg-white">
        <div className="w-full shadow-md">
          <div className="flex items-center justify-start gap-5 mb-4 ml-5 mt-9 ">
            <a href="/home">
              <span className="text-2xl">
                <IoArrowBack />
              </span>
            </a>
            <h1 className="pl-1 text-xl font-medium">Notification</h1>
          </div>
          <div className="flex items-center justify-start py-2 mb-2 overflow-x-auto gap-x-4 gap-y-5 ">
            {CategoryPositionData.map((item) => (
              <div key={item.id}>
                <CategoryPosition
                  key={item.id}
                  className={`cursor-pointer`}
                  text={item.text}
                  isSelected={contentId === item.id}
                  onClick={() => handleClickId(item.id)}
                ></CategoryPosition>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full p-4">
          {contentId && <CardGeneral data={data} />}
          {/* {contentId === 2 && <Content2 />} */}
        </div>
      </div>
    </div>
  );
};

export default Page;
