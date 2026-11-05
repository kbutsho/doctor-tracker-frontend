import axios from 'axios';

const api = axios.create({ baseURL: '/api', withCredentials: true });

let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const isAuthCall = /\/auth\/(login|refresh|logout)/.test(original?.url || '');
    if (error.response?.status === 401 && original && !original._retry && !isAuthCall) {
      original._retry = true;
      try {
        refreshing = refreshing || api.post('/auth/refresh').finally(() => { refreshing = null; });
        await refreshing;
        return api(original);
      } catch {
        if (typeof window !== 'undefined') window.dispatchEvent(new Event('auth:logout'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
