import { useState, useCallback } from "react";
import { API_ENDPOINTS } from "@/config/api";

interface Song {
  title: string;
  hindiLyrics: string;
  urduLyrics: string;
  englishLyrics: string;
  hindiTheme: string | null;
  urduTheme: string | null;
  englishTheme: string | null;
  _links: {
    self: { href: string };
    song: { href: string };
    analyses: { href: string };
    author: { href: string };
  };
}

interface SearchResponse {
  _embedded: {
    songs: Song[];
  };
}

export interface SearchResult {
  id: string;
  title: string;
  href: string;
  type: "song";
  preview?: string;
}

export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${
          API_ENDPOINTS.songs
        }/search/findByTitleContainingIgnoreCase?title=${encodeURIComponent(
          query
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data: SearchResponse = await response.json();
      const songs = data._embedded?.songs || [];

      const searchResults: SearchResult[] = songs.map((song) => {
        const preview = extractPreview(
          song.hindiLyrics || song.urduLyrics || song.englishLyrics || ""
        );
        return {
          id: extractId(song._links.self.href),
          title: song.title,
          href: `/songs/${extractId(song._links.self.href)}`,
          type: "song" as const,
          preview: preview || undefined,
        };
      });

      setResults(searchResults);
    } catch (err) {
      setError("Failed to fetch search results");
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clear,
  };
}

function extractId(href: string): string {
  const match = href.match(/\/(\d+)$/);
  return match ? match[1] : "";
}

function extractPreview(lyrics: string): string {
  if (!lyrics) return "";

  // Clean up the lyrics and get first few lines
  const cleanLyrics = lyrics.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();

  // Return first 100 characters with word boundary
  if (cleanLyrics.length <= 100) return cleanLyrics;

  const truncated = cleanLyrics.substring(0, 100);
  const lastSpace = truncated.lastIndexOf(" ");

  return lastSpace > 80
    ? truncated.substring(0, lastSpace) + "..."
    : truncated + "...";
}
