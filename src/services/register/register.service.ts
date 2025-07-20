import { apiService } from '../api.service';

// Tipos específicos para Register
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  [key: string]: unknown;
}

export interface RegisterResponse {
  access_token?: string;
  refresh_token?: string;
  accessToken?: string;  // Para compatibilidad con backend que use camelCase
  refreshToken?: string; // Para compatibilidad con backend que use camelCase
  tokenType: string;
  expiresIn: number;
  user: {
    id: string;
    username: string;
    email: string;
    role: 'USER' | 'ADMIN';
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

// Servicio de registro
class RegisterService {
  // Registrar nuevo usuario
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      // Validar datos antes de enviar
      this.validateRegisterData(userData);
      
      const response = await apiService.postWithoutAuth<RegisterResponse>('auth/register', userData);
      
      if (response.success) {
        this.storeAuthData(response.data);
        return response.data;
      }
      
      throw new Error(response.message || 'Error en el registro');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  // Verificar si el username está disponible
  async checkUsernameAvailability(username: string): Promise<boolean> {
    try {
      // Esto sería útil si tienes un endpoint para verificar
      // Por ahora simularemos la validación local
      if (!username || username.trim().length < 3) {
        return false;
      }
      
      // Aquí podrías hacer una llamada al backend si tienes el endpoint
      // const response = await apiService.get(`auth/check-username/${username}`);
      // return response.data.available;
      
      return true;
    } catch (error) {
      console.error('Error verificando username:', error);
      return false;
    }
  }

  // Verificar si el email está disponible
  async checkEmailAvailability(email: string): Promise<boolean> {
    try {
      // Validación básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        return false;
      }
      
      // Aquí podrías hacer una llamada al backend si tienes el endpoint
      // const response = await apiService.get(`auth/check-email/${email}`);
      // return response.data.available;
      
      return true;
    } catch (error) {
      console.error('Error verificando email:', error);
      return false;
    }
  }

  // Validar fortaleza de contraseña
  validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
    strength: 'weak' | 'medium' | 'strong';
  } {
    const errors: string[] = [];
    let score = 0;

    if (password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    } else if (password.length >= 8) {
      score += 1;
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      errors.push('Debe contener al menos una letra mayúscula');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    }

    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      errors.push('Debe contener al menos un número');
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    }

    let strength: 'weak' | 'medium' | 'strong' = 'weak';
    if (score >= 4) strength = 'strong';
    else if (score >= 2) strength = 'medium';

    return {
      isValid: errors.length === 0 && password.length >= 6,
      errors,
      strength
    };
  }

  // Validación completa de datos de registro
  private validateRegisterData(userData: RegisterRequest): void {
    const errors: ValidationError[] = [];

    // Validar username
    if (!userData.username || userData.username.trim().length < 3) {
      errors.push({
        field: 'username',
        message: 'El nombre de usuario debe tener al menos 3 caracteres'
      });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email || !emailRegex.test(userData.email)) {
      errors.push({
        field: 'email',
        message: 'El email no tiene un formato válido'
      });
    }

    // Validar contraseña
    const passwordValidation = this.validatePasswordStrength(userData.password);
    if (!passwordValidation.isValid) {
      errors.push({
        field: 'password',
        message: passwordValidation.errors.join(', ')
      });
    }

    if (errors.length > 0) {
      throw new Error(`Errores de validación: ${errors.map(e => e.message).join('; ')}`);
    }
  }

  // Guardar datos de autenticación después del registro
  private storeAuthData(authData: RegisterResponse): void {
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
}

export const registerService = new RegisterService();