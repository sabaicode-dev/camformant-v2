"use client";
import { useAuth } from "@/context/AuthContext";
import MyCalendar from "./calendar";
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
  const {isLoading} = useAuth();
  if (!isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <h1>My Calendar</h1>
      {
        //ts-ignore
      <MyCalendar events={events} />
      }
    </div>
  );
};

export default CalendarPage;
