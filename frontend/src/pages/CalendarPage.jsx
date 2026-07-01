import LeaveCalendar from "../components/LeaveCalendar";
import Navbar from "../components/Navbar";
function CalendarPage() {
  return (
    <div>
      <Navbar />
      <h1>Team Absence Calendar</h1>
      <LeaveCalendar />
    </div>
  );
}

export default CalendarPage;