export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws',
  IS_DEV: import.meta.env.DEV,
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
} as const;
