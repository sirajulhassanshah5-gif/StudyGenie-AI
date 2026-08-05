import axios from 'axios';
import { supabase } from '../lib/supabaseClient';

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

// 1. Create Axios instance with base URL configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// 2. Request Interceptor: Attach Supabase JWT Bearer Token to all API calls
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch {
      // Ignore session retrieval error if unauthenticated
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor: Formats standardized response & global error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An unexpected server error occurred.',
      status: error.response?.status || 500,
      data: error.response?.data,
    };
    return Promise.reject(apiError);
  }
);

export default apiClient;
