import { apiService, ApiResponse } from '../api.service';

// Interfaces para el servicio de configuración de cuenta
export interface UpdateProfileRequest extends Record<string, unknown> {
  currentPassword: string;     // REQUERIDO para verificación
  newEmail?: string;          // OPCIONAL
  newUsername?: string;       // OPCIONAL  
  newPassword?: string;       // OPCIONAL
}

export interface UpdateProfileResponse {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  message: string;
}

export interface GetProfileResponse {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Servicio para gestión de configuración de cuenta del usuario
 * Maneja operaciones relacionadas con el perfil del usuario autenticado
 */
class AccountSettingsService {
  
  /**
   * Obtener información del perfil del usuario actual
   * GET /profile
   */
  async getProfile(): Promise<ApiResponse<GetProfileResponse>> {
    try {
      const response = await apiService.get<GetProfileResponse>('profile');
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error obteniendo perfil');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Actualizar perfil del usuario
   * PATCH /profile
   * Requiere contraseña actual para verificación
   * Permite actualizar email, username y/o password opcionalmente
   */
  async updateProfile(profileData: UpdateProfileRequest): Promise<ApiResponse<UpdateProfileResponse>> {
    try {
      // Validar que se proporcione la contraseña actual
      if (!profileData.currentPassword || profileData.currentPassword.trim() === '') {
        throw new Error('La contraseña actual es requerida para actualizar el perfil');
      }

      // Validar que al menos un campo opcional esté presente
      if (!profileData.newEmail && !profileData.newUsername && !profileData.newPassword) {
        throw new Error('Debe proporcionar al menos un campo para actualizar (email, username o password)');
      }

      // Validaciones adicionales
      if (profileData.newEmail && !this.isValidEmail(profileData.newEmail)) {
        throw new Error('El formato del email no es válido');
      }

      if (profileData.newUsername && profileData.newUsername.trim().length < 3) {
        throw new Error('El nombre de usuario debe tener al menos 3 caracteres');
      }

      if (profileData.newPassword && profileData.newPassword.length < 6) {
        throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
      }

      const response = await apiService.patch<UpdateProfileResponse>('profile', profileData);
      
      if (response.success) {
        // Actualizar información del usuario en localStorage si es necesario
        this.updateLocalUserInfo(response.data);
        return response;
      }
      
      throw new Error(response.message || 'Error actualizando perfil');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Validar formato de email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Actualizar información del usuario en localStorage
   */
  private updateLocalUserInfo(userData: UpdateProfileResponse): void {
    try {
      if (typeof window !== 'undefined') {
        const currentUser = localStorage.getItem('user');
        if (currentUser) {
          const user = JSON.parse(currentUser);
          // Actualizar campos que pueden haber cambiado
          user.username = userData.username;
          user.email = userData.email;
          user.updatedAt = userData.updatedAt;
          localStorage.setItem('user', JSON.stringify(user));
        }
      }
    } catch (error) {
      console.warn('Error actualizando información local del usuario:', error);
    }
  }

  /**
   * Verificar contraseña actual del usuario
   * POST /profile/verify-password
   */
  async verifyCurrentPassword(currentPassword: string): Promise<ApiResponse<{ valid: boolean }>> {
    try {
      if (!currentPassword || currentPassword.trim() === '') {
        throw new Error('La contraseña es requerida');
      }

      const response = await apiService.post<{ valid: boolean }>('profile/verify-password', {
        currentPassword
      });
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error verificando contraseña');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }
}

// Exportar instancia única del servicio
const accountSettingsService = new AccountSettingsService();
export default accountSettingsService;

// Exportar también la clase para testing si es necesario
export { AccountSettingsService };