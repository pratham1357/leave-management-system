import PendingTable from "../components/PendingTable";
import { pendingRequests } from "../data/mockData";

function ManagerDashboard() {
  return (
    <div>
      <h1>Manager Dashboard</h1>
      <PendingTable requests={pendingRequests} />
    </div>
  );
}

export default ManagerDashboard;