import {
  useCallback,
  useEffect,
  useState,
} from "react";

import LeaveBalanceCard from "../components/LeaveBalanceCard";
import LeaveForm from "../components/LeaveForm";
import LeaveTable from "../components/LeaveTable";
import Navbar from "../components/Navbar";

import { useAuth } from "../context/AuthContext";

import {
  getLeaveBalance,
  getLeaveHistory,
} from "../api/leaveApi";


function EmployeeDashboard() {
  const { user } = useAuth();

  const [balances, setBalances] =
    useState({
      casual: 0,
      sick: 0,
      earned: 0,
      unpaid: 0,
    });

  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const employeeId =
    user?.employeeId;


  const loadData = useCallback(
    async () => {
      if (!employeeId) {
        setError(
          "No employee ID is associated with this account."
        );

        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [
          balanceData,
          historyData,
        ] = await Promise.all([
          getLeaveBalance(
            employeeId
          ),
          getLeaveHistory(
            employeeId
          ),
        ]);


        const mappedBalances = {
          casual: 0,
          sick: 0,
          earned: 0,
          unpaid: 0,
        };


        balanceData.forEach(
          (balance) => {
            if (
              balance.balance_key ===
              "CASUAL"
            ) {
              mappedBalances.casual =
                balance.remaining_days;
            }

            if (
              balance.balance_key ===
              "SICK"
            ) {
              mappedBalances.sick =
                balance.remaining_days;
            }

            if (
              balance.balance_key ===
              "EARNED"
            ) {
              mappedBalances.earned =
                balance.remaining_days;
            }

            if (
              balance.balance_key ===
              "UNPAID"
            ) {
              mappedBalances.unpaid =
                balance.remaining_days;
            }
          }
        );


        setBalances(
          mappedBalances
        );


        const formattedRequests =
          historyData.map(
            (request) => ({
              requestId:
                request.request_id,

              leaveType:
                request.leave_type,

              status:
                request.status,

              startDate:
                request.start_date,

              endDate:
                request.end_date,

              reason:
                request.reason,
            })
          );


        setRequests(
          formattedRequests
        );

      } catch (err) {
        console.error(
          "Failed to load employee data:",
          err
        );

        setError(
          "Unable to load your leave information."
        );

        setBalances({
          casual: 0,
          sick: 0,
          earned: 0,
          unpaid: 0,
        });

        setRequests([]);

      } finally {
        setLoading(false);
      }
    },
    [employeeId]
  );


  useEffect(() => {
    loadData();
  }, [loadData]);


  return (
    <div>
      <Navbar />

      <main className="page">
        <div className="page-container">

          <header className="employee-header">
            <div>
              <h1 className="page-title">
                Employee Dashboard
              </h1>

              <p className="page-description">
                Manage your leave requests,
                balances, and application
                history.
              </p>
            </div>

            <div className="employee-identity">
              <span className="employee-identity-label">
                Employee ID
              </span>

              <span className="employee-identity-value">
                {employeeId ||
                  "Not assigned"}
              </span>
            </div>
          </header>


          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}


          {loading ? (
            <div className="dashboard-loading">
              Loading your leave
              information...
            </div>
          ) : employeeId ? (
            <>
              <section>
                <div className="section-heading">
                  <div>
                    <h2 className="section-title">
                      Leave Balance
                    </h2>

                    <p className="section-description">
                      Your currently available
                      leave allocation.
                    </p>
                  </div>
                </div>


                <div className="leave-balance-grid">
                  <LeaveBalanceCard
                    title="Casual Leave"
                    value={
                      balances.casual
                    }
                    type="casual"
                  />

                  <LeaveBalanceCard
                    title="Sick Leave"
                    value={
                      balances.sick
                    }
                    type="sick"
                  />

                  <LeaveBalanceCard
                    title="Earned Leave"
                    value={
                      balances.earned
                    }
                    type="earned"
                  />

                  <LeaveBalanceCard
                    title="Unpaid Leave"
                    value={
                      balances.unpaid
                    }
                    type="unpaid"
                  />
                </div>
              </section>


              <div className="employee-content-grid">

                <section>
                  <div className="section-heading">
                    <div>
                      <h2 className="section-title">
                        Apply for Leave
                      </h2>

                      <p className="section-description">
                        Submit a new leave
                        request for approval.
                      </p>
                    </div>
                  </div>

                  <LeaveForm
                    employeeId={
                      employeeId
                    }
                    onSuccess={
                      loadData
                    }
                  />
                </section>


                <section>
                  <div className="section-heading">
                    <div>
                      <h2 className="section-title">
                        Leave History
                      </h2>

                      <p className="section-description">
                        Track your previous and
                        current leave requests.
                      </p>
                    </div>
                  </div>

                  <LeaveTable
                    requests={
                      requests
                    }
                  />
                </section>

              </div>
            </>
          ) : null}

        </div>
      </main>
    </div>
  );
}


export default EmployeeDashboard;