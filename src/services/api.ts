import { API_ENDPOINTS } from "@/config/api";
import {
  Song,
  Author,
  LineAnalysis,
  PaginatedResponse,
  BackendPaginatedSongs,
  BackendPaginatedAuthors,
  BackendSearchSongs,
} from "@/types";

interface StatsData {
  total_songs: number;
  total_authors: number;
  languages: string[];
}

class ApiService {
  private async makeRequest<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Songs API
  async getAllSongs(): Promise<Song[]> {
    const response = await this.makeRequest<BackendPaginatedSongs>(
      `${API_ENDPOINTS.songs}?per_page=1000`
    );
    return response.songs;
  }

  async getSongById(id: string): Promise<Song> {
    return this.makeRequest<Song>(`${API_ENDPOINTS.songs}/${id}`);
  }

  async getSongsByAuthor(authorId: string): Promise<Song[]> {
    const response = await this.makeRequest<{
      author: Author;
      songs: Song[];
      pagination: {
        page: number;
        per_page: number;
        total: number;
        pages: number;
        has_next: boolean;
        has_prev: boolean;
      };
    }>(`${API_ENDPOINTS.authors}/${authorId}/songs?per_page=1000`);
    return response.songs;
  }

  async getSongsPaginated(
    page: number = 1,
    perPage: number = 12,
    searchTerm?: string,
    authorId?: string
  ): Promise<PaginatedResponse<Song>> {
    if (searchTerm) {
      // Use search endpoint when there's a search term
      return this.searchSongs(searchTerm, page, perPage, authorId);
    }

    if (authorId && authorId !== "all") {
      // Use author songs endpoint for author filtering without search
      const response = await this.makeRequest<{
        author: Author;
        songs: Song[];
        pagination: {
          page: number;
          per_page: number;
          total: number;
          pages: number;
          has_next: boolean;
          has_prev: boolean;
        };
      }>(
        `${API_ENDPOINTS.authors}/${authorId}/songs?page=${page}&per_page=${perPage}`
      );

      return {
        data: response.songs,
        page: response.pagination.page,
        per_page: response.pagination.per_page,
        total: response.pagination.total,
        pages: response.pagination.pages,
      };
    }

    // Default: get all songs with pagination
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    const backendResponse = await this.makeRequest<BackendPaginatedSongs>(
      `${API_ENDPOINTS.songs}?${params.toString()}`
    );

    return {
      data: backendResponse.songs,
      page: backendResponse.pagination.page,
      per_page: backendResponse.pagination.per_page,
      total: backendResponse.pagination.total,
      pages: backendResponse.pagination.pages,
    };
  }

  // Authors API
  async getAllAuthors(): Promise<Author[]> {
    const backendResponse = await this.makeRequest<BackendPaginatedAuthors>(
      `${API_ENDPOINTS.authors}?per_page=1000`
    );
    return backendResponse.authors;
  }

  async getAuthorById(id: string): Promise<Author> {
    return this.makeRequest<Author>(`${API_ENDPOINTS.authors}/${id}`);
  }

  async getAuthorsPaginated(
    page: number = 1,
    perPage: number = 12,
    searchTerm?: string
  ): Promise<PaginatedResponse<Author>> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    // Note: The backend doesn't support search for authors directly,
    // so we ignore the searchTerm parameter here and let the frontend handle filtering

    const backendResponse = await this.makeRequest<BackendPaginatedAuthors>(
      `${API_ENDPOINTS.authors}?${params.toString()}`
    );

    return {
      data: backendResponse.authors,
      page: backendResponse.pagination.page,
      per_page: backendResponse.pagination.per_page,
      total: backendResponse.pagination.total,
      pages: backendResponse.pagination.pages,
    };
  }

  // Line Analysis API
  async getLineAnalysis(
    songId: string,
    lineNum: number,
    language: string
  ): Promise<LineAnalysis> {
    const url = API_ENDPOINTS.transcription(songId, lineNum, language);
    return this.makeRequest<LineAnalysis>(url);
  }

  // Theme API
  async getSongTheme(songId: string, language: string): Promise<string> {
    const url = API_ENDPOINTS.theme(songId, language);
    return this.makeRequest<string>(url);
  }

  // Search API
  async searchSongs(
    query: string,
    page: number = 1,
    perPage: number = 12,
    authorId?: string
  ): Promise<PaginatedResponse<Song>> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      per_page: perPage.toString(),
    });

    if (authorId && authorId !== "all") {
      params.append("author_id", authorId);
    }

    const backendResponse = await this.makeRequest<BackendSearchSongs>(
      `${API_ENDPOINTS.searchSongs}?${params.toString()}`
    );

    // Convert backend format to our frontend format
    return {
      data: backendResponse.songs,
      page: backendResponse.pagination.page,
      per_page: backendResponse.pagination.per_page,
      total: backendResponse.pagination.total,
      pages: backendResponse.pagination.pages,
    };
  }

  async globalSearch(
    query: string
  ): Promise<{ songs: Song[]; authors: Author[] }> {
    const url = `${API_ENDPOINTS.search}?q=${encodeURIComponent(query)}`;
    return this.makeRequest<{ songs: Song[]; authors: Author[] }>(url);
  }

  // Statistics API
  async getStats(): Promise<StatsData> {
    return this.makeRequest<StatsData>(API_ENDPOINTS.stats);
  }

  // Health Check
  async healthCheck(): Promise<{ status: string }> {
    return this.makeRequest<{ status: string }>(API_ENDPOINTS.health);
  }
}

// Export a singleton instance
export const apiService = new ApiService();
export default apiService;
