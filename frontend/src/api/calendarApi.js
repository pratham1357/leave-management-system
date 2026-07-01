import client from "./client";

export const getCalendarData = async () => {
  const response = await client.get("/calendar");
  return response.data;
};