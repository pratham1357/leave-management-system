import { approveRequest } from "../api/managerApi";

function PendingTable({ requests }) {
  const handleAction = async (
    employeeId,
    requestId,
    action
  ) => {
    try {
      await approveRequest(
        employeeId,
        requestId,
        action
      );

      alert(
        `Request ${action.toLowerCase()}d successfully!`
      );

      // Temporary solution for now
      window.location.reload();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Something went wrong."
      );
    }
  };

  return (
    <table border="1" width="100%">
      <thead>
        <tr>
          <th>Request ID</th>
          <th>Employee</th>
          <th>Type</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {requests.length === 0 ? (
          <tr>
            <td colSpan="4">
              No pending requests.
            </td>
          </tr>
        ) : (
          requests.map((r) => (
            <tr key={r.requestId}>
              <td>{r.requestId}</td>
              <td>{r.employeeId}</td>
              <td>{r.leaveType}</td>
              <td>
                <button
                  onClick={() =>
                    handleAction(
                      r.employeeId,
                      r.requestId,
                      "APPROVE"
                    )
                  }
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    handleAction(
                      r.employeeId,
                      r.requestId,
                      "REJECT"
                    )
                  }
                >
                  Reject
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default PendingTable;