import { apiService, ApiResponse } from '../../api.service';

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

// Tipos para calificaciones y reseñas
export interface UserRating {
  bookId: string;
  rating: number;
  review?: string;
  reviewTitle?: string;
  helpfulVotes?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRatingRequest {
  bookId: string;
  rating: number;
  review?: string;
  reviewTitle?: string;
  [key: string]: unknown;
}

export interface BookRating {
  userId: string;
  username: string;
  rating: number;
  review?: string;
  reviewTitle?: string;
  helpfulVotes: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookRatingsParams {
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

  // ===== MÉTODOS DE CALIFICACIONES =====

  /**
   * Crear o actualizar calificación de un libro
   * POST /user-interactions/rate
   */
  async rateBook(ratingData: CreateRatingRequest): Promise<ApiResponse<UserRating>> {
    try {
      // Validar que el rating esté entre 1.0 y 5.0
      if (ratingData.rating < 1.0 || ratingData.rating > 5.0) {
        throw new Error('La calificación debe estar entre 1.0 y 5.0');
      }

      // Validar que bookId no esté vacío
      if (!ratingData.bookId || ratingData.bookId.trim() === '') {
        throw new Error('El ID del libro es requerido');
      }

      const response = await apiService.post<UserRating>('user-interactions/rate', ratingData);
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error al enviar la calificación');
    } catch (error) {
      console.error('Error rating book:', error);
      throw error;
    }
  }

  /**
   * Obtener MI calificación de un libro específico
   * GET /user-interactions/rating/{bookId}
   */
  async getMyRating(bookId: string): Promise<ApiResponse<UserRating | null>> {
    try {
      if (!bookId || bookId.trim() === '') {
        throw new Error('El ID del libro es requerido');
      }

      const response = await apiService.get<UserRating | null>(`user-interactions/rating/${bookId}`);
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error obteniendo la calificación');
    } catch (error) {
      console.error('Error getting my rating:', error);
      throw error;
    }
  }

  /**
   * Obtener TODAS las calificaciones de un libro (público)
   * GET /books/{bookId}/ratings
   */
  async getBookRatings(bookId: string, params: BookRatingsParams = {}): Promise<ApiResponse<BookRating[]>> {
    try {
      if (!bookId || bookId.trim() === '') {
        throw new Error('El ID del libro es requerido');
      }

      // Construir query parameters
      const queryParams = new URLSearchParams();
      if (params.limit !== undefined) {
        queryParams.append('limit', params.limit.toString());
      }
      if (params.offset !== undefined) {
        queryParams.append('offset', params.offset.toString());
      }

      const queryString = queryParams.toString();
      const url = `books/${bookId}/ratings${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiService.get<BookRating[]>(url);
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error obteniendo las calificaciones del libro');
    } catch (error) {
      console.error('Error getting book ratings:', error);
      throw error;
    }
  }
}

// Exportar una instancia del servicio
export const userManagementService = new UserManagementService();
export default userManagementService;