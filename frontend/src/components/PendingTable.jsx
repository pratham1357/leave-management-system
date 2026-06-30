function PendingTable({ requests }) {
  return (
    <table border="1">
      <thead>
        <tr>
          <th>Request ID</th>
          <th>Employee</th>
          <th>Type</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {requests.map((r) => (
          <tr key={r.requestId}>
            <td>{r.requestId}</td>
            <td>{r.employeeId}</td>
            <td>{r.leaveType}</td>
            <td>
              <button>Approve</button>
              <button>Reject</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PendingTable;