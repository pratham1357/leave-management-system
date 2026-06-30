import LeaveBalanceCard from "../components/LeaveBalanceCard";
import LeaveForm from "../components/LeaveForm";
import LeaveTable from "../components/LeaveTable";
import {
  leaveBalances,
  leaveRequests,
} from "../data/mockData";

function EmployeeDashboard() {
  return (
    <div>
      <h1>Employee Dashboard</h1>

      <div style={{
        display: "flex",
        gap: "20px",
        marginBottom: "30px"
      }}>
        <LeaveBalanceCard
          title="Casual"
          value={leaveBalances.casual}
        />

        <LeaveBalanceCard
          title="Sick"
          value={leaveBalances.sick}
        />

        <LeaveBalanceCard
          title="Earned"
          value={leaveBalances.earned}
        />
      </div>

      <LeaveForm />

      <br />

      <LeaveTable requests={leaveRequests} />
    </div>
  );
}

export default EmployeeDashboard;