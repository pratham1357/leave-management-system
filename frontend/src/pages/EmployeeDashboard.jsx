import { useEffect, useState } from "react";
import LeaveBalanceCard from "../components/LeaveBalanceCard";
import LeaveForm from "../components/LeaveForm";
import LeaveTable from "../components/LeaveTable";
import NavBar from "../components/Navbar";
import {
  getLeaveBalance,
  getLeaveHistory,
} from "../api/leaveApi";

function EmployeeDashboard() {
  const [balances, setBalances] = useState({
    casual: 0,
    sick: 0,
    earned: 0,
    unpaid: 0
  });

  const [requests, setRequests] = useState([]);

  const [employeeId, setEmployeeId] =
    useState("EMP001");

  const employees = [
    "EMP001",
    "EMP002",
    "EMP003"
  ];

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
        unpaid: 0
      };

      balanceData.forEach((b) => {
        if (b.balance_key === "CASUAL")
          mappedBalances.casual =
            b.remaining_days;

        if (b.balance_key === "SICK")
          mappedBalances.sick =
            b.remaining_days;

        if (b.balance_key === "EARNED")
          mappedBalances.earned =
            b.remaining_days;

        if (b.balance_key === "UNPAID")
          mappedBalances.unpaid =
            b.remaining_days;
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
      setBalances({
        casual: 0,
        sick: 0,
        earned: 0,
        unpaid: 0
      });
      setRequests([]);
    }
  };

  useEffect(() => {
    loadData();
  }, [employeeId]);

  return (
    <div>
      <NavBar />

      <h1>Employee Dashboard</h1>

      <div
        style={{
          marginBottom: "20px"
        }}
      >
        <label
          style={{
            marginRight: "10px",
            fontWeight: "bold"
          }}
        >
          Employee:
        </label>

        <select
          value={employeeId}
          onChange={(e) =>
            setEmployeeId(e.target.value)
          }
          style={{
            padding: "8px",
            minWidth: "150px"
          }}
        >
          {employees.map((emp) => (
            <option
              key={emp}
              value={emp}
            >
              {emp}
            </option>
          ))}
        </select>
      </div>

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

        <LeaveBalanceCard
          title="Unpaid"
          value={balances.unpaid}
        />
      </div>

      <LeaveForm
        employeeId={employeeId}
        onSuccess={loadData}
      />

      <br />

      <LeaveTable
        requests={requests}
      />
    </div>
  );
}

export default EmployeeDashboard;