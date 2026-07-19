import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const {
    user,
    logout,
  } = useAuth();

  const navigate =
    useNavigate();

  const handleLogout = async () => {
    try {
      await logout();

      navigate(
        "/login",
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    }
  };

  const canAccessManagement =
    user?.role === "Manager" ||
    user?.role === "HR";

  const canAccessReports =
    user?.role === "HR";

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand">
          <div className="navbar-logo">
            LF
          </div>

          <span>
            LeaveFlow
          </span>
        </div>

        <div className="navbar-links">
          <NavigationLink
            to="/"
            label="Dashboard"
          />

          {canAccessManagement && (
            <>
              <NavigationLink
                to="/approvals"
                label="Approvals"
              />

              <NavigationLink
                to="/calendar"
                label="Team Calendar"
              />
            </>
          )}

          {canAccessReports && (
            <NavigationLink
              to="/reports"
              label="Reports"
            />
          )}
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-user">
          <div className="navbar-user-email">
            {user?.email ||
              "Authenticated User"}
          </div>

          <div className="navbar-user-role">
            {user?.role ||
              "User"}
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="navbar-signout"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}

function NavigationLink({
  to,
  label,
}) {
  return (
    <NavLink
      to={to}
      className={({
        isActive,
      }) =>
        isActive
          ? "navbar-link navbar-link-active"
          : "navbar-link"
      }
    >
      {label}
    </NavLink>
  );
}

export default Navbar;