import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

// Tipos para API
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  timestamp: number;
}

export interface ApiError {
  success: false;
  message: string;
  data: null;
  timestamp: number;
}

// Interfaz para request con retry
interface RequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

// Configuración base para la API con Axios
class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - agregar token automáticamente
    this.api.interceptors.request.use(
      (config) => {
        // Agregar token si existe
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('access_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - manejar errores y refresh token automático
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as RequestConfigWithRetry;

        // Si el token expiró (401) y no es un retry
        if (error.response?.status === 401 && !originalRequest?._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              // Hacer refresh token SIN interceptors para evitar loop
              const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}auth/refresh`, {
                refresh_token: refreshToken
              });

              if (response.data.success) {
                const { access_token, refresh_token } = response.data.data;
                
                // Guardar nuevos tokens
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);
                
                // Reintentar la petición original con el nuevo token
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${access_token}`;
                } else {
                  originalRequest.headers = { Authorization: `Bearer ${access_token}` };
                }
                return this.api(originalRequest);
              }
            }
          } catch {
            // Si falla el refresh, limpiar tokens y redirigir
            this.clearTokens();
            
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await this.api.get<ApiResponse<T>>(endpoint);
    return response.data;
  }

  // POST request
  async post<T>(endpoint: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const response = await this.api.post<ApiResponse<T>>(endpoint, data);
    return response.data;
  }

  // PUT request
  async put<T>(endpoint: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const response = await this.api.put<ApiResponse<T>>(endpoint, data);
    return response.data;
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.patch<ApiResponse<T>>(endpoint, data);
      return response.data;
    } catch (error: unknown) {
      // Si es un error de axios con respuesta del backend
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data: ApiResponse<T> } };
        if (axiosError.response?.data) {
          // Retornar la respuesta de error del backend
          return axiosError.response.data;
        }
      }
      // Si no hay respuesta del backend, lanzar error genérico
      throw error;
    }
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await this.api.delete<ApiResponse<T>>(endpoint);
    return response.data;
  }

  // POST sin autenticación (para login/register)
  async postWithoutAuth<T>(endpoint: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const response = await axios.post<ApiResponse<T>>(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, data, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });
    return response.data;
  }

  // Limpiar tokens
  clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }
}

export const apiService = new ApiService();