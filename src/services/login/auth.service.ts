import { apiService } from '../api.service';

// Tipos específicos para Auth
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface LoginRequest {
  username: string;
  password: string;
  [key: string]: unknown;
}

export interface AuthResponse {
  access_token?: string;
  refresh_token?: string;
  accessToken?: string;  // Para compatibilidad con backend que use camelCase
  refreshToken?: string; // Para compatibilidad con backend que use camelCase
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

// Servicio de autenticación
class AuthService {
  // Iniciar sesión
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiService.postWithoutAuth<AuthResponse>('auth/login', credentials);
      
      if (response.success) {
        this.storeAuthData(response.data);
        return response.data;
      }
      
      throw new Error(response.message || 'Error en el login');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();
      
      if (refreshToken) {
        await apiService.post('auth/logout', {
          refresh_token: refreshToken
        });
      }
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      this.clearAuthData();
    }
  }

  // Renovar token
  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = this.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await apiService.postWithoutAuth<AuthResponse>('auth/refresh', {
        refresh_token: refreshToken
      });
      
      if (response.success) {
        this.storeAuthData(response.data);
        return response.data;
      }
      
      throw new Error('Error renovando token');
    } catch (error) {
      this.clearAuthData();
      throw error;
    }
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('access_token');
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Verificar si es admin
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  }

  // Verificar si es usuario regular
  isUser(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'USER';
  }

  // Obtener access token
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  // Obtener refresh token
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  }

  // Obtener rol del usuario
  getUserRole(): 'USER' | 'ADMIN' | null {
    const user = this.getCurrentUser();
    return user?.role || null;
  }

  // Métodos privados
  private storeAuthData(authData: AuthResponse): void {
    if (typeof window !== 'undefined') {
      // Manejar ambos formatos de respuesta (snake_case y camelCase)
      const accessToken = authData.access_token || authData.accessToken;
      const refreshToken = authData.refresh_token || authData.refreshToken;
      
      if (accessToken && refreshToken) {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('user', JSON.stringify(authData.user));
      } else {
        throw new Error('Tokens no válidos en la respuesta del servidor');
      }
    }
  }

  private clearAuthData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }
}

export const authService = new AuthService();