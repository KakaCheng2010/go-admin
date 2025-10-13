import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    console.log('API请求调试:', {
      url: config.url,
      hasToken: !!token,
      token: token ? token.substring(0, 20) + '...' : 'null'
    });
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 读取后台下发的新 token 并更新本地存储
    const refreshed = response.headers['x-refresh-token'];
    if (refreshed && typeof refreshed === 'string' && refreshed.length > 0) {
      const { setToken } = useAuthStore.getState();
      setToken(refreshed);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
