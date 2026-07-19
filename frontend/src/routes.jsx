import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import HRDashboard from "./pages/HRDashboard";
import ApprovalsPage from "./pages/ApprovalsPage";
import CalendarPage from "./pages/CalendarPage";
import ReportsPage from "./pages/ReportsPage";

function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Loading...
    </div>
  );
}

function ProtectedRoute({
  children,
  allowedRoles,
}) {
  const {
    user,
    loading,
  } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(
      user.role
    )
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

function RoleRedirect() {
  const {
    user,
    loading,
  } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (user.role === "Employee") {
    return (
      <Navigate
        to="/employee"
        replace
      />
    );
  }

  if (user.role === "Manager") {
    return (
      <Navigate
        to="/manager"
        replace
      />
    );
  }

  if (user.role === "HR") {
    return (
      <Navigate
        to="/hr"
        replace
      />
    );
  }

  return (
    <Navigate
      to="/login"
      replace
    />
  );
}

function LoginRoute() {
  const {
    user,
    loading,
  } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) {
    return <RoleRedirect />;
  }

  return <Login />;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <LoginRoute />
          }
        />

        <Route
          path="/"
          element={
            <RoleRedirect />
          }
        />

        <Route
          path="/employee"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Employee",
              ]}
            >
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Manager",
              ]}
            >
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hr"
          element={
            <ProtectedRoute
              allowedRoles={[
                "HR",
              ]}
            >
              <HRDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/approvals"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Manager",
                "HR",
              ]}
            >
              <ApprovalsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/calendar"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Manager",
                "HR",
              ]}
            >
              <CalendarPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute
              allowedRoles={[
                "HR",
              ]}
            >
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;