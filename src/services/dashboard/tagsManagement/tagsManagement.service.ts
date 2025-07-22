import { apiService, ApiResponse } from '@/services/api.service';

// Interfaces para Tag
export interface Tag {
  id: string;
  nombre: string;
  categoria: string;
  createdAt?: string;
  updatedAt?: string;
}

// Interface para crear tag (sin id, createdAt, updatedAt)
export interface CreateTagRequest {
  nombre: string;
  categoria: string;
}

// Interface para actualizar tag (todos los campos opcionales excepto los que se quieren cambiar)
export interface UpdateTagRequest {
  nombre?: string;
  categoria?: string;
}

// Interface para parámetros de listado
export interface ListTagsParams {
  limit?: number;
  offset?: number;
}

// Interface para respuesta de listado
export interface TagsListResponse {
  tags: Tag[];
  total: number;
  limit: number;
  offset: number;
}

// Interface para respuesta de creación
export interface CreateTagResponse {
  tag: Tag;
  message: string;
}

// Interface para respuesta de actualización
export interface UpdateTagResponse {
  tag: Tag;
  message: string;
}

// Interface para respuesta de eliminación
export interface DeleteTagResponse {
  message: string;
}

/**
 * Servicio para gestión de tags
 * Maneja todas las operaciones CRUD para tags
 */
