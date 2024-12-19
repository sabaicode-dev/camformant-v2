"use client";

import { Calendar, momentLocalizer, View } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import moment from "moment-timezone";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/utils/axios";
import { EventModal } from "./EventModal";
import { InterviewEvent, JobApply } from "@/utils/types/calendar";
import { eventStyleGetter } from "./CalendarStyle";
import { JobApplication } from "@/utils/types/job";

const localizer = momentLocalizer(moment);

const InterviewCalendar = () => {
  // const [events, setEvents] = useState<InterviewEvent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<InterviewEvent | null>(
    null
  );
  const [currentView, setCurrentView] = useState<View>("month");
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<InterviewEvent[]>([]);
  const { isLoading, user } = useAuth();

  useEffect(() => {
    const fetchInterviews = async () => {
      if (!user?._id) return;
      try {
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.JOB_APPLY}?companyId=${user._id}`
        );

        const applications: JobApplication[] = response.data.data.map(
          (application:JobApplication) => {
            return {
              _id: application._id,
              status: application.userInfo?.status,
              candidateName: application.userInfo?.name,
              interviewLocation: application.companyResponse?.interviewLocation,
              interviewDate: application.companyResponse?.interviewDate
                ? new Date(
                    application.companyResponse.interviewDate
                  ).toISOString() // Convert Date to ISO string
                : undefined,
              // Add more transformations or mappings here
            };
          }
        );
        console.log("heeee:", applications);
        const events: InterviewEvent[] = applications.map((application) => ({
          _id: application._id || "", // Unique identifier for the event
          title: `${application.userInfo?.name}`, // Event title based on candidate's name
          start: application.companyResponse?.interviewDate
            ? new Date(application.companyResponse.interviewDate)
            : new Date(), // Start time from interviewDate
          end: application.companyResponse?.interviewDate
            ? new Date(application.companyResponse.interviewDate)
            : new Date(), // You can adjust the end date if you have a specific duration
          candidateName: application.userInfo?.name, // Candidate's name
          location: application.companyResponse?.interviewLocation, // Interview location
        }));
        setEvents(events);
        
      } catch (error) {
        console.error("Error fetching interviews:", error);
      }
    };

    fetchInterviews();
  }, [user?._id]);

  const handleSelectEvent = (event: InterviewEvent) => {
    setSelectedEvent(event);
    console.log("hello");
    setShowModal(true);
  };

  if (!isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="calendar-container dark:bg-gray-900 p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        view={currentView}
        onView={(view) => setCurrentView(view)}
        date={date}
        onNavigate={(newDate) => setDate(newDate)}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleSelectEvent}
        className="dark:text-white dark:bg-gray-800 rounded-lg shadow-lg"
      />

      {showModal && selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => {
            setShowModal(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default InterviewCalendar;
