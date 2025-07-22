import { apiService, ApiResponse } from '@/services/api.service';

// Interfaces para Author
export interface Author {
  id: string;
  nombre: string;
  acerca_de: string;
  fechaNacimiento: string;
  fechaMuerte?: string | null;
  nacionalidad: string;
  foto: string;
  cantidad_de_libros?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Interface para crear autor (sin id, createdAt, updatedAt)
export interface CreateAuthorRequest {
  nombre: string;
  acerca_de: string;
  fechaNacimiento: string;
  fechaMuerte?: string | null;
  nacionalidad: string;
  foto: string;
}

// Interface para actualizar autor (todos los campos opcionales excepto los que se quieren cambiar)
export interface UpdateAuthorRequest {
  nombre?: string;
  acerca_de?: string;
  fechaNacimiento?: string;
  fechaMuerte?: string | null;
  nacionalidad?: string;
  foto?: string;
}

// Interface para parámetros de listado
export interface ListAuthorsParams {
  limit?: number;
  offset?: number;
}

// Interface para respuesta de listado
export interface AuthorsListResponse {
  autores: Author[];
  totalAutores: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Interface para respuesta de creación
export interface CreateAuthorResponse {
  author: Author;
  message: string;
}

// Interface para respuesta de actualización
export interface UpdateAuthorResponse {
  author: Author;
  message: string;
}

// Interface para respuesta de eliminación
export interface DeleteAuthorResponse {
  message: string;
}

/**
 * Servicio para gestión de autores
 * Maneja todas las operaciones CRUD para autores
 */
class AuthorManagementService {
  /**
   * Obtener lista de autores con paginación
   * @param params - Parámetros de paginación (limit, offset)
   * @returns Promise con la lista de autores
   */
  async getAuthors(params: ListAuthorsParams = {}): Promise<ApiResponse<AuthorsListResponse>> {
    try {
      const { limit = 10, offset = 0 } = params;
      const response = await apiService.get<AuthorsListResponse>(`authors?limit=${limit}&offset=${offset}`);
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error obteniendo autores');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtener todos los autores sin paginación
   * @returns Promise con la lista completa de autores
   */
  async getAllAuthors(): Promise<ApiResponse<Author[]>> {
    try {
      const response = await apiService.get<Author[]>('/authors');
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error obteniendo autores');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Crear un nuevo autor
   * @param authorData - Datos del autor a crear
   * @returns Promise con el autor creado
   */
  async createAuthor(authorData: CreateAuthorRequest): Promise<ApiResponse<CreateAuthorResponse>> {
    try {
      // Validaciones básicas
      if (!authorData.nombre || authorData.nombre.trim() === '') {
        throw new Error('El nombre del autor es requerido');
      }
      
      if (!authorData.acerca_de || authorData.acerca_de.trim() === '') {
        throw new Error('La descripción del autor es requerida');
      }
      
      if (!authorData.fechaNacimiento) {
        throw new Error('La fecha de nacimiento es requerida');
      }
      
      if (!authorData.nacionalidad || authorData.nacionalidad.trim() === '') {
        throw new Error('La nacionalidad es requerida');
      }
      
      if (!authorData.foto || authorData.foto.trim() === '') {
        throw new Error('La URL de la foto es requerida');
      }
      
      // Validar formato de fecha
      if (!this.isValidDate(authorData.fechaNacimiento)) {
        throw new Error('El formato de fecha de nacimiento no es válido (YYYY-MM-DD)');
      }
      
      if (authorData.fechaMuerte && !this.isValidDate(authorData.fechaMuerte)) {
        throw new Error('El formato de fecha de muerte no es válido (YYYY-MM-DD)');
      }
      
      const response = await apiService.post<CreateAuthorResponse>('authors', { ...authorData });
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error creando autor');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtener un autor por ID
   * @param id - ID del autor
   * @returns Promise con los datos del autor
   */
  async getAuthorById(id: string): Promise<ApiResponse<Author>> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('ID del autor es requerido');
      }
      
      const response = await apiService.get<Author>(`authors/${id}`);
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error obteniendo autor');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Actualizar un autor existente
   * @param id - ID del autor a actualizar
   * @param authorData - Datos del autor a actualizar
   * @returns Promise con el autor actualizado
   */
  async updateAuthor(id: string, authorData: UpdateAuthorRequest): Promise<ApiResponse<UpdateAuthorResponse>> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('ID del autor es requerido');
      }
      
      // Validar que al menos un campo esté presente
      const hasData = Object.keys(authorData).some(key => {
        const value = authorData[key as keyof UpdateAuthorRequest];
        return value !== undefined && value !== null && value !== '';
      });
      
      if (!hasData) {
        throw new Error('Debe proporcionar al menos un campo para actualizar');
      }
      
      // Validaciones de campos específicos si están presentes
      if (authorData.nombre !== undefined && authorData.nombre.trim() === '') {
        throw new Error('El nombre del autor no puede estar vacío');
      }
      
      if (authorData.acerca_de !== undefined && authorData.acerca_de.trim() === '') {
        throw new Error('La descripción del autor no puede estar vacía');
      }
      
      if (authorData.nacionalidad !== undefined && authorData.nacionalidad.trim() === '') {
        throw new Error('La nacionalidad no puede estar vacía');
      }
      
      if (authorData.foto !== undefined && authorData.foto.trim() === '') {
        throw new Error('La URL de la foto no puede estar vacía');
      }
      
      // Validar formatos de fecha si están presentes
      if (authorData.fechaNacimiento && !this.isValidDate(authorData.fechaNacimiento)) {
        throw new Error('El formato de fecha de nacimiento no es válido (YYYY-MM-DD)');
      }
      
      if (authorData.fechaMuerte && !this.isValidDate(authorData.fechaMuerte)) {
        throw new Error('El formato de fecha de muerte no es válido (YYYY-MM-DD)');
      }
      
      const response = await apiService.patch<UpdateAuthorResponse>(`authors/${id}`, { ...authorData });
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error actualizando autor');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Eliminar un autor
   * @param id - ID del autor a eliminar
   * @returns Promise con confirmación de eliminación
   */
  async deleteAuthor(id: string): Promise<ApiResponse<DeleteAuthorResponse>> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('ID del autor es requerido');
      }
      
      const response = await apiService.delete<DeleteAuthorResponse>(`authors/${id}`);
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error eliminando autor');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Validar formato de fecha (YYYY-MM-DD)
   * @param dateString - Cadena de fecha a validar
   * @returns true si el formato es válido
   */
  private isValidDate(dateString: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
      return false;
    }
    
    const date = new Date(dateString);
    const timestamp = date.getTime();
    
    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
      return false;
    }
    
    return dateString === date.toISOString().split('T')[0];
  }
}

// Exportar instancia única del servicio
const authorManagementService = new AuthorManagementService();
export default authorManagementService;