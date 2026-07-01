import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import {
  format,
  parse,
  startOfWeek,
  getDay
} from "date-fns";

import { enUS } from "date-fns/locale";
import { getCalendarData } from "../api/calendarApi";

const locales = {
  "en-US": enUS
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

function LeaveCalendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadCalendar();
  }, []);

  const loadCalendar = async () => {
    const data = await getCalendarData();

    const formatted = data.map((item) => ({
      title: `${item.employeeId} - ${item.leaveType}`,
      start: new Date(item.startDate),
      end: new Date(item.endDate)
    }));

    setEvents(formatted);
  };

  return (
    <div style={{ height: "700px" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
      />
    </div>
  );
}

export default LeaveCalendar;