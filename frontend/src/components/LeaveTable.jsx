function LeaveTable({
  requests,
}) {
  const getStatusClass = (
    status
  ) => {
    const normalizedStatus =
      status?.toLowerCase();

    if (
      normalizedStatus ===
      "approved"
    ) {
      return "badge badge-approved";
    }

    if (
      normalizedStatus ===
      "rejected"
    ) {
      return "badge badge-rejected";
    }

    return "badge badge-pending";
  };


  return (
    <div className="table-container">
      <table className="leave-history-table">

        <thead>
          <tr>
            <th>
              Request ID
            </th>

            <th>
              Leave Type
            </th>

            <th>
              Dates
            </th>

            <th>
              Reason
            </th>

            <th>
              Status
            </th>
          </tr>
        </thead>


        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                className="table-empty-state"
              >
                <div className="empty-state-title">
                  No leave requests yet
                </div>

                <div className="empty-state-description">
                  Your submitted leave
                  requests will appear here.
                </div>
              </td>
            </tr>
          ) : (
            requests.map(
              (request) => (
                <tr
                  key={
                    request.requestId
                  }
                >
                  <td>
                    <span className="request-id">
                      {
                        request.requestId
                      }
                    </span>
                  </td>

                  <td>
                    <span className="leave-type-text">
                      {
                        request.leaveType
                      }
                    </span>
                  </td>

                  <td>
                    <div className="leave-date-range">
                      <span>
                        {
                          request.startDate
                        }
                      </span>

                      <span className="date-separator">
                        →
                      </span>

                      <span>
                        {
                          request.endDate
                        }
                      </span>
                    </div>
                  </td>

                  <td>
                    <div className="leave-reason">
                      {request.reason ||
                        "—"}
                    </div>
                  </td>

                  <td>
                    <span
                      className={
                        getStatusClass(
                          request.status
                        )
                      }
                    >
                      {
                        request.status
                      }
                    </span>
                  </td>
                </tr>
              )
            )
          )}
        </tbody>

      </table>
    </div>
  );
}


export default LeaveTable;