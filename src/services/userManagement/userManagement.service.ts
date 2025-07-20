import { apiService, ApiResponse } from '../api.service';

// Tipos para el servicio de gestión de usuarios
export interface User {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
  [key: string]: unknown;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
  role?: 'USER' | 'ADMIN';
  [key: string]: unknown;
}

export interface UsersListResponse {
  users: User[];
  totalUsers: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ListUsersParams {
  limit?: number;
  offset?: number;
}

// Servicio de gestión de usuarios
class UserManagementService {
  /**
   * Obtener lista de usuarios con paginación
   * GET /users?limit=10&offset=0
   */
  async getUsers(params: ListUsersParams = {}): Promise<ApiResponse<UsersListResponse>> {
    try {
      const { limit = 10, offset = 0 } = params;
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString()
      });

      const response = await apiService.get<UsersListResponse>(`users?${queryParams}`);
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error obteniendo usuarios');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Crear un nuevo usuario
   * POST /users
   */
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    try {
      const response = await apiService.post<User>('users', userData);
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error creando usuario');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtener datos de un usuario por ID
   * GET /users/{id}
   */
  async getUserById(userId: string): Promise<ApiResponse<User>> {
    try {
      const response = await apiService.get<User>(`users/${userId}`);
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error obteniendo usuario');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Actualizar un usuario existente
   * PATCH /users/{id}
   */
  async updateUser(userId: string, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    try {
      const response = await apiService.patch<User>(`users/${userId}`, userData);
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error actualizando usuario');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Eliminar un usuario
   * DELETE /users/{id}
   */
  async deleteUser(userId: string): Promise<ApiResponse<null>> {
    try {
      const response = await apiService.delete<null>(`users/${userId}`);
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error eliminando usuario');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Validar si un username ya existe
   */
  async checkUsernameExists(username: string): Promise<boolean> {
    try {
      const response = await this.getUsers({ limit: 100, offset: 0 });
      return response.data.users.some((user: User) => user.username.toLowerCase() === username.toLowerCase());
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  }

  /**
   * Validar si un email ya existe
   */
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const response = await this.getUsers({ limit: 100, offset: 0 });
      return response.data.users.some((user: User) => user.email.toLowerCase() === email.toLowerCase());
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  }

  /**
   * Obtener estadísticas de usuarios
   */
  async getUserStats(): Promise<{ totalUsers: number; adminUsers: number; regularUsers: number }> {
    try {
      const response = await this.getUsers({ limit: 1000, offset: 0 });
      const users = response.data.users;
      
      return {
        totalUsers: users.length,
        adminUsers: users.filter((user: User) => user.role === 'ADMIN').length,
        regularUsers: users.filter((user: User) => user.role === 'USER').length
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return { totalUsers: 0, adminUsers: 0, regularUsers: 0 };
    }
  }
}

// Exportar una instancia del servicio
export const userManagementService = new UserManagementService();
export default userManagementService;