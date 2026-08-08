import axios from 'axios';

const api = axios.create({
  baseURL: 'https://happy-presence-production-0d0b.up.railway.app/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;