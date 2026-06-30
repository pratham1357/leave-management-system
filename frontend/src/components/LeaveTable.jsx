function LeaveTable({ requests }) {
  return (
    <table width="100%" border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>Type</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {requests.length === 0 ? (
          <tr>
            <td colSpan="3">
              No leave requests found.
            </td>
          </tr>
        ) : (
          requests.map((request) => (
            <tr key={request.requestId}>
              <td>{request.requestId}</td>
              <td>{request.leaveType}</td>
              <td>{request.status}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default LeaveTable;