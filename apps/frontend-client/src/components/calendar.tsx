// // src/components/Calendar.tsx
// import { Calendar, dayjsLocalizer } from 'react-big-calendar';
// import dayjs from 'dayjs';
// import 'react-big-calendar/lib/css/react-big-calendar.css'; // Use CSS instead of Sass

// // Initialize localizer using Day.js
// const localizer = dayjsLocalizer(dayjs);

// const events = [
//   {
//     title: 'Sample Event',
//     start: new Date(),
//     end: new Date(),
//   },
// ];

// const CalendarComponent: React.FC = () => (
//   <div style={{ height: '500px' }}>
//     <Calendar
//       localizer={localizer}
//       events={events}
//       startAccessor="start"
//       endAccessor="end"
//       style={{ height: 500 }}
//     />
//   </div>
// );

// export default CalendarComponent;
