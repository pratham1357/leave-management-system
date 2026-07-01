import client from "./client";

export const submitLeave = async (payload) => {
  const body = {
    employee_id: payload.employeeId,
    leave_type: payload.leaveType,
    start_date: payload.startDate,
    end_date: payload.endDate,
    reason: payload.reason,
  };

  const response = await client.post(
    "/leave/request",
    body
  );

  return response.data;
};

export const getLeaveHistory = async (
  employeeId
) => {
  const response = await client.get(
    `/leave/requests/${employeeId}`
  );

  return response.data.requests;
};

export const getLeaveBalance = async (
  employeeId
) => {
  const response = await client.get(
    `/leave/balance/${employeeId}`
  );

  return response.data.balances;
};