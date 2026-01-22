import api from "./axiosClient";

// Auth APIs
export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

// Example: Fetch all orders
export const fetchOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

// Example: Fetch all tables
export const fetchTables = async () => {
  const res = await api.get("/tables");
  return res.data;
};

// Add more API calls as needed
