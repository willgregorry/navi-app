import axios from 'axios';
import { ENV } from '../../config/env';

export const apiClient = axios.create({
  baseURL: ENV.API_URL,
  timeout: 10000,
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
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Standardized error parsing
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Graceful handling for offline / local hackathon mode
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      console.info('[Navi API] Backend server currently offline, utilizing local dummy fallback dataset.');
    }
    return Promise.reject(error);
  }
);
