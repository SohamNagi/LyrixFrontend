import { useState, useEffect, ReactNode } from "react";
import { UIThemeContext } from "./ui-theme-context";

type Theme = "light" | "dark";

interface UIThemeProviderProps {
  children: ReactNode;
}

export function UIThemeProvider({ children }: UIThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (
        (localStorage.getItem("theme") as Theme) ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light")
      );
    }
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(theme === "light" ? "dark" : "light");
  };

  return (
    <UIThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </UIThemeContext.Provider>
  );
}
