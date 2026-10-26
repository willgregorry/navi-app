export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'https://navi.willygregory.site/api/v1',
  WS_URL: import.meta.env.VITE_WS_URL || 'wss://navi.willygregory.site/ws',
  IS_DEV: import.meta.env.DEV,
  APP_ENV: import.meta.env.VITE_APP_ENV || 'production',
} as const;
