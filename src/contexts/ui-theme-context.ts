import { createContext } from "react";

type Theme = "light" | "dark";

export interface UIThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const UIThemeContext = createContext<UIThemeContextType | undefined>(
  undefined
);
