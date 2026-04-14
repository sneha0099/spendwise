import { create } from "zustand";

const storedTheme = localStorage.getItem("spendwise-theme") || "system";

const resolveTheme = (theme) => {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
};

export const initializeTheme = () => {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", resolveTheme(storedTheme) === "dark");
};

export const useUiStore = create((set) => ({
  sidebarOpen: false,
  theme: storedTheme,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
  setTheme: (theme) => {
    localStorage.setItem("spendwise-theme", theme);
    document.documentElement.classList.toggle("dark", resolveTheme(theme) === "dark");
    set({ theme });
  }
}));
