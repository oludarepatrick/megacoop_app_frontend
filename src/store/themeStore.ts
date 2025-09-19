import { create } from "zustand";
import { persist } from "zustand/middleware"

type Theme = "light" | "dark"

type ThemeStore = {
    theme: Theme;
    toggleTheme:() => void;
    setTheme:(theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>()(
    persist((set, get) => ({
        theme: "light",
        toggleTheme: () => {
            const currentTheme = get().theme;
            const newTheme = currentTheme === "light" ? "dark" : "light";
            set({theme: newTheme});

            if(newTheme === "dark"){
                document.documentElement.classList.add("dark");
            }else{
                document.documentElement.classList.remove("dark");
            }
        },

        setTheme: (theme: Theme) => {
            set({theme});

            if(theme === "dark"){
                document.documentElement.classList.add("dark");
            }else{
                document.documentElement.classList.remove("dark");
            }
        },
    }),
    {
        name: "theme-storage",
        onRehydrateStorage: () => (state) => {
            if(state?.theme === "dark"){
                document.documentElement.classList.add("dark");
            }else{
                document.documentElement.classList.remove("dark");
            }
        },
    }
    
)
)