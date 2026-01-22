export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "manager" | "staff";
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
