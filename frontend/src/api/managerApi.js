import client from "./client";

export const approveRequest = (
  employeeId,
  requestId,
  action
) => {
  return client.post("/manager/approve", {
    employeeId,
    requestId,
    action,
  });
};

export const getPendingRequests = async () => {
  const response = await client.get(
    "/manager/pending"
  );

  return response.data.requests;
};