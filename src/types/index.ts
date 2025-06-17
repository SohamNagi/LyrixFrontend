export interface Author {
  id: number;
  name: string;
  song_count?: number;
}

export interface Song {
  id: number;
  title: string;
  author: Author;
  hindi_lyrics?: string;
  urdu_lyrics?: string;
  english_lyrics?: string;
  hindi_theme?: string;
  urdu_theme?: string;
  english_theme?: string;
}

export interface SearchResult {
  songs: Song[];
  authors: Author[];
}

export interface LineAnalysis {
  id: number;
  song_id: number;
  line_number: number;
  hindi_text?: string;
  urdu_text?: string;
  english_text?: string;
  romanized_text?: string;
  interpretation?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: "success" | "error";
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  per_page: number;
  total: number;
  pages: number;
}

// Backend API response format
export interface BackendPaginatedSongs {
  songs: Song[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface BackendPaginatedAuthors {
  authors: Author[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface BackendSearchSongs {
  query: string;
  songs: Song[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}
