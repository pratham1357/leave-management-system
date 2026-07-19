import {
  useState,
} from "react";

import {
  approveRequest,
} from "../api/managerApi";


function PendingTable({
  requests,
  setRequests,
}) {
  const [
    processingRequest,
    setProcessingRequest,
  ] = useState(null);

  const [
    message,
    setMessage,
  ] = useState({
    type: "",
    text: "",
  });


  const handleAction = async (
    employeeId,
    requestId,
    action
  ) => {
    try {
      setProcessingRequest(
        requestId
      );

      setMessage({
        type: "",
        text: "",
      });


      await approveRequest(
        employeeId,
        requestId,
        action
      );


      setRequests(
        (previousRequests) =>
          previousRequests.filter(
            (request) =>
              request.requestId !==
              requestId
          )
      );


      const actionText =
        action === "APPROVE"
          ? "approved"
          : "rejected";


      setMessage({
        type: "success",
        text:
          `Leave request ${requestId} was ${actionText} successfully.`,
      });

    } catch (err) {
      console.error(
        "Failed to process leave request:",
        err
      );

      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Unable to process the leave request.",
      });

    } finally {
      setProcessingRequest(
        null
      );
    }
  };


  return (
    <div>

      {message.text && (
        <div
          className={
            message.type === "success"
              ? "alert alert-success"
              : "alert alert-error"
          }
        >
          {message.text}
        </div>
      )}


      <div className="table-container">

        <table className="approvals-table">

          <thead>
            <tr>
              <th>
                Request ID
              </th>

              <th>
                Employee
              </th>

              <th>
                Leave Type
              </th>

              <th>
                Leave Period
              </th>

              <th>
                Status
              </th>

              <th>
                Actions
              </th>
            </tr>
          </thead>


          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="table-empty-state"
                >
                  <div className="approval-empty-icon">
                    ✓
                  </div>

                  <div className="empty-state-title">
                    You're all caught up
                  </div>

                  <div className="empty-state-description">
                    There are no pending
                    leave requests requiring
                    your attention.
                  </div>
                </td>
              </tr>
            ) : (
              requests.map(
                (request) => {
                  const isProcessing =
                    processingRequest ===
                    request.requestId;


                  return (
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
                        <div className="employee-cell">
                          <div className="employee-avatar">
                            {getEmployeeInitials(
                              request.employeeId
                            )}
                          </div>

                          <span>
                            {
                              request.employeeId
                            }
                          </span>
                        </div>
                      </td>


                      <td>
                        <span className="leave-type-text">
                          {
                            formatLeaveType(
                              request.leaveType
                            )
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
                        <span className="badge badge-pending">
                          {request.status ||
                            "PENDING"}
                        </span>
                      </td>


                      <td>
                        <div className="approval-actions">

                          <button
                            type="button"
                            className="btn btn-success approval-button"
                            disabled={
                              isProcessing
                            }
                            onClick={() =>
                              handleAction(
                                request.employeeId,
                                request.requestId,
                                "APPROVE"
                              )
                            }
                          >
                            {isProcessing
                              ? "Processing..."
                              : "Approve"}
                          </button>


                          <button
                            type="button"
                            className="btn btn-secondary approval-button"
                            disabled={
                              isProcessing
                            }
                            onClick={() =>
                              handleAction(
                                request.employeeId,
                                request.requestId,
                                "REJECT"
                              )
                            }
                          >
                            Reject
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                }
              )
            )}
          </tbody>

        </table>

      </div>
    </div>
  );
}


function formatLeaveType(
  leaveType
) {
  if (!leaveType) {
    return "—";
  }

  return leaveType
    .toLowerCase()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase()
    );
}


function getEmployeeInitials(
  employeeId
) {
  if (!employeeId) {
    return "E";
  }

  return employeeId
    .replace(
      /[^a-zA-Z0-9]/g,
      ""
    )
    .slice(-2)
    .toUpperCase();
}


export default PendingTable;