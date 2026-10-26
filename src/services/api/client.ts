import axios, { AxiosError } from 'axios';
import { ENV } from '../../config/env';

// Normalize base URL to ensure it targets /api/v1
const rawBaseUrl = ENV.API_URL.replace(/\/+$/, '');
const normalizedBaseUrl = rawBaseUrl.endsWith('/v1') ? rawBaseUrl : `${rawBaseUrl}/v1`;

export const apiClient = axios.create({
  baseURL: normalizedBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach authentication token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('navi_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Provide clean debugging & error propagation
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      console.warn('[Navi API] Backend server currently unreachable, invoking offline fallback handler.');
    }
    return Promise.reject(error);
  }
);
