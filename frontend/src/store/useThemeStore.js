import { create } from "zustand";

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("omsync-theme") || "coffee",
    setTheme: (theme) => {
        localStorage.setItem("omsync-theme", theme);
        set({ theme });
    }
}));

