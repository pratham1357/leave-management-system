import client from "./client";

export const submitLeave = async (payload) => {
  const response = await client.post(
    "/leave/request",
    payload
  );

  return response.data;
};

export const getLeaveHistory = async (employeeId) => {
  const response = await client.get(
    `/leave/employee/${employeeId}`
  );

  return response.data;
};