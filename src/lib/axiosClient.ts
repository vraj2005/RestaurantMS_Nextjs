import axios from "axios";

const api = axios.create({
  baseURL: "https://resback.sampaarsh.cloud",
  headers: { "Content-Type": "application/json" },
  timeout: 15000
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Log errors but don't auto-redirect - let components handle it
    if (err.code === 'ECONNABORTED') {
      console.error('Request timeout');
    }
    if (!err.response) {
      console.error('Network error');
    }
    return Promise.reject(err);
  }
);

export default api;

