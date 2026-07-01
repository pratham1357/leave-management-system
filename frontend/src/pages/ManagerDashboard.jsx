import { useEffect, useState } from "react";
import PendingTable from "../components/PendingTable";
import { getPendingRequests } from "../api/managerApi";
import Navbar from "../components/Navbar";

function ManagerDashboard() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await getPendingRequests();

        const formattedRequests = data.map((r) => ({
          employeeId: r.employee_id,
          requestId: r.request_id,
          leaveType: r.leave_type,
          status: r.status,
          startDate: r.start_date,
          endDate: r.end_date,
        }));

        setRequests(formattedRequests);
      } catch (err) {
        console.error("Failed to load requests:", err);
      }
    };

    loadRequests();
  }, []);

  return (
    <div>
      <Navbar />
      <h1>Manager Dashboard</h1>
      <PendingTable
        requests={requests}
        setRequests={setRequests}
      />
    </div>
  );
}

export default ManagerDashboard;