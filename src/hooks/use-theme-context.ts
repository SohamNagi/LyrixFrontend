import { useContext, useState } from "react";
import { ThemeContext } from "@/contexts/ThemeContext";
import { apiService, LanguageCode } from "@/lib/api";

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}

// Hook for enhanced theme management with context
export function useEnhancedTheme(songId: string, language: LanguageCode) {
  const context = useThemeContext();
  const [error, setError] = useState<string | null>(null);

  const fetchTheme = async (): Promise<string | null> => {
    if (!songId || !language) return null;

    // Check cache first
    const cached = context.getCachedTheme(songId, language);
    if (cached) return cached;

    // Check if already loading
    if (context.isThemeLoading(songId, language)) {
      return null; // Will be available soon
    }

    try {
      context.setThemeLoading(songId, language, true);
      setError(null);

      // No mapping needed, frontend and backend use same codes
      const theme = await apiService.fetchSongTheme(songId, language);

      if (theme && theme.trim()) {
        context.setCachedTheme(songId, language, theme);
        return theme;
      }

      return null;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch theme";
      setError(errorMessage);
      console.error("Failed to fetch theme:", err);
      return null;
    } finally {
      context.setThemeLoading(songId, language, false);
    }
  };

  const isLoading = context.isThemeLoading(songId, language);
  const cachedTheme = context.getCachedTheme(songId, language);

  return {
    theme: cachedTheme,
    isLoading,
    error,
    fetchTheme,
    clearError: () => setError(null),
  };
}
