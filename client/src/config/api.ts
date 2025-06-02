// API Configuration
// Switch between Node.js and Java backends by changing these settings

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  backend: 'nodejs' | 'java';
}

// Backend configurations
const BACKEND_CONFIGS = {
  nodejs: {
    baseUrl: 'http://localhost:5000',
    timeout: 10000,
    backend: 'nodejs' as const,
  },
  java: {
    baseUrl: 'http://localhost:8080',
    timeout: 10000,
    backend: 'java' as const,
  },
} as const;

// Current backend selection - Change this to switch backends
const SELECTED_BACKEND: keyof typeof BACKEND_CONFIGS = 'nodejs';

// Export the current configuration
export const API_CONFIG: ApiConfig = BACKEND_CONFIGS[SELECTED_BACKEND];

// Environment-based override (optional)
if (import.meta.env.VITE_BACKEND_TYPE) {
  const envBackend = import.meta.env.VITE_BACKEND_TYPE as keyof typeof BACKEND_CONFIGS;
  if (BACKEND_CONFIGS[envBackend]) {
    Object.assign(API_CONFIG, BACKEND_CONFIGS[envBackend]);
  }
}

// API endpoint builders
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.baseUrl}${endpoint}`;
};

// Authentication URLs (different patterns for different backends)
export const AUTH_URLS = {
  login: API_CONFIG.backend === 'nodejs' ? '/api/login' : '/login',
  logout: API_CONFIG.backend === 'nodejs' ? '/api/logout' : '/api/logout',
  callback: API_CONFIG.backend === 'nodejs' ? '/api/callback' : '/login/oauth2/code/replit',
};

// Debug info
console.log(`🔧 Backend Configuration:`, {
  backend: API_CONFIG.backend,
  baseUrl: API_CONFIG.baseUrl,
  authUrls: AUTH_URLS,
});