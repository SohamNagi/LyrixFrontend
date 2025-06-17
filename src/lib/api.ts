import { API_ENDPOINTS } from "@/config/api";

export interface Author {
  id: number;
  name: string;
}

export interface Song {
  id: number;
  title: string;
  author: Author;
  hindi_lyrics: string;
  urdu_lyrics: string;
  english_lyrics: string;
  hindi_theme: string | null;
  urdu_theme: string | null;
  english_theme: string | null;
}

export interface Analysis {
  translation: string;
  interpretation: string;
  connectionsToContext: string;
}

export interface Pagination {
  page: number;
  per_page: number;
  total: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface AuthorSongsResponse {
  author: Author;
  songs: Song[];
  pagination: Pagination;
}

export interface SearchResponse {
  query: string;
  songs: Song[];
  authors: Author[];
}

export interface SearchSongsResponse {
  query: string;
  songs: Song[];
  pagination: Pagination;
}

export interface DatabaseStats {
  total_authors: number;
  total_songs: number;
  total_analyses: number;
  authors_with_songs: number;
}

export interface HealthResponse {
  status: string;
}

// Error handling
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// API request wrapper with better error handling
async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // If response is not JSON, use the status text
      }

      throw new ApiError(errorMessage, response.status, url);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    } else {
      return response.text() as unknown as T;
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      `Network error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      undefined,
      url
    );
  }
}

export type LanguageCode = "en" | "hin" | "urd";

// API service functions
export const apiService = {
  // Songs API
  async fetchSongs(): Promise<Song[]> {
    return apiRequest<Song[]>(API_ENDPOINTS.songs);
  },

  async fetchSong(songId: string | number): Promise<Song> {
    return apiRequest<Song>(`${API_ENDPOINTS.songs}/${songId}`);
  },

  async fetchSongTheme(
    songId: string | number,
    language: LanguageCode
  ): Promise<string> {
    const url = API_ENDPOINTS.theme(songId.toString(), language);
    return apiRequest<string>(url);
  },

  // Enhanced theme fetching with cache and fallback
  async fetchSongThemeWithCache(
    songId: string | number,
    language: LanguageCode
  ): Promise<string> {
    const cacheKey = `theme_${songId}_${language}`;

    // Check cache first
    const cached = cacheUtils.get<string>(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch from API
    const theme = await this.fetchSongTheme(songId, language);

    // Cache for 10 minutes
    cacheUtils.set(cacheKey, theme, 10);

    return theme;
  },

  // Get available themes for a song
  async getAvailableThemes(songId: string | number): Promise<{
    en?: string;
    hin?: string;
    urd?: string;
  }> {
    const themes: { en?: string; hin?: string; urd?: string } = {};

    // Try to fetch themes for all languages
    for (const lang of ["en", "hin", "urd"] as LanguageCode[]) {
      try {
        const theme = await this.fetchSongTheme(songId, lang);
        if (theme && theme.trim()) {
          themes[lang] = theme;
        }
      } catch {
        // Theme not available for this language
      }
    }

    return themes;
  },

  async fetchLineTranscription(
    songId: string | number,
    lineNum: number,
    language: LanguageCode
  ): Promise<string> {
    const url = API_ENDPOINTS.transcription(
      songId.toString(),
      lineNum,
      language
    );
    return apiRequest<string>(url);
  },

  // Authors API
  async fetchAuthors(): Promise<Author[]> {
    return apiRequest<Author[]>(API_ENDPOINTS.authors);
  },

  async fetchAuthor(authorId: string | number): Promise<Author> {
    return apiRequest<Author>(`${API_ENDPOINTS.authors}/${authorId}`);
  },

  async fetchAuthorSongs(
    authorId: string | number,
    page: number = 1,
    perPage: number = 20
  ): Promise<AuthorSongsResponse> {
    const url = `${API_ENDPOINTS.authors}/${authorId}/songs?page=${page}&per_page=${perPage}`;
    return apiRequest<AuthorSongsResponse>(url);
  },

  // Search API
  async generalSearch(query: string): Promise<SearchResponse> {
    const url = `${API_ENDPOINTS.search}?q=${encodeURIComponent(query)}`;
    return apiRequest<SearchResponse>(url);
  },

  async searchSongs(
    query: string,
    authorId?: string | number,
    page: number = 1,
    perPage: number = 20
  ): Promise<SearchSongsResponse> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      per_page: perPage.toString(),
    });

    if (authorId) {
      params.append("author_id", authorId.toString());
    }

    const url = `${API_ENDPOINTS.searchSongs}?${params.toString()}`;
    return apiRequest<SearchSongsResponse>(url);
  },

  // Statistics API
  async fetchDatabaseStats(): Promise<DatabaseStats> {
    return apiRequest<DatabaseStats>(API_ENDPOINTS.stats);
  },

  // Health Check API
  async healthCheck(): Promise<HealthResponse> {
    return apiRequest<HealthResponse>(API_ENDPOINTS.health);
  },

  // Legacy methods for backward compatibility
  async fetchTranscription(
    songId: string,
    lineNum: number,
    language: string
  ): Promise<string> {
    return this.fetchLineTranscription(
      songId,
      lineNum,
      language as LanguageCode
    );
  },

  async fetchTheme(songId: string, language: string): Promise<string> {
    return this.fetchSongTheme(songId, language as LanguageCode);
  },
};

// Helper functions
export const getLyricsByLanguage = (song: Song, language: string): string => {
  switch (language) {
    case "en":
      return song.english_lyrics || "";
    case "hi":
    case "hin":
      return song.hindi_lyrics || "";
    case "ur":
    case "urd":
      return song.urdu_lyrics || "";
    default:
      return song.english_lyrics || "";
  }
};

export const getThemeByLanguage = (
  song: Song,
  language: string
): string | null => {
  switch (language) {
    case "en":
      return song.english_theme;
    case "hi":
    case "hin":
      return song.hindi_theme;
    case "ur":
    case "urd":
      return song.urdu_theme;
    default:
      return song.english_theme;
  }
};

// Utility functions for working with paginated data
export const paginationUtils = {
  /**
   * Calculate the total number of pages based on total items and items per page
   */
  calculateTotalPages(total: number, perPage: number): number {
    return Math.ceil(total / perPage);
  },

  /**
   * Check if there is a next page
   */
  hasNextPage(currentPage: number, totalPages: number): boolean {
    return currentPage < totalPages;
  },

  /**
   * Check if there is a previous page
   */
  hasPreviousPage(currentPage: number): boolean {
    return currentPage > 1;
  },

  /**
   * Generate page numbers for pagination UI
   */
  generatePageNumbers(
    currentPage: number,
    totalPages: number,
    maxVisible: number = 5
  ): number[] {
    const start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  },
};

// URL and query parameter utilities
export const urlUtils = {
  /**
   * Build a query string from an object
   */
  buildQueryString(
    params: Record<string, string | number | boolean | undefined>
  ): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value.toString());
      }
    });

    return searchParams.toString();
  },

  /**
   * Parse query string into an object
   */
  parseQueryString(queryString: string): Record<string, string> {
    const params = new URLSearchParams(queryString);
    const result: Record<string, string> = {};

    params.forEach((value, key) => {
      result[key] = value;
    });

    return result;
  },
};

// Cache utilities for API responses
export const cacheUtils = {
  /**
   * Simple in-memory cache with TTL (Time To Live)
   */
  cache: new Map<string, { data: unknown; expires: number }>(),

  /**
   * Get cached data if it exists and hasn't expired
   */
  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expires) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  },

  /**
   * Set data in cache with TTL in minutes
   */
  set(key: string, data: unknown, ttlMinutes: number = 5): void {
    const expires = Date.now() + ttlMinutes * 60 * 1000;
    this.cache.set(key, { data, expires });
  },

  /**
   * Clear all cached data
   */
  clear(): void {
    this.cache.clear();
  },

  /**
   * Remove expired entries from cache
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now > value.expires) {
        this.cache.delete(key);
      }
    }
  },
};
