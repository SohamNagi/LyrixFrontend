// API Configuration
const config = {
  development: {
    baseURL: "http://127.0.0.1:5000/api",
  },
  production: {
    baseURL: "https://sohamnagi.pythonanywhere.com/api",
  },
};

const isDevelopment = import.meta.env.DEV;

export const API_CONFIG = isDevelopment
  ? config.development
  : config.production;

export const API_ENDPOINTS = {
  // Songs endpoints
  songs: `${API_CONFIG.baseURL}/songs`,

  // Authors endpoints
  authors: `${API_CONFIG.baseURL}/authors`,

  // Search endpoints
  search: `${API_CONFIG.baseURL}/search`,
  searchSongs: `${API_CONFIG.baseURL}/search/songs`,

  // Statistics endpoint
  stats: `${API_CONFIG.baseURL}/stats`,

  // Health check endpoint
  health: `${API_CONFIG.baseURL.replace("/api", "")}/health`,

  // Theme endpoints
  themes: `${API_CONFIG.baseURL}/themes`,

  // Dynamic endpoints (functions)
  transcription: (songId: string, lineNum: number, language: string) =>
    `${API_CONFIG.baseURL}/songs/${songId}/transcription?linenum=${lineNum}&language=${language}`,
  theme: (songId: string, language: string) =>
    `${API_CONFIG.baseURL}/songs/${songId}/theme?language=${language}`,

  // Batch theme endpoint
  batchThemes: (songId: string) =>
    `${API_CONFIG.baseURL}/songs/${songId}/themes`,
};
