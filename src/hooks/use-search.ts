import { useState, useCallback } from "react";
import { API_ENDPOINTS } from "@/config/api";
import { Song, Author } from "@/types";

interface SearchResponse {
  query: string;
  songs: Song[];
  authors: Author[];
}

export interface SearchResult {
  id: string;
  title: string;
  href: string;
  type: "song" | "author";
  preview?: string;
  author?: Author; // Add author data for avatar display
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
        `${API_ENDPOINTS.search}?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data: SearchResponse = await response.json();

      const searchResults: SearchResult[] = [
        // Map songs
        ...(data.songs || []).map((song) => ({
          id: song.id.toString(),
          title: song.title,
          href: `/songs/${song.id}`,
          type: "song" as const,
          preview: extractPreview(
            song.english_lyrics || song.hindi_lyrics || song.urdu_lyrics || ""
          ),
          author: song.author, // Include author data for avatar
        })),
        // Map authors
        ...(data.authors || []).map((author) => ({
          id: author.id.toString(),
          title: author.name,
          href: `/authors/${author.id}`,
          type: "author" as const,
          author: author, // Include author data for avatar
        })),
      ];

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
