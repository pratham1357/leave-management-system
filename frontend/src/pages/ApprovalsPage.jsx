import {
  useEffect,
  useState,
} from "react";

import PendingTable from "../components/PendingTable";
import Navbar from "../components/Navbar";

import {
  getPendingRequests,
} from "../api/managerApi";


function ApprovalsPage() {
  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getPendingRequests();

        const formattedRequests =
          data.map((request) => ({
            employeeId:
              request.employee_id,

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
          }));

        setRequests(
          formattedRequests
        );

      } catch (err) {
        console.error(
          "Failed to load requests:",
          err
        );

        setError(
          "Unable to load pending leave requests."
        );

      } finally {
        setLoading(false);
      }
    };


    loadRequests();
  }, []);


  return (
    <div>
      <Navbar />

      <main className="page">
        <div className="page-container">

          <header className="approvals-header">
            <div>
              <h1 className="page-title">
                Pending Approvals
              </h1>

              <p className="page-description">
                Review and process employee
                leave requests awaiting a
                decision.
              </p>
            </div>

            {!loading && (
              <div className="pending-count">
                <span className="pending-count-value">
                  {requests.length}
                </span>

                <span className="pending-count-label">
                  Pending
                </span>
              </div>
            )}
          </header>


          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}


          {loading ? (
            <div className="dashboard-loading">
              Loading pending requests...
            </div>
          ) : (
            <PendingTable
              requests={requests}
              setRequests={
                setRequests
              }
            />
          )}

        </div>
      </main>
    </div>
  );
}


export default ApprovalsPage;