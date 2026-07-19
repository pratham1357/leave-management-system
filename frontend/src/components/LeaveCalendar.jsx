import { useEffect, useState } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  Views
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import {
  format,
  parse,
  startOfWeek,
  getDay,
  addDays
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Controlled calendar navigation
  const [currentDate, setCurrentDate] = useState(
    new Date()
  );

  const [currentView, setCurrentView] = useState(
    Views.MONTH
  );

  useEffect(() => {
    loadCalendar();
  }, []);

  const formatLeaveType = (leaveType) => {
    if (!leaveType) {
      return "Leave";
    }

    return leaveType
      .toLowerCase()
      .split("_")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");
  };

  const parseDate = (dateValue) => {
    if (!dateValue) {
      return null;
    }

    /*
      Prevents date-only values such as "2026-07-21"
      from being interpreted as UTC and shifting dates
      depending on the browser timezone.
    */
    if (
      typeof dateValue === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(dateValue)
    ) {
      return new Date(`${dateValue}T00:00:00`);
    }

    return new Date(dateValue);
  };

  const loadCalendar = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCalendarData();

      const calendarData = Array.isArray(data)
        ? data
        : data?.items || data?.events || [];

      const formatted = calendarData
        .map((item) => {
          const employeeId =
            item.employeeId ||
            item.employee_id ||
            "Employee";

          const leaveType =
            item.leaveType ||
            item.leave_type ||
            "LEAVE";

          const startDate =
            item.startDate ||
            item.start_date;

          const endDate =
            item.endDate ||
            item.end_date;

          const start = parseDate(startDate);
          const parsedEnd = parseDate(endDate);

          if (
            !start ||
            !parsedEnd ||
            Number.isNaN(start.getTime()) ||
            Number.isNaN(parsedEnd.getTime())
          ) {
            console.warn(
              "Skipping calendar event with invalid dates:",
              item
            );

            return null;
          }

          return {
            title: `${employeeId} · ${formatLeaveType(
              leaveType
            )}`,
            start,

            /*
              react-big-calendar treats the end date of
              an all-day event as exclusive.

              Adding one day ensures the final approved
              leave date is displayed on the calendar.
            */
            end: addDays(parsedEnd, 1),

            allDay: true,
            employeeId,
            leaveType
          };
        })
        .filter(Boolean);

      setEvents(formatted);
    } catch (err) {
      console.error(
        "Failed to load calendar data:",
        err
      );

      setError(
        "Unable to load the team absence calendar."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleViewChange = (newView) => {
    setCurrentView(newView);
  };

  const eventStyleGetter = (event) => {
    const leaveType =
      event.leaveType?.toUpperCase();

    const styleMap = {
      CASUAL: "calendar-event-casual",
      SICK: "calendar-event-sick",
      EARNED: "calendar-event-earned",
      UNPAID: "calendar-event-unpaid"
    };

    return {
      className:
        styleMap[leaveType] ||
        "calendar-event-default"
    };
  };

  if (loading) {
    return (
      <div className="calendar-card">
        <div className="calendar-loading">
          <div className="calendar-spinner" />

          <div className="calendar-loading-title">
            Loading team calendar
          </div>

          <div className="calendar-loading-description">
            Fetching approved leave schedules...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calendar-card">
        <div className="calendar-error-state">
          <div className="calendar-error-icon">
            !
          </div>

          <div className="empty-state-title">
            Calendar unavailable
          </div>

          <div className="empty-state-description">
            {error}
          </div>

          <button
            type="button"
            className="btn btn-primary calendar-retry-button"
            onClick={loadCalendar}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-card">
      <div className="calendar-card-header">
        <div>
          <h2 className="calendar-card-title">
            Absence Schedule
          </h2>

          <p className="calendar-card-description">
            {events.length} approved leave{" "}
            {events.length === 1
              ? "request"
              : "requests"}{" "}
            scheduled
          </p>
        </div>

        <div className="calendar-legend">
          <Legend
            type="casual"
            label="Casual"
          />

          <Legend
            type="sick"
            label="Sick"
          />

          <Legend
            type="earned"
            label="Earned"
          />

          <Legend
            type="unpaid"
            label="Unpaid"
          />
        </div>
      </div>

      <div className="calendar-body">
        <Calendar
          localizer={localizer}
          events={events}

          date={currentDate}
          view={currentView}

          onNavigate={handleNavigate}
          onView={handleViewChange}

          startAccessor="start"
          endAccessor="end"

          eventPropGetter={eventStyleGetter}

          views={[
            Views.MONTH,
            Views.WEEK,
            Views.DAY
          ]}

          popup
          selectable={false}
          showMultiDayTimes

          style={{
            height: 650
          }}
        />
      </div>
    </div>
  );
}

function Legend({ type, label }) {
  return (
    <div className="calendar-legend-item">
      <span
        className={`calendar-legend-dot calendar-legend-${type}`}
      />

      <span>{label}</span>
    </div>
  );
}

export default LeaveCalendar;