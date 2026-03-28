import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Clerk session token to every request
api.interceptors.request.use(async (config) => {
  // Token will be set by the auth provider hook
  const token = window.__clerk_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || 'Something went wrong';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

export default api;
