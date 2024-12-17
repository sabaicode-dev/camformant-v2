"use client";
import { useAuth } from "@/context/AuthContext";
import MyCalendar from "./calendar";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";

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
  const {isLoading,user} = useAuth();
  
  useEffect(() => {
    console.log("Fetching job data for Job ID:"); // Log the jobId
    async function fetchData() {
      try {
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.JOB_APPLY}?companyId=${user?._id}`
        );
       console.log(response.data.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  if (isLoading) {
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
function useEffect(arg0: () => void, arg1: never[]) {
  throw new Error("Function not implemented.");
}

