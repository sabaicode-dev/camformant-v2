"use client";
import { useAuth } from "@/context/AuthContext";
// import MyCalendar from "./calendar";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import { useEffect } from "react";
import InterviewCalendar from "@/components/calendar/InterviewCalendar";

const events = [
  {
    title: "Team Meeting",
    start: new Date(2024, 1, 15, 9, 0),
    end: new Date(2024, 1, 15, 10, 0),
  },
  {
    title: "Lunch Break",
    start: new Date(2024, 1, 15, 12, 0),
    end: new Date(2024, 1, 15, 13, 0),
  },
];

const CalendarPage = () => {
  const { isLoading, user } = useAuth();

  if (!isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <h1>My Calendar</h1>
      {
        //ts-ignore
        // <MyCalendar events={events} />
        <InterviewCalendar/>
      }
    </div>
  );
};

export default CalendarPage;
