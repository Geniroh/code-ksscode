// "use client";
// import * as React from "react";

// import { Calendar } from "@/components/ui/calendar";

// const BookSessionPage = () => {
//   const [date, setDate] = React.useState<Date | undefined>(new Date());

//   return (
//     <Calendar
//       mode="single"
//       selected={date}
//       onSelect={setDate}
//       className="rounded-md border shadow w-full"
//     />
//   );
// };

// export default BookSessionPage;

"use client";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";

const localizer = dayjsLocalizer(dayjs);

// Static event list
const myEventsList = [
  {
    title: "Team Meeting",
    start: new Date(2025, 0, 10, 10, 0), // January 10, 2025, 10:00 AM
    end: new Date(2025, 0, 10, 11, 0), // January 10, 2025, 11:00 AM
  },
  {
    title: "Code Review",
    start: new Date(2025, 0, 12, 14, 0), // January 12, 2025, 2:00 PM
    end: new Date(2025, 0, 12, 15, 0), // January 12, 2025, 3:00 PM
  },
  {
    title: "Lunch with Client",
    start: new Date(2025, 0, 14, 12, 30), // January 14, 2025, 12:30 PM
    end: new Date(2025, 0, 14, 13, 30), // January 14, 2025, 1:30 PM
  },
];

const BookSessionPage = () => (
  <div>
    <Calendar
      localizer={localizer}
      events={myEventsList}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
  </div>
);

export default BookSessionPage;
