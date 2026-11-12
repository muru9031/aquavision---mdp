// src/api/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Global response interceptor — add auth headers here when ready
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[AquaVision API Error]', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;

