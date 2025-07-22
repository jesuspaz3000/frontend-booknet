import { apiService, ApiResponse } from '@/services/api.service';

// Interfaces para Genre
export interface Genre {
  id: string;
  nombre: string;
  descripcion: string;
  genero_padre?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// Interface para crear género (sin id, createdAt, updatedAt)
export interface CreateGenreRequest {
  nombre: string;
  descripcion: string;
  genero_padre?: string | null;
}

// Interface para actualizar género (todos los campos opcionales excepto los que se quieren cambiar)
export interface UpdateGenreRequest {
  nombre?: string;
  descripcion?: string;
  genero_padre?: string | null;
}

// Interface para parámetros de listado
export interface ListGenresParams {
  limit?: number;
  offset?: number;
}

// Interface para respuesta de listado
export interface GenresListResponse {
  generos: Genre[];
  total: number;
  limit: number;
  offset: number;
}

// Interface para respuesta de creación
export interface CreateGenreResponse {
  genre: Genre;
  message: string;
}

// Interface para respuesta de actualización
export interface UpdateGenreResponse {
  genre: Genre;
  message: string;
}

// Interface para respuesta de eliminación
export interface DeleteGenreResponse {
  message: string;
}

/**
 * Servicio para gestión de géneros
 * Maneja todas las operaciones CRUD para géneros
 */
class GenresManagementService {
  /**
   * Obtener lista de géneros con paginación
   * @param params - Parámetros de paginación (limit, offset)
   * @returns Promise con la lista de géneros
   */
  async getGenres(params: ListGenresParams = {}): Promise<ApiResponse<GenresListResponse>> {
    try {
      const { limit = 10, offset = 0 } = params;
      const response = await apiService.get<GenresListResponse>(`genres?limit=${limit}&offset=${offset}`);
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error obteniendo géneros');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtener todos los géneros sin paginación
   * @returns Promise con la lista completa de géneros
   */
  async getAllGenres(): Promise<ApiResponse<Genre[]>> {
    try {
      const response = await apiService.get<Genre[]>('/genres');
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error obteniendo géneros');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Crear un nuevo género
   * @param genreData - Datos del género a crear
   * @returns Promise con el género creado
   */
  async createGenre(genreData: CreateGenreRequest): Promise<ApiResponse<CreateGenreResponse>> {
    try {
      // Validaciones básicas
      if (!genreData.nombre || genreData.nombre.trim() === '') {
        throw new Error('El nombre del género es requerido');
      }
      
      if (!genreData.descripcion || genreData.descripcion.trim() === '') {
        throw new Error('La descripción del género es requerida');
      }
      
      // Validar longitud mínima del nombre
      if (genreData.nombre.trim().length < 2) {
        throw new Error('El nombre del género debe tener al menos 2 caracteres');
      }
      
      // Validar longitud mínima de la descripción
      if (genreData.descripcion.trim().length < 10) {
        throw new Error('La descripción debe tener al menos 10 caracteres');
      }
      
      // Validar género padre si se proporciona
      if (genreData.genero_padre && genreData.genero_padre.trim() === '') {
        throw new Error('El ID del género padre no puede estar vacío si se proporciona');
      }
      
      const response = await apiService.post<CreateGenreResponse>('genres', { ...genreData });
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error creando género');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtener un género por ID
   * @param id - ID del género
   * @returns Promise con los datos del género
   */
  async getGenreById(id: string): Promise<ApiResponse<Genre>> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('ID del género es requerido');
      }
      
      const response = await apiService.get<Genre>(`genres/${id}`);
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error obteniendo género');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Actualizar un género existente
   * @param id - ID del género a actualizar
   * @param genreData - Datos del género a actualizar
   * @returns Promise con el género actualizado
   */
  async updateGenre(id: string, genreData: UpdateGenreRequest): Promise<ApiResponse<UpdateGenreResponse>> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('ID del género es requerido');
      }
      
      // Validar que al menos un campo esté presente
      const hasData = Object.keys(genreData).some(key => {
        const value = genreData[key as keyof UpdateGenreRequest];
        return value !== undefined && value !== null && value !== '';
      });
      
      if (!hasData) {
        throw new Error('Debe proporcionar al menos un campo para actualizar');
      }
      
      // Validaciones de campos específicos si están presentes
      if (genreData.nombre !== undefined) {
        if (genreData.nombre.trim() === '') {
          throw new Error('El nombre del género no puede estar vacío');
        }
        if (genreData.nombre.trim().length < 2) {
          throw new Error('El nombre del género debe tener al menos 2 caracteres');
        }
      }
      
      if (genreData.descripcion !== undefined) {
        if (genreData.descripcion.trim() === '') {
          throw new Error('La descripción del género no puede estar vacía');
        }
        if (genreData.descripcion.trim().length < 10) {
          throw new Error('La descripción debe tener al menos 10 caracteres');
        }
      }
      
      // Validar género padre si se proporciona
      if (genreData.genero_padre !== undefined && genreData.genero_padre !== null && genreData.genero_padre.trim() === '') {
        throw new Error('El ID del género padre no puede estar vacío si se proporciona');
      }
      
      const response = await apiService.patch<UpdateGenreResponse>(`genres/${id}`, { ...genreData });
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error actualizando género');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Eliminar un género
   * @param id - ID del género a eliminar
   * @returns Promise con confirmación de eliminación
   */
  async deleteGenre(id: string): Promise<ApiResponse<DeleteGenreResponse>> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('ID del género es requerido');
      }
      
      const response = await apiService.delete<DeleteGenreResponse>(`genres/${id}`);
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error eliminando género');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Validar si un género puede ser padre de otro (evitar referencias circulares)
   * @param parentId - ID del género padre propuesto
   * @param childId - ID del género hijo
   * @returns Promise<boolean> - true si es válido
   */
  async validateParentGenre(parentId: string, childId?: string): Promise<boolean> {
    try {
      if (!parentId || parentId.trim() === '') {
        return true; // null/undefined es válido
      }
      
      if (childId && parentId === childId) {
        throw new Error('Un género no puede ser padre de sí mismo');
      }
      
      // Verificar que el género padre existe
      const parentGenre = await this.getGenreById(parentId);
      if (!parentGenre.success) {
        throw new Error('El género padre especificado no existe');
      }
      
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error validando género padre';
      throw new Error(errorMessage);
    }
  }
}

// Exportar instancia única del servicio
const genresManagementService = new GenresManagementService();
export default genresManagementService;