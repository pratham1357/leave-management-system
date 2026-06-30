import client from "./client";

export const submitLeave = async (payload) => {
  const response = await client.post(
    "/leave/request",
    payload
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