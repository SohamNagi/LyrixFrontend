import { useContext } from "react";
import { UIThemeContext } from "@/contexts/ui-theme-context";

export function useUITheme() {
  const context = useContext(UIThemeContext);
  if (context === undefined) {
    throw new Error("useUITheme must be used within a UIThemeProvider");
  }
  return context;
}
