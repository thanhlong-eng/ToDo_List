import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
});

// Interceptor để handle lỗi chung (ví dụ 401)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Unauthorized! Có thể redirect về login.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
