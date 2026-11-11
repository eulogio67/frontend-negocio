import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

// No fijamos Content-Type globalmente: Axios lo pone en application/json
// para los objetos y deja que el navegador agregue el boundary cuando el
// cuerpo es un FormData (subida de imágenes).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor para inyectar el Bearer Token automáticamente
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Interceptor para manejo de sesiones expiradas
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const url = error.config?.url ?? '';
      // Si la petición no es de login/registro y falla con 401, limpiar sesión
      if (!url.includes('/auth/')) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('usuario');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;