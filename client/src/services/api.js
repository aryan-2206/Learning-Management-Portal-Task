import axios from 'axios';

// Create an Axios instance with base URL and credentials
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // important for sending cookies
});

// Request interceptor to attach token if stored elsewhere, but we use HttpOnly cookies mostly.
// If needed, we can attach bearer token here if we decide to use localStorage instead.
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // We can handle 401 unauthorized errors globally here
    if (error.response && error.response.status === 401) {
      // Optional: trigger a logout action or redirect to login
      console.warn('Unauthorized access. Please login.');
    }
    return Promise.reject(error);
  }
);

export default api;
