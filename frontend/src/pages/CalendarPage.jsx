import LeaveCalendar from "../components/LeaveCalendar";
import Navbar from "../components/Navbar";

function CalendarPage() {
  return (
    <div className="page">
      <Navbar />

      <main className="page-container">
        <div className="calendar-page-header">
          <div>
            <div className="calendar-eyebrow">
              TEAM OVERVIEW
            </div>

            <h1 className="page-title">
              Team Absence Calendar
            </h1>

            <p className="page-description">
              View approved employee leave schedules and keep track of team
              availability across the organization.
            </p>
          </div>

          <div className="calendar-approved-indicator">
            <span className="calendar-approved-dot" />
            Approved Leave
          </div>
        </div>

        <LeaveCalendar />
      </main>
    </div>
  );
}

export default CalendarPage;