// API Configuration
const config = {
  development: {
    baseURL: "http://localhost:8080/api",
  },
  production: {
    baseURL: "https://lyrixbackend.onrender.com/api",
  },
};

const isDevelopment = import.meta.env.DEV;

export const API_CONFIG = isDevelopment
  ? config.development
  : config.production;

export const API_ENDPOINTS = {
  songs: `${API_CONFIG.baseURL}/songs`,
  authors: `${API_CONFIG.baseURL}/authors`,
  transcription: (songId: string, lineNum: number, language: string) =>
    `${API_CONFIG.baseURL}/songs/${songId}/transcription?linenum=${lineNum}&language=${language}`,
  theme: (songId: string, language: string) =>
    `${API_CONFIG.baseURL}/songs/${songId}/theme?language=${language}`,
};
