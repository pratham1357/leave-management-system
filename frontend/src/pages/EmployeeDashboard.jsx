import { useEffect, useState } from "react";
import LeaveBalanceCard from "../components/LeaveBalanceCard";
import LeaveForm from "../components/LeaveForm";
import LeaveTable from "../components/LeaveTable";
import {
  getLeaveBalance,
  getLeaveHistory,
} from "../api/leaveApi";

function EmployeeDashboard() {
  const [balances, setBalances] = useState({
    casual: 0,
    sick: 0,
    earned: 0,
  });

  const [requests, setRequests] = useState([]);

  const employeeId = "EMP001";

  useEffect(() => {
    const loadData = async () => {
      try {
        const balanceData =
          await getLeaveBalance(employeeId);

        const historyData =
          await getLeaveHistory(employeeId);

        const mappedBalances = {
          casual: 0,
          sick: 0,
          earned: 0,
        };

        balanceData.forEach((b) => {
          if (b.balance_key === "CASUAL") {
            mappedBalances.casual =
              b.remaining_days;
          }

          if (b.balance_key === "SICK") {
            mappedBalances.sick =
              b.remaining_days;
          }

          if (b.balance_key === "EARNED") {
            mappedBalances.earned =
              b.remaining_days;
          }
        });

        setBalances(mappedBalances);

        const formattedRequests =
          historyData.map((r) => ({
            requestId: r.request_id,
            leaveType: r.leave_type,
            status: r.status,
            startDate: r.start_date,
            endDate: r.end_date,
            reason: r.reason,
          }));

        setRequests(formattedRequests);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, []);

  return (
    <div>
      <h1>Employee Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <LeaveBalanceCard
          title="Casual"
          value={balances.casual}
        />

        <LeaveBalanceCard
          title="Sick"
          value={balances.sick}
        />

        <LeaveBalanceCard
          title="Earned"
          value={balances.earned}
        />
      </div>

      <LeaveForm />

      <br />

      <LeaveTable requests={requests} />
    </div>
  );
}

export default EmployeeDashboard;