import axios from "axios";

const api = axios.create({
  baseURL: "https://resback.sampaarsh.cloud",
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export default api;
