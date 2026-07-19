import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getReports } from "../api/reportsApi";

function ReportsPage() {
  const [reports, setReports] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getReports();

      setReports(data);
    } catch (err) {
      console.error(
        "Failed to load reports:",
        err
      );

      setError(
        "Unable to load reports and analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (
      !reports?.recentActivity?.length
    ) {
      return;
    }

    const headers = [
      "Request ID",
      "Employee ID",
      "Leave Type",
      "Start Date",
      "End Date",
      "Status",
    ];

    const rows =
      reports.recentActivity.map(
        (item) => [
          item.requestId || "",
          item.employeeId || "",
          item.leaveType || "",
          item.startDate || "",
          item.endDate || "",
          item.status || "",
        ]
      );

    const escapeCSVValue = (
      value
    ) => {
      const stringValue =
        String(value);

      if (
        stringValue.includes(",") ||
        stringValue.includes('"') ||
        stringValue.includes("\n")
      ) {
        return `"${stringValue.replace(
          /"/g,
          '""'
        )}"`;
      }

      return stringValue;
    };

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map(escapeCSVValue)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.setAttribute(
      "download",
      `leaveflow-report-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`
    );

    document.body.appendChild(
      link
    );

    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="page">
        <Navbar />

        <main className="page-container">
          <div className="dashboard-loading">
            Loading reports and analytics...
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <Navbar />

        <main className="page-container">
          <div className="alert alert-error">
            {error}
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={loadReports}
          >
            Try Again
          </button>
        </main>
      </div>
    );
  }

  const summary =
    reports?.summary || {};

  const leaveTypes =
    reports?.leaveTypes || {};

  const employeeUsage =
    reports?.employeeUsage || [];

  const recentActivity =
    reports?.recentActivity || [];

  const totalRequests =
    summary.totalRequests || 0;

  return (
    <div className="page">
      <Navbar />

      <main className="page-container">
        {/* Page Header */}
        <div className="reports-header">
          <div>
            <div className="reports-eyebrow">
              HR ANALYTICS
            </div>

            <h1 className="page-title">
              Reports & Analytics
            </h1>

            <p className="page-description">
              Review organization-wide leave
              activity, approval trends, and
              employee leave usage.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={exportCSV}
            disabled={
              recentActivity.length === 0
            }
          >
            Export CSV
          </button>
        </div>

        {/* Summary */}
        <section className="reports-summary-grid">
          <ReportStatCard
            label="Total Requests"
            value={totalRequests}
            type="total"
            code="ALL"
          />

          <ReportStatCard
            label="Approved"
            value={
              summary.approved || 0
            }
            type="approved"
            code="APR"
          />

          <ReportStatCard
            label="Pending"
            value={
              summary.pending || 0
            }
            type="pending"
            code="PND"
          />

          <ReportStatCard
            label="Rejected"
            value={
              summary.rejected || 0
            }
            type="rejected"
            code="REJ"
          />
        </section>

        {/* Analytics */}
        <section className="reports-analytics-grid">
          {/* Leave Type Breakdown */}
          <div className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2 className="dashboard-panel-title">
                  Leave Type Breakdown
                </h2>

                <p className="dashboard-panel-description">
                  Distribution of leave
                  requests by category.
                </p>
              </div>
            </div>

            <div className="report-breakdown-list">
              <BreakdownRow
                label="Casual Leave"
                value={
                  leaveTypes.CASUAL || 0
                }
                total={totalRequests}
                type="casual"
              />

              <BreakdownRow
                label="Sick Leave"
                value={
                  leaveTypes.SICK || 0
                }
                total={totalRequests}
                type="sick"
              />

              <BreakdownRow
                label="Earned Leave"
                value={
                  leaveTypes.EARNED || 0
                }
                total={totalRequests}
                type="earned"
              />

              <BreakdownRow
                label="Unpaid Leave"
                value={
                  leaveTypes.UNPAID || 0
                }
                total={totalRequests}
                type="unpaid"
              />
            </div>
          </div>

          {/* Employee Usage */}
          <div className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2 className="dashboard-panel-title">
                  Employee Leave Usage
                </h2>

                <p className="dashboard-panel-description">
                  Approved leave days used by
                  each employee.
                </p>
              </div>
            </div>

            {employeeUsage.length ===
            0 ? (
              <div className="dashboard-empty-state">
                <div className="empty-state-title">
                  No approved leave usage
                </div>

                <div className="empty-state-description">
                  Employee usage will appear
                  after leave requests are
                  approved.
                </div>
              </div>
            ) : (
              <div className="employee-usage-list">
                {employeeUsage.map(
                  (employee) => (
                    <div
                      className="employee-usage-item"
                      key={
                        employee.employeeId
                      }
                    >
                      <div className="employee-cell">
                        <div className="employee-avatar">
                          {getEmployeeInitials(
                            employee.employeeId
                          )}
                        </div>

                        <span>
                          {
                            employee.employeeId
                          }
                        </span>
                      </div>

                      <div className="employee-usage-value">
                        <strong>
                          {
                            employee.approvedDays
                          }
                        </strong>

                        <span>
                          {employee.approvedDays ===
                          1
                            ? "day"
                            : "days"}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="reports-activity-section">
          <div className="section-heading">
            <div>
              <h2 className="section-title">
                Recent Leave Activity
              </h2>

              <p className="section-description">
                Latest leave requests across
                the organization.
              </p>
            </div>
          </div>

          <div className="table-container">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Date Range</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentActivity.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="table-empty-state"
                    >
                      <div className="empty-state-title">
                        No leave activity
                      </div>

                      <div className="empty-state-description">
                        Leave requests will
                        appear here when they
                        are submitted.
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentActivity.map(
                    (item) => (
                      <tr
                        key={
                          item.requestId
                        }
                      >
                        <td>
                          <span className="request-id">
                            {
                              item.requestId
                            }
                          </span>
                        </td>

                        <td>
                          <div className="employee-cell">
                            <div className="employee-avatar">
                              {getEmployeeInitials(
                                item.employeeId
                              )}
                            </div>

                            <span>
                              {
                                item.employeeId
                              }
                            </span>
                          </div>
                        </td>

                        <td>
                          <span className="leave-type-text">
                            {formatLeaveType(
                              item.leaveType
                            )}
                          </span>
                        </td>

                        <td>
                          <div className="leave-date-range">
                            <span>
                              {
                                item.startDate
                              }
                            </span>

                            <span className="date-separator">
                              →
                            </span>

                            <span>
                              {
                                item.endDate
                              }
                            </span>
                          </div>
                        </td>

                        <td>
                          <StatusBadge
                            status={
                              item.status
                            }
                          />
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function ReportStatCard({
  label,
  value,
  type,
  code,
}) {
  return (
    <div className="report-stat-card">
      <div className="report-stat-header">
        <div
          className={`report-stat-icon report-stat-${type}`}
        >
          {code}
        </div>
      </div>

      <div className="report-stat-value">
        {value}
      </div>

      <div className="report-stat-label">
        {label}
      </div>
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  total,
  type,
}) {
  const percentage =
    total > 0
      ? Math.round(
          (value / total) * 100
        )
      : 0;

  return (
    <div className="report-breakdown-item">
      <div className="report-breakdown-header">
        <div className="report-breakdown-label">
          <span
            className={`report-breakdown-dot report-breakdown-${type}`}
          />

          {label}
        </div>

        <div className="report-breakdown-number">
          {value}

          <span>
            {percentage}%
          </span>
        </div>
      </div>

      <div className="report-progress-track">
        <div
          className={`report-progress-bar report-progress-${type}`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalizedStatus =
    status?.toLowerCase();

  const className =
    normalizedStatus === "approved"
      ? "badge badge-approved"
      : normalizedStatus ===
          "rejected"
        ? "badge badge-rejected"
        : "badge badge-pending";

  return (
    <span className={className}>
      {status || "PENDING"}
    </span>
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
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

function getEmployeeInitials(
  employeeId
) {
  if (!employeeId) {
    return "EM";
  }

  return employeeId
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(-2)
    .toUpperCase();
}

export default ReportsPage;