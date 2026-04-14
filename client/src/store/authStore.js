import { create } from "zustand";
import toast from "react-hot-toast";
import { getProfile, loginUser } from "@/api/authApi";

const readToken = () => localStorage.getItem("spendwise-token") || sessionStorage.getItem("spendwise-token");

export const useAuthStore = create((set, get) => ({
  user: null,
  token: readToken(),
  loading: false,
  rememberMe: Boolean(localStorage.getItem("spendwise-token")),
  setSession: ({ token, user, rememberMe }) => {
    localStorage.removeItem("spendwise-token");
    sessionStorage.removeItem("spendwise-token");
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("spendwise-token", token);
    set({ token, user, rememberMe });
  },
  login: async (payload) => {
    set({ loading: true });
    try {
      const response = await loginUser(payload);
      get().setSession({
        token: response.data.data.token,
        user: response.data.data.user,
        rememberMe: payload.rememberMe
      });
      toast.success("Welcome back!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    } finally {
      set({ loading: false });
    }
  },
  loadUser: async () => {
    const token = readToken();
    if (!token) return;

    try {
      const response = await getProfile();
      set({ user: response.data.data, token });
    } catch (error) {
      localStorage.removeItem("spendwise-token");
      sessionStorage.removeItem("spendwise-token");
      set({ user: null, token: null });
    }
  },
  logout: () => {
    localStorage.removeItem("spendwise-token");
    sessionStorage.removeItem("spendwise-token");
    set({ user: null, token: null });
    toast.success("Logged out");
  },
  setUser: (user) => set({ user })
}));
