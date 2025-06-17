import { useState, useEffect, useCallback } from "react";
import { apiService as libApiService, LanguageCode } from "@/lib/api";
import { Song } from "@/types";

interface UseThemeManagerProps {
  song: Song | null;
  language: LanguageCode;
  songId?: string;
}

interface UseThemeManagerReturn {
  currentTheme: string | null;
  isLoading: boolean;
  error: string | null;
  hasStaticTheme: boolean;
  hasDynamicTheme: boolean;
  fetchDynamicTheme: () => Promise<void>;
  clearError: () => void;
  refresh: () => Promise<void>;
}

export function useThemeManager({
  song,
  language,
  songId,
}: UseThemeManagerProps): UseThemeManagerReturn {
  const [dynamicTheme, setDynamicTheme] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get static theme from song data
  const getStaticTheme = useCallback(() => {
    if (!song) return null;

    switch (language) {
      case "en":
        return song.english_theme || null;
      case "hin":
        return song.hindi_theme || null;
      case "urd":
        return song.urdu_theme || null;
      default:
        return null;
    }
  }, [song, language]);

  // Get current theme (static or dynamic)
  const getCurrentTheme = useCallback(() => {
    return getStaticTheme() || dynamicTheme;
  }, [getStaticTheme, dynamicTheme]);

  // Check if static theme exists
  const hasStaticTheme = Boolean(getStaticTheme());

  // Check if dynamic theme exists
  const hasDynamicTheme = Boolean(dynamicTheme);

  // Clear dynamic theme when language changes
  useEffect(() => {
    setDynamicTheme(null);
    setError(null);
  }, [language, song]);

  // Fetch dynamic theme
  const fetchDynamicTheme = useCallback(async () => {
    if (!songId || !language) {
      setError("Missing song ID or language");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Map language codes to API format - backend expects 'hin' and 'urd'
      const apiLanguage = language; // No mapping needed, use as-is

      const theme = await libApiService.fetchSongThemeWithCache(
        songId,
        apiLanguage
      );

      if (theme && theme.trim()) {
        setDynamicTheme(theme);
      } else {
        setError("No theme generated");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch theme";
      setError(errorMessage);
      console.error("Failed to fetch dynamic theme:", err);
    } finally {
      setIsLoading(false);
    }
  }, [songId, language]);

  // Auto-fetch theme if no static theme exists and we have required data
  useEffect(() => {
    if (
      song &&
      songId &&
      language &&
      !hasStaticTheme &&
      !hasDynamicTheme &&
      !isLoading &&
      !error
    ) {
      // Auto-fetch disabled by default - user needs to click button
      // Uncomment next line to enable auto-fetch:
      // fetchDynamicTheme();
    }
  }, [
    song,
    songId,
    language,
    hasStaticTheme,
    hasDynamicTheme,
    isLoading,
    error,
    fetchDynamicTheme,
  ]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Refresh theme (clear cache and fetch again)
  const refresh = useCallback(async () => {
    setDynamicTheme(null);
    await fetchDynamicTheme();
  }, [fetchDynamicTheme]);

  return {
    currentTheme: getCurrentTheme(),
    isLoading,
    error,
    hasStaticTheme,
    hasDynamicTheme,
    fetchDynamicTheme,
    clearError,
    refresh,
  };
}