class TagsManagementService {
  /**
   * Obtener lista de tags con paginación
   * @param params - Parámetros de paginación (limit, offset)
   * @returns Promise con la lista de tags
   */
  async getTags(params: ListTagsParams = {}): Promise<ApiResponse<TagsListResponse>> {
    try {
      const { limit = 10, offset = 0 } = params;
      const response = await apiService.get<TagsListResponse>(`tags?limit=${limit}&offset=${offset}`);
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error obteniendo tags');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtener todos los tags sin paginación
   * @returns Promise con la lista completa de tags
   */
  async getAllTags(): Promise<ApiResponse<Tag[]>> {
    try {
      const response = await apiService.get<Tag[]>('/tags');
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error obteniendo tags');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Crear un nuevo tag
   * @param tagData - Datos del tag a crear
   * @returns Promise con el tag creado
   */
  async createTag(tagData: CreateTagRequest): Promise<ApiResponse<CreateTagResponse>> {
    try {
      // Validaciones básicas
      if (!tagData.nombre || tagData.nombre.trim() === '') {
        throw new Error('El nombre del tag es requerido');
      }
      
      if (!tagData.categoria || tagData.categoria.trim() === '') {
        throw new Error('La categoría del tag es requerida');
      }
      
      // Validar longitud mínima del nombre
      if (tagData.nombre.trim().length < 2) {
        throw new Error('El nombre del tag debe tener al menos 2 caracteres');
      }
      
      // Validar longitud mínima de la categoría
      if (tagData.categoria.trim().length < 3) {
        throw new Error('La categoría debe tener al menos 3 caracteres');
      }
      
      // Validar longitud máxima para evitar tags muy largos
      if (tagData.nombre.trim().length > 50) {
        throw new Error('El nombre del tag no puede exceder 50 caracteres');
      }
      
      if (tagData.categoria.trim().length > 30) {
        throw new Error('La categoría no puede exceder 30 caracteres');
      }
      
      const response = await apiService.post<CreateTagResponse>('tags', { ...tagData });
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error creando tag');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtener un tag por ID
   * @param id - ID del tag
   * @returns Promise con los datos del tag
   */
  async getTagById(id: string): Promise<ApiResponse<Tag>> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('ID del tag es requerido');
      }
      
      const response = await apiService.get<Tag>(`tags/${id}`);
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error obteniendo tag');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Actualizar un tag existente
   * @param id - ID del tag a actualizar
   * @param tagData - Datos del tag a actualizar
   * @returns Promise con el tag actualizado
   */
  async updateTag(id: string, tagData: UpdateTagRequest): Promise<ApiResponse<UpdateTagResponse>> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('ID del tag es requerido');
      }
      
      // Validar que al menos un campo esté presente
      const hasData = Object.keys(tagData).some(key => {
        const value = tagData[key as keyof UpdateTagRequest];
        return value !== undefined && value !== null && value !== '';
      });
      
      if (!hasData) {
        throw new Error('Debe proporcionar al menos un campo para actualizar');
      }
      
      // Validaciones de campos específicos si están presentes
      if (tagData.nombre !== undefined) {
        if (tagData.nombre.trim() === '') {
          throw new Error('El nombre del tag no puede estar vacío');
        }
        if (tagData.nombre.trim().length < 2) {
          throw new Error('El nombre del tag debe tener al menos 2 caracteres');
        }
        if (tagData.nombre.trim().length > 50) {
          throw new Error('El nombre del tag no puede exceder 50 caracteres');
        }
      }
      
      if (tagData.categoria !== undefined) {
        if (tagData.categoria.trim() === '') {
          throw new Error('La categoría del tag no puede estar vacía');
        }
        if (tagData.categoria.trim().length < 3) {
          throw new Error('La categoría debe tener al menos 3 caracteres');
        }
        if (tagData.categoria.trim().length > 30) {
          throw new Error('La categoría no puede exceder 30 caracteres');
        }
      }
      
      const response = await apiService.patch<UpdateTagResponse>(`tags/${id}`, { ...tagData });
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error actualizando tag');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Eliminar un tag
   * @param id - ID del tag a eliminar
   * @returns Promise con confirmación de eliminación
   */
  async deleteTag(id: string): Promise<ApiResponse<DeleteTagResponse>> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('ID del tag es requerido');
      }
      
      const response = await apiService.delete<DeleteTagResponse>(`tags/${id}`);
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error eliminando tag');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Buscar tags por nombre o categoría
   * @param searchTerm - Término de búsqueda
   * @param params - Parámetros de paginación
   * @returns Promise con los tags que coinciden
   */
  async searchTags(searchTerm: string, params: ListTagsParams = {}): Promise<ApiResponse<TagsListResponse>> {
    try {
      if (!searchTerm || searchTerm.trim() === '') {
        throw new Error('Término de búsqueda es requerido');
      }
      
      const { limit = 10, offset = 0 } = params;
      const response = await apiService.get<TagsListResponse>(
        `tags/search?q=${encodeURIComponent(searchTerm.trim())}&limit=${limit}&offset=${offset}`
      );
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error buscando tags');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtener tags por categoría
   * @param categoria - Categoría a filtrar
   * @param params - Parámetros de paginación
   * @returns Promise con los tags de la categoría
   */
  async getTagsByCategory(categoria: string, params: ListTagsParams = {}): Promise<ApiResponse<TagsListResponse>> {
    try {
      if (!categoria || categoria.trim() === '') {
        throw new Error('Categoría es requerida');
      }
      
      const { limit = 10, offset = 0 } = params;
      const response = await apiService.get<TagsListResponse>(
        `tags/category/${encodeURIComponent(categoria.trim())}?limit=${limit}&offset=${offset}`
      );
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error obteniendo tags por categoría');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Validar si un tag con el mismo nombre ya existe
   * @param nombre - Nombre del tag a validar
   * @param excludeId - ID a excluir de la validación (para actualizaciones)
   * @returns Promise<boolean> - true si el nombre está disponible
   */
  async validateTagName(nombre: string, excludeId?: string): Promise<boolean> {
    try {
      if (!nombre || nombre.trim() === '') {
        throw new Error('Nombre del tag es requerido para validación');
      }
      
      const searchResult = await this.searchTags(nombre.trim());
      
      if (!searchResult.success) {
        return true; // Si no se puede buscar, asumimos que está disponible
      }
      
      const existingTags = searchResult.data.tags.filter(tag => 
        tag.nombre.toLowerCase() === nombre.trim().toLowerCase() &&
        (!excludeId || tag.id !== excludeId)
      );
      
      return existingTags.length === 0;
    } catch (error: unknown) {
      // En caso de error, permitimos continuar (no bloqueamos la operación)
      console.warn('Error validando nombre del tag:', error);
      return true;
    }
  }
}

// Exportar instancia única del servicio
const tagsManagementService = new TagsManagementService();
export default tagsManagementService;