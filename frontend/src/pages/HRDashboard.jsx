import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import Navbar from "../components/Navbar";

import {
  getPendingRequests,
} from "../api/managerApi";

import {
  getCalendarData,
} from "../api/calendarApi";


function HRDashboard() {
  const [stats, setStats] =
    useState({
      pendingApprovals: 0,
      currentlyOnLeave: 0,
      upcomingAbsences: 0,
      approvedLeaveRecords: 0,
    });

  const [
    upcomingLeaves,
    setUpcomingLeaves,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          pendingRequests,
          calendarData,
        ] = await Promise.all([
          getPendingRequests(),
          getCalendarData(),
        ]);


        const today =
          new Date();

        today.setHours(
          0,
          0,
          0,
          0
        );


        const currentlyOnLeave =
          calendarData.filter(
            (leave) => {
              const startDate =
                new Date(
                  leave.startDate
                );

              const endDate =
                new Date(
                  leave.endDate
                );

              return (
                startDate <= today &&
                endDate >= today
              );
            }
          );


        const upcoming =
          calendarData
            .filter(
              (leave) => {
                const startDate =
                  new Date(
                    leave.startDate
                  );

                return (
                  startDate > today
                );
              }
            )
            .sort(
              (a, b) =>
                new Date(
                  a.startDate
                ) -
                new Date(
                  b.startDate
                )
            );


        setStats({
          pendingApprovals:
            pendingRequests.length,

          currentlyOnLeave:
            currentlyOnLeave.length,

          upcomingAbsences:
            upcoming.length,

          approvedLeaveRecords:
            calendarData.length,
        });


        setUpcomingLeaves(
          upcoming.slice(
            0,
            5
          )
        );

      } catch (err) {
        console.error(
          "Failed to load HR dashboard:",
          err
        );

        setError(
          "Unable to load HR dashboard statistics."
        );

      } finally {
        setLoading(false);
      }
    };


    loadDashboard();
  }, []);


  return (
    <div>
      <Navbar />

      <main className="page">
        <div className="page-container">

          <header className="hr-dashboard-header">

            <div>
              <div className="hr-dashboard-eyebrow">
                WORKFORCE MANAGEMENT
              </div>

              <h1 className="page-title">
                HR Dashboard
              </h1>

              <p className="page-description">
                Monitor organization-wide leave
                activity, employee availability,
                and pending approval workload.
              </p>
            </div>


            <div className="hr-header-actions">

              <Link
                to="/approvals"
                className="btn btn-primary"
              >
                Review Approvals
              </Link>

              <Link
                to="/calendar"
                className="btn btn-secondary"
              >
                View Calendar
              </Link>

            </div>

          </header>


          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}


          {loading ? (
            <div className="dashboard-loading">
              Loading workforce overview...
            </div>
          ) : (
            <>

              <section className="hr-overview-section">

                <div className="section-heading">
                  <div>
                    <h2 className="section-title">
                      Workforce Overview
                    </h2>

                    <p className="section-description">
                      Current organization-wide
                      leave activity at a glance.
                    </p>
                  </div>
                </div>


                <div className="stats-grid">

                  <HRStatCard
                    title="Pending Approvals"
                    value={
                      stats.pendingApprovals
                    }
                    code="PA"
                    type="pending"
                    description="Requests awaiting review"
                  />

                  <HRStatCard
                    title="Currently on Leave"
                    value={
                      stats.currentlyOnLeave
                    }
                    code="OL"
                    type="active"
                    description="Employees absent today"
                  />

                  <HRStatCard
                    title="Upcoming Absences"
                    value={
                      stats.upcomingAbsences
                    }
                    code="UA"
                    type="upcoming"
                    description="Scheduled future absences"
                  />

                  <HRStatCard
                    title="Approved Records"
                    value={
                      stats.approvedLeaveRecords
                    }
                    code="AR"
                    type="approved"
                    description="Total approved leave records"
                  />

                </div>

              </section>


              <div className="hr-dashboard-grid">

                <section className="dashboard-panel">

                  <div className="dashboard-panel-header">

                    <div>
                      <h2 className="dashboard-panel-title">
                        Upcoming Absences
                      </h2>

                      <p className="dashboard-panel-description">
                        Employees with approved
                        leave scheduled next.
                      </p>
                    </div>


                    <Link
                      to="/calendar"
                      className="dashboard-text-link"
                    >
                      View all
                    </Link>

                  </div>


                  {upcomingLeaves.length ===
                  0 ? (
                    <div className="dashboard-empty-state">

                      <div className="dashboard-empty-icon">
                        ✓
                      </div>

                      <div className="empty-state-title">
                        No upcoming absences
                      </div>

                      <div className="empty-state-description">
                        There are currently no
                        approved future absences.
                      </div>

                    </div>
                  ) : (
                    <div className="absence-list">

                      {upcomingLeaves.map(
                        (
                          leave,
                          index
                        ) => (
                          <div
                            key={
                              `${leave.employeeId}-${leave.startDate}-${index}`
                            }
                            className="absence-list-item"
                          >

                            <div className="employee-avatar">
                              {getEmployeeInitials(
                                leave.employeeId
                              )}
                            </div>


                            <div className="absence-details">

                              <div className="absence-employee">
                                {
                                  leave.employeeId
                                }
                              </div>

                              <div className="absence-meta">

                                <span>
                                  {formatLeaveType(
                                    leave.leaveType
                                  )}
                                </span>

                                <span className="absence-dot">
                                  •
                                </span>

                                <span>
                                  {
                                    leave.startDate
                                  }
                                  {" → "}
                                  {
                                    leave.endDate
                                  }
                                </span>

                              </div>

                            </div>

                          </div>
                        )
                      )}

                    </div>
                  )}

                </section>


                <section className="dashboard-panel">

                  <div className="dashboard-panel-header">

                    <div>
                      <h2 className="dashboard-panel-title">
                        Approval Workload
                      </h2>

                      <p className="dashboard-panel-description">
                        Requests currently waiting
                        for HR or management
                        action.
                      </p>
                    </div>

                  </div>


                  <div className="hr-approval-summary">

                    <div className="hr-approval-number">
                      {
                        stats.pendingApprovals
                      }
                    </div>

                    <div className="hr-approval-label">
                      pending leave{" "}
                      {stats.pendingApprovals ===
                      1
                        ? "request"
                        : "requests"}
                    </div>


                    {stats.pendingApprovals >
                    0 ? (
                      <p className="hr-approval-message">
                        There are outstanding
                        requests that require
                        review.
                      </p>
                    ) : (
                      <p className="hr-approval-message">
                        All submitted leave
                        requests have been
                        processed.
                      </p>
                    )}


                    <Link
                      to="/approvals"
                      className="btn btn-primary hr-approval-button"
                    >
                      {stats.pendingApprovals >
                      0
                        ? "Review Pending Requests"
                        : "Open Approvals"}
                    </Link>

                  </div>

                </section>


                <section className="dashboard-panel">

                  <div className="dashboard-panel-header">

                    <div>
                      <h2 className="dashboard-panel-title">
                        Workforce Snapshot
                      </h2>

                      <p className="dashboard-panel-description">
                        Summary of organization
                        leave availability.
                      </p>
                    </div>

                  </div>


                  <div className="workforce-summary">

                    <SummaryRow
                      label="Employees currently absent"
                      value={
                        stats.currentlyOnLeave
                      }
                    />

                    <SummaryRow
                      label="Upcoming approved absences"
                      value={
                        stats.upcomingAbsences
                      }
                    />

                    <SummaryRow
                      label="Requests awaiting action"
                      value={
                        stats.pendingApprovals
                      }
                    />

                    <SummaryRow
                      label="Approved leave records"
                      value={
                        stats.approvedLeaveRecords
                      }
                    />

                  </div>

                </section>


                <section className="dashboard-panel">

                  <div className="dashboard-panel-header">

                    <div>
                      <h2 className="dashboard-panel-title">
                        HR Quick Actions
                      </h2>

                      <p className="dashboard-panel-description">
                        Access common workforce
                        management tasks.
                      </p>
                    </div>

                  </div>


                  <div className="quick-actions">

                    <Link
                      to="/approvals"
                      className="quick-action-card"
                    >

                      <div className="quick-action-icon quick-action-primary">
                        AP
                      </div>

                      <div>
                        <div className="quick-action-title">
                          Leave Approvals
                        </div>

                        <div className="quick-action-description">
                          Review and process
                          employee leave requests.
                        </div>
                      </div>

                      <span className="quick-action-arrow">
                        →
                      </span>

                    </Link>


                    <Link
                      to="/calendar"
                      className="quick-action-card"
                    >

                      <div className="quick-action-icon quick-action-secondary">
                        AC
                      </div>

                      <div>
                        <div className="quick-action-title">
                          Absence Calendar
                        </div>

                        <div className="quick-action-description">
                          View approved absences
                          across the organization.
                        </div>
                      </div>

                      <span className="quick-action-arrow">
                        →
                      </span>

                    </Link>

                  </div>

                </section>

              </div>

            </>
          )}

        </div>
      </main>
    </div>
  );
}


function HRStatCard({
  title,
  value,
  code,
  type,
  description,
}) {
  return (
    <div className="stat-card hr-stat-card">

      <div className="hr-stat-top">

        <div
          className={
            `dashboard-stat-icon dashboard-stat-${type}`
          }
        >
          {code}
        </div>

        <div className="hr-stat-value">
          {value}
        </div>

      </div>


      <div className="hr-stat-title">
        {title}
      </div>

      <div className="hr-stat-description">
        {description}
      </div>

    </div>
  );
}


function SummaryRow({
  label,
  value,
}) {
  return (
    <div className="workforce-summary-row">

      <span className="workforce-summary-label">
        {label}
      </span>

      <span className="workforce-summary-value">
        {value}
      </span>

    </div>
  );
}


function formatLeaveType(
  leaveType
) {
  if (!leaveType) {
    return "Leave";
  }

  return leaveType
    .toLowerCase()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase()
    );
}


function getEmployeeInitials(
  employeeId
) {
  if (!employeeId) {
    return "E";
  }

  return employeeId
    .replace(
      /[^a-zA-Z0-9]/g,
      ""
    )
    .slice(-2)
    .toUpperCase();
}


export default HRDashboard;