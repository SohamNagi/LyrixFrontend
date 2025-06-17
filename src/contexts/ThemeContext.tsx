import { createContext, useState, useEffect, ReactNode } from "react";
import { apiService } from "@/lib/api";

interface ThemeCache {
  [key: string]: {
    theme: string;
    timestamp: number;
    expires: number;
  };
}

interface ThemeContextType {
  cache: ThemeCache;
  getCachedTheme: (songId: string, language: string) => string | null;
  setCachedTheme: (
    songId: string,
    language: string,
    theme: string,
    ttlMinutes?: number
  ) => void;
  clearCache: () => void;
  preloadSongThemes: (songId: string) => Promise<void>;
  isThemeLoading: (songId: string, language: string) => boolean;
  setThemeLoading: (songId: string, language: string, loading: boolean) => void;
  loadingStates: { [key: string]: boolean };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export { ThemeContext };

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [cache, setCache] = useState<ThemeCache>({});
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});

  // Load cache from sessionStorage on mount
  useEffect(() => {
    try {
      const savedCache = sessionStorage.getItem("lyrix-theme-cache");
      if (savedCache) {
        const parsedCache = JSON.parse(savedCache);
        // Filter out expired entries
        const now = Date.now();
        const validCache: ThemeCache = {};

        Object.entries(parsedCache).forEach(([key, value]) => {
          const cacheEntry = value as ThemeCache[string];
          if (cacheEntry.expires > now) {
            validCache[key] = cacheEntry;
          }
        });

        setCache(validCache);
      }
    } catch (error) {
      console.error("Failed to load theme cache:", error);
    }
  }, []);

  // Save cache to sessionStorage when it changes
  useEffect(() => {
    try {
      sessionStorage.setItem("lyrix-theme-cache", JSON.stringify(cache));
    } catch (error) {
      console.error("Failed to save theme cache:", error);
    }
  }, [cache]);

  // Clean up expired cache entries periodically
  useEffect(() => {
    const cleanup = () => {
      const now = Date.now();
      setCache((prevCache) => {
        const newCache: ThemeCache = {};
        Object.entries(prevCache).forEach(([key, value]) => {
          if (value.expires > now) {
            newCache[key] = value;
          }
        });
        return newCache;
      });
    };

    const interval = setInterval(cleanup, 5 * 60 * 1000); // Cleanup every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const getCacheKey = (songId: string, language: string) =>
    `${songId}_${language}`;

  const getCachedTheme = (songId: string, language: string): string | null => {
    const key = getCacheKey(songId, language);
    const entry = cache[key];

    if (!entry) return null;

    const now = Date.now();
    if (entry.expires <= now) {
      // Remove expired entry
      setCache((prev) => {
        const newCache = { ...prev };
        delete newCache[key];
        return newCache;
      });
      return null;
    }

    return entry.theme;
  };

  const setCachedTheme = (
    songId: string,
    language: string,
    theme: string,
    ttlMinutes: number = 30
  ) => {
    const key = getCacheKey(songId, language);
    const now = Date.now();
    const expires = now + ttlMinutes * 60 * 1000;

    setCache((prev) => ({
      ...prev,
      [key]: {
        theme,
        timestamp: now,
        expires,
      },
    }));
  };

  const clearCache = () => {
    setCache({});
    setLoadingStates({});
    sessionStorage.removeItem("lyrix-theme-cache");
  };

  const preloadSongThemes = async (songId: string) => {
    const languages = ["en", "hin", "urd"];

    // Check which themes we don't have cached
    const themesToLoad = languages.filter(
      (lang) => !getCachedTheme(songId, lang)
    );

    if (themesToLoad.length === 0) return;

    // Load themes in parallel
    const loadPromises = themesToLoad.map(async (language) => {
      const loadingKey = getCacheKey(songId, language);
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: true }));

      try {
        // No mapping needed, frontend and backend use same codes
        const theme = await apiService.fetchSongTheme(
          songId,
          language as "en" | "hin" | "urd"
        );
        if (theme && theme.trim()) {
          setCachedTheme(songId, language, theme);
        }
      } catch (error) {
        console.warn(
          `Failed to preload theme for ${songId} in ${language}:`,
          error
        );
      } finally {
        setLoadingStates((prev) => ({ ...prev, [loadingKey]: false }));
      }
    });

    await Promise.allSettled(loadPromises);
  };

  const isThemeLoading = (songId: string, language: string): boolean => {
    const key = getCacheKey(songId, language);
    return Boolean(loadingStates[key]);
  };

  const setThemeLoading = (
    songId: string,
    language: string,
    loading: boolean
  ) => {
    const key = getCacheKey(songId, language);
    setLoadingStates((prev) => ({ ...prev, [key]: loading }));
  };

  const value: ThemeContextType = {
    cache,
    getCachedTheme,
    setCachedTheme,
    clearCache,
    preloadSongThemes,
    isThemeLoading,
    setThemeLoading,
    loadingStates,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
