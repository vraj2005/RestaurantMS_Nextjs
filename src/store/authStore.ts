import { create } from "zustand";

type AuthState = {
  token: string | null;
  role: string | null;
  hydrated: boolean;
  setAuth: (token: string, role: string) => void;
  setToken: (t: string) => void;
  logout: () => void;
  hydrate: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  hydrated: false,

  hydrate: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      const role = localStorage.getItem("authRole");
      set({ token, role, hydrated: true });
    }
  },

  setAuth: (token: string, role: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", token);
      localStorage.setItem("authRole", role);
      document.cookie = `authToken=${token};path=/;max-age=86400`;
      document.cookie = `authRole=${role};path=/;max-age=86400`;
    }
    set({ token, role });
  },

  setToken: (t) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", t);
      document.cookie = `authToken=${t};path=/;max-age=86400`;
    }
    set({ token: t });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authRole");
      document.cookie = "authToken=;path=/;max-age=0";
      document.cookie = "authRole=;path=/;max-age=0";
    }
    set({ token: null, role: null });
  },
}));
