// import {
//   Calendar,
//   momentLocalizer,
//   Event as RbcEvent,
//   View,
// } from "react-big-calendar";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import { useEffect, useState } from "react";
// import moment from "moment-timezone";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { X } from "lucide-react";
// import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
// import { useAuth } from "@/context/AuthContext";
// import axiosInstance from "@/utils/axios";

// // Define your event type
// interface Event extends RbcEvent {
//   id?: number;
//   title?: string;
//   start?: Date;
//   end?: Date;
// }

// // Example event list
// const myEventsList: Event[] = [
//   {
//     title: "Meeting",
//     start: moment("2024-02-11T15:00:00").toDate(),
//     end: moment("2024-02-11T16:00:00").toDate(),
//   },
//   {
//     title: "Coffee Break",
//     start: moment("2024-02-12T10:00:00").toDate(),
//     end: moment("2024-02-12T10:30:00").toDate(),
//   },
// ];

// // Localizer for moment.js
// const localizer = momentLocalizer(moment);

// const MyCalendar = ({ events }: { events?: Event[] }) => {
//   const [eventList, setEventList] = useState<Event[]>(events || myEventsList);
//   const [showModal, setShowModal] = useState(false);
//   const [date, setDate] = useState(new Date()); // State to hold current date
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null);
//   const [eventTitle, setEventTitle] = useState<string>("");
//   const [currentView, setCurrentView] = useState<View>("month");
//   const [startTime, setStartTime] = useState<string>("12:00");
//   const [endTime, setEndTime] = useState<string>("13:00");
//   const [selectEvent, setSelectEvent] = useState<Event | null>(null);

//   console.log("days:",date)
//   const handleNavigate = (newDate: Date) => {
//     setDate(newDate);
//   };

//   const handleSelectSlot = (slotInfo: any) => {
//     console.log("Slot Selected:", slotInfo);
//     setShowModal(true);
//     setSelectedDate(slotInfo.start);
//     setStartTime(moment(slotInfo.start).format("HH:mm"));
//     setEndTime(moment(slotInfo.end).format("HH:mm"));
//   };

//   const handleSelectEvent = (event: any) => {
//     setShowModal(true);
//     setSelectEvent(event);
//     setEventTitle(event.title);
//     setStartTime(moment(event.start).format("HH:mm"));
//     setEndTime(moment(event.end).format("HH:mm"));
//   };

//   const saveEvent = () => {
//     if (eventTitle && selectedDate) {
//       const [startHour, startMinute] = startTime.split(":").map(Number);
//       const [endHour, endMinute] = endTime.split(":").map(Number);

//       // Adjust the selectedDate to midnight (start of the day) so that we can add the hour and minute correctly
//       const eventDate = new Date(
//         selectedDate.getFullYear(),
//         selectedDate.getMonth(),
//         selectedDate.getDate()
//       );

//       // Set the time zone to Cambodia's time zone (ICT)
//       const startDateTime = moment.tz(eventDate, "Asia/Phnom_Penh"); // Cambodia time zone
//       startDateTime.set("hour", startHour);
//       startDateTime.set("minute", startMinute);
//       startDateTime.set("second", 0);
//       startDateTime.set("millisecond", 0);

//       const endDateTime = moment.tz(eventDate, "Asia/Phnom_Penh"); // Cambodia time zone
//       endDateTime.set("hour", endHour);
//       endDateTime.set("minute", endMinute);
//       endDateTime.set("second", 0);
//       endDateTime.set("millisecond", 0);

//       // Logging for debugging
//       console.log("Start DateTime (ICT):", startDateTime.format());
//       console.log("End DateTime (ICT):", endDateTime.format());

//       // Create the event
//       if (selectEvent) {
//         // Update an existing event
//         const updatedEvent = {
//           ...selectEvent,
//           title: eventTitle,
//           start: startDateTime.toDate(), // Convert to native Date object
//           end: endDateTime.toDate(), // Convert to native Date object
//         };

//         setEventList((prevEventList) =>
//           prevEventList.map((event) =>
//             event.id === selectEvent.id ? updatedEvent : event
//           )
//         );
//       } else {
//         // Create a new event
//         const newEvent = {
//           id: new Date().getTime(), // Generate a unique ID
//           title: eventTitle,
//           start: startDateTime.toDate(), // Convert to native Date object
//           end: endDateTime.toDate(), // Convert to native Date object
//         };

//         setEventList((prevEventList) => [...prevEventList, newEvent]);
//       }

//       // Reset form and close modal
//       setShowModal(false);
//       setEventTitle("");
//       setSelectEvent(null);
//     }
//   };

//   const deleteEvents = () => {
//     if (selectEvent) {
//       const updatedEvents = eventList.filter((event) => event !== selectEvent);
//       setEventList(updatedEvents);
//       setShowModal(false);
//       setEventTitle("");
//       setSelectEvent(null);
//     }
//   };

//   // Function to set background color based on the date
//   const dayPropGetter = (date: Date) => {
//     const today = new Date();

//     // Set both `today` and `date` to have 00:00:00 as time to avoid time comparison issues
//     today.setHours(0, 0, 0, 0);
//     date.setHours(0, 0, 0, 0);

//     const isToday = today.getTime() === date.getTime();
//     const isPrevMonth = date.getMonth() !== today.getMonth();

//     // Detect dark mode using the window.matchMedia API
//     const isDarkMode =
//       window.matchMedia &&
//       window.matchMedia("(prefers-color-scheme: dark)").matches;

//     // Combine both styles into one object and apply both background and text color
//     const style = {
//       ...(isToday && {
//         backgroundColor: "orange",
//         color: isDarkMode ? "black" : "white", // Change text color based on dark mode
//       }),
//       ...(isPrevMonth && {
//         backgroundColor: isDarkMode
//           ? "rgba(255, 165, 0, 0.2)"
//           : "rgba(255, 165, 0, 0.1)", // Lighter shade for dark mode
//       }),
//     };

//     return { style };
//   };
//   const { isLoading, user } = useAuth();

//   useEffect(() => {
//     console.log("Fetching job data for Job ID:"); // Log the jobId
//     async function fetchData() {
//       try {
//         const response = await axiosInstance.get(
//           `${API_ENDPOINTS.JOB_APPLY}?companyId=${user?._id}`
//         );
//         console.log("data apply", response.data.data);
//       } catch (err) {
//         console.log(err);
//       }
//     }
//     user?._id && fetchData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user]);

//   if (!isLoading) {
//     return <p>Loading...</p>;
//   }
//   return (
//     <>
//       <div
//         className={`calendar-container ${window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : ""}`}
//       >
//         <Calendar
//           localizer={localizer}
//           events={eventList}
//           startAccessor="start"
//           endAccessor="end"
//           style={{ height: 600 }}
//           selectable={true}
//           date={date} // Set the date prop to control current date
//           toolbar={true} // Ensure toolbar is visible for view switching
//           onNavigate={handleNavigate} // Update date when navigating
//           defaultView="month" // Set initial view
//           view={currentView} // Bind current view to state
//           onView={(view) => setCurrentView(view)} // Update state on view change
//           onSelectSlot={handleSelectSlot}
//           onSelectEvent={handleSelectEvent}
//           dayPropGetter={dayPropGetter}
//           className="dark:text-white dark:bg-black" // Dark mode styles for text and background
//         />
//         {showModal && (
//           <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
//             <div className="relative w-full max-w-lg p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
//               {/* Modal Header */}
//               <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700">
//                 <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
//                   {selectEvent ? "Edit Event" : "Add Event"}
//                 </h4>
//                 <button
//                   type="button"
//                   className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
//                   aria-label="Close"
//                   onClick={() => {
//                     setShowModal(false);
//                     setEventTitle("");
//                     setSelectEvent(null);
//                   }}
//                 >
//                   <X />
//                 </button>
//               </div>
//               {/* Modal Body */}
//               <div className="mt-4">
//                 <label
//                   htmlFor="eventTitle"
//                   className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
//                 >
//                   Event Title
//                 </label>
//                 <Input
//                   type="text"
//                   id="eventTitle"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   value={eventTitle}
//                   onChange={(e) => setEventTitle(e.target.value)}
//                   placeholder="Enter event title"
//                 />
//                 <label className="block text-sm font-medium mt-4">
//                   Start Time
//                 </label>
//                 <Input
//                   type="time"
//                   value={startTime}
//                   onChange={(e) => setStartTime(e.target.value)}
//                 />
//                 <label className="block text-sm font-medium mt-4">
//                   End Time
//                 </label>
//                 <Input
//                   type="time"
//                   value={endTime}
//                   onChange={(e) => setEndTime(e.target.value)}
//                 />
//               </div>
//               {/* Modal Footer */}
//               <div className="mt-6 flex justify-end gap-2">
//                 {selectEvent && (
//                   <Button
//                     type="button"
//                     onClick={deleteEvents}
//                     className="bg-red-500"
//                   >
//                     delete
//                   </Button>
//                 )}
//                 <Button
//                   type="button"
//                   variant={"orange"}
//                   className="px-4 py-2 text-sm font-medium"
//                   onClick={saveEvent}
//                 >
//                   Save
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default MyCalendar;
