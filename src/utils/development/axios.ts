// utils/axiosConfig.ts
import axios from 'axios';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.API_BASEURL 
    ? '/bvcsp'  // Use proxy in development
    : 'http://127.0.0.1:9780/bvcsp',  // Direct call in production
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = import.meta.env.API_TOKEN;
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
