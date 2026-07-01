import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div
      style={{
        padding: "15px",
        display: "flex",
        gap: "20px",
        background: "#f0f0f0"
      }}
    >
      <Link to="/">Employee Dashboard</Link>
      <Link to="/manager">Manager Dashboard</Link>
      <Link to="/calendar">Calendar</Link>
    </div>
  );
}

export default Navbar;