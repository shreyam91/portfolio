import axios from 'axios';

// All client requests go through the Next.js API proxy to securely attach HttpOnly tokens
const api = axios.create({
  baseURL: '/api/proxy',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(new Error(error.response.data?.message || 'An error occurred'));
    } else if (error.request) {
      return Promise.reject(new Error('No response from server. Please check your connection.'));
    } else {
      return Promise.reject(new Error('Request failed. Please try again.'));
    }
  }
);

export default api;
