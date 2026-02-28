// API Configuration
// Can be overridden with VITE_API_BASE_URL environment variable
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://3.239.32.114:8000',
  ENDPOINTS: {
    ANALYZE: '/analyze'
  }
};
