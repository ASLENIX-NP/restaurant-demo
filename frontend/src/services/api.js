import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Adjust base URL as needed
});

// Request interceptor for adding the bearer token
api.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem('restaurant_user');
    if (userString) {
      const user = JSON.parse(userString);
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
