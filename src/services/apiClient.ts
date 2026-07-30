import axios from 'axios';

// Step 1: Create Axios instance with base URL configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Step 2: Add Request Interceptor (Optional: e.g. attach authorization headers in future)
apiClient.interceptors.request.use(
  (config) => {
    // You can attach tokens here if needed
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Step 3: Add Response Interceptor for central error formatting
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
    };
    return Promise.reject(customError);
  }
);

export default apiClient;
