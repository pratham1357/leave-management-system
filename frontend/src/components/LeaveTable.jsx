function LeaveTable({ requests }) {
  return (
    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>Type</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {requests.map((request) => (
          <tr key={request.requestId}>
            <td>{request.requestId}</td>
            <td>{request.leaveType}</td>
            <td>{request.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default LeaveTable;