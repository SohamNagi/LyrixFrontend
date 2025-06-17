import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUITheme } from "@/hooks/use-ui-theme";

export default function ModeToggle() {
  const { theme, toggleTheme } = useUITheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="h-9 w-9 p-0"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  );
}
