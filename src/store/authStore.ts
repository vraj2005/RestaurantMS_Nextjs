import { create } from "zustand";

type AuthState = {
  token: string | null;
  role: string | null;
  setToken: (t: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  role: null,

  setToken: (t) => {
    localStorage.setItem("token", t);
    set({ token: t });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, role: null });
  },
}));
