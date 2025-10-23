import axios, { AxiosError } from 'axios';
import { useAuthStore } from '@/store/authStore';

// Create axios instance with configuration
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    // timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token from Zustand store
axiosInstance.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Clear auth state through Zustand
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
