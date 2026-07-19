import axios from "axios";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error(
    "Missing VITE_API_BASE_URL environment variable."
  );
}

const client = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;