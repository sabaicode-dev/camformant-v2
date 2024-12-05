// Adjust the path as needed

import MyCalendar from "./calendar";

// Example events to pass to MyCalendar
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
  return (
    <div>
      <h1>My Calendar</h1>
      <MyCalendar events={events} />
    </div>
  );
};

export default CalendarPage;
