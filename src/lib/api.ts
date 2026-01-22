import api from "./axiosClient";

export const loginRequest = async (username: string, password: string) => {
  const res = await api.post("/users/login", {
    UserName: username,
    Password: password
  });
  return res.data;
};

export const signupRequest = async (payload: {
  UserName: string;
  Password: string;
  UserRole: string;
  RestaurantID: number;
}) => {
  const res = await api.post("/users/signup", payload);
  return res.data;
};

export const getTables = async () => {
  const resp = await api.get("/tables");
  return resp.data?.data || [];
};

export const addTable = async (payload: any) => {
  const out = await api.post("/tables", payload);
  return out.data?.data || out.data;
};

export const updateTable = async (id: number, body: any) => {
  const r = await api.patch(`/tables/${id}`, body);
  return r.data?.data || r.data;
};

export const removeTable = async (id: number) => {
  const del = await api.delete(`/tables/${id}`);
  return del.data;
};

export const getCategories = async () => {
  const x = await api.get("/menu-categories");
  return x.data?.data || [];
};

export const addCategory = async (body: any) => {
  const resp = await api.post("/menu-categories", body);
  return resp.data?.data || resp.data;
};

export const updateCategory = async (id: number, d: any) => {
  const out = await api.patch(`/menu-categories/${id}`, d);
  return out.data?.data || out.data;
};

export const deleteCategory = async (id: number) => {
  const gone = await api.delete(`/menu-categories/${id}`);
  return gone.data;
};

export const getMenuItems = async () => {
  const r = await api.get("/menu-items");
  return r.data?.data || [];
};

export const addMenuItem = async (body: any) => {
  const res = await api.post("/menu-items", body);
  return res.data?.data || res.data;
};

export const updateMenuItem = async (id: number, data: any) => {
  const out = await api.patch(`/menu-items/${id}`, data);
  return out.data?.data || out.data;
};

export const deleteMenuItem = async (id: number) => {
  const gone = await api.delete(`/menu-items/${id}`);
  return gone.data;
};

export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data?.data || [];
};

export const addUser = async (body: any) => {
  const x = await api.post("/users", body);
  return x.data?.data || x.data;
};

export const updateUser = async (id: number, body: any) => {
  const out = await api.patch(`/users/${id}`, body);
  return out.data?.data || out.data;
};

export const deleteUser = async (id: number) => {
  const gone = await api.delete(`/users/${id}`);
  return gone.data;
};

// Update user password (Manager only)
export const updateUserPassword = async (id: number, password: string) => {
  const res = await api.post(`/users/updatePassword/${id}`, { Password: password });
  return res.data;
};

// Get user by ID
export const getUserById = async (id: number) => {
  const res = await api.get(`/users/${id}`);
  return res.data?.data || res.data;
};

// Restaurants
export const getRestaurants = async () => {
  const res = await api.get("/restaurants");
  return res.data?.data || [];
};

export const getRestaurantById = async (id: number) => {
  const res = await api.get(`/restaurants/${id}`);
  return res.data?.data || res.data;
};

export const updateRestaurant = async (id: number, body: any) => {
  const res = await api.patch(`/restaurants/${id}`, body);
  return res.data?.data || res.data;
};

export const getOrders = async () => {
  const r = await api.get("/orders");
  return r.data?.data || [];
};

export const getOrderItems = async (orderId: number) => {
  const x = await api.get(`/order-items/order/${orderId}`);
  return x.data?.data || [];
};

export const createOrder = async (body: any) => {
  const res = await api.post("/orders", body);
  return res.data?.data || res.data;
};

export const updateOrder = async (id: number, data: any) => {
  const out = await api.patch(`/orders/${id}`, data);
  return out.data?.data || out.data;
};

export const deleteOrder = async (id: number) => {
  const gone = await api.delete(`/orders/${id}`);
  return gone.data;
};

export const addOrderItem = async (body: any) => {
  const res = await api.post("/order-items", body);
  return res.data?.data || res.data;
};

export const updateOrderItem = async (id: number, data: any) => {
  const out = await api.patch(`/order-items/${id}`, data);
  return out.data?.data || out.data;
};

export const deleteOrderItem = async (id: number) => {
  const gone = await api.delete(`/order-items/${id}`);
  return gone.data;
};

export const getMenuItemsByCategory = async (categoryId: number) => {
  const r = await api.get(`/menu-items/category/${categoryId}`);
  return r.data?.data || [];
};

// Get table by ID
export const getTableById = async (id: number) => {
  const res = await api.get(`/tables/${id}`);
  return res.data?.data || res.data;
};

// Get order by ID
export const getOrderById = async (id: number) => {
  const res = await api.get(`/orders/${id}`);
  return res.data?.data || res.data;
};

// Get orders by table
export const getOrdersByTable = async (tableId: number) => {
  const res = await api.get(`/orders/table/${tableId}`);
  return res.data?.data || [];
};

// Get all order items
export const getAllOrderItems = async () => {
  const res = await api.get("/order-items");
  return res.data?.data || [];
};

// Get order item by ID
export const getOrderItemById = async (id: number) => {
  const res = await api.get(`/order-items/${id}`);
  return res.data?.data || res.data;
};

// Get category by ID
export const getCategoryById = async (id: number) => {
  const res = await api.get(`/menu-categories/${id}`);
  return res.data?.data || res.data;
};

// Get menu item by ID
export const getMenuItemById = async (id: number) => {
  const res = await api.get(`/menu-items/${id}`);
  return res.data?.data || res.data;
};
