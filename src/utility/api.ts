import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API || "http://localhost:4444/api/v1",
});

export default api;
