import { apiService, ApiResponse } from '@/services/api.service';

// Interfaces para Book
export interface Book {
  id: string;
  title: string;
  isbn: string;
  description: string;
  publicationYear: number;
  pageCount: number;
  language: string;
  coverImage: string;
  ageRating: string;
  readingDifficulty: string;
  authorIds: string[];
  genreIds: string[];
  tagIds: string[];
  // Objetos completos que vienen del API
  authors?: Array<{ id: string; nombre: string; }>;
  genres?: Array<{ id: string; nombre: string; }>;
  tags?: Array<{ id: string; nombre: string; }>;
  // Campos adicionales del API
  averageRating?: number;
  totalRatings?: number;
  seriesId?: string | null;
  orderInSeries?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

// Interface para crear libro (sin id, createdAt, updatedAt)
export interface CreateBookRequest {
  title: string;
  isbn: string;
  description: string;
  publicationYear: number;
  pageCount: number;
  language: string;
  coverImage: string;
  ageRating: string;
  readingDifficulty: string;
  authorIds: string[];
  genreIds: string[];
  tagIds: string[];
  seriesId?: string | null;
  orderInSeries?: number | null;
}

// Interface para actualizar libro (todos los campos opcionales excepto los que se quieren cambiar)
export interface UpdateBookRequest {
  title?: string;
  isbn?: string;
  description?: string;
  publicationYear?: number;
  pageCount?: number;
  language?: string;
  coverImage?: string;
  ageRating?: string;
  readingDifficulty?: string;
  authorIds?: string[];
  genreIds?: string[];
  tagIds?: string[];
  seriesId?: string | null;
  orderInSeries?: number | null;
}

// Interface para parámetros de listado
export interface ListBooksParams {
  limit?: number;
  offset?: number;
  authorId?: string;
  genreId?: string;
  tagId?: string;
  seriesId?: string;
  language?: string;
  ageRating?: string;
  readingDifficulty?: string;
}

// Interface para respuesta de listado
export interface BooksListResponse {
  books: Book[];
  totalBooks: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Interface para respuesta de creación
export interface CreateBookResponse {
  book: Book;
  message: string;
}

// Interface para respuesta de actualización
export interface UpdateBookResponse {
  book: Book;
  message: string;
}

// Interface para respuesta de eliminación
export interface DeleteBookResponse {
  message: string;
}

// Interface para respuesta de carga masiva
export interface BulkUploadResponse {
  message: string;
  processedBooks: number;
  successfulBooks: number;
  failedBooks: number;
  errors?: Array<{
    bookTitle?: string;
    error: string;
    line?: number;
  }>;
}

// Enums para validaciones
export const AGE_RATINGS = ['0+', '6+', '12+', '16+', '18+'] as const;
export const READING_DIFFICULTIES = ['Fácil', 'Intermedio', 'Avanzado', 'Experto'] as const;
export const LANGUAGES = ['Español', 'Inglés', 'Francés', 'Alemán', 'Italiano', 'Portugués', 'Otro'] as const;

export type AgeRating = typeof AGE_RATINGS[number];
export type ReadingDifficulty = typeof READING_DIFFICULTIES[number];
export type Language = typeof LANGUAGES[number];

/**
 * Servicio para gestión de libros
 * Maneja todas las operaciones CRUD para libros
 */
class BookManagementService {
  /**
   * Obtener lista de libros con paginación y filtros
   * @param params - Parámetros de paginación y filtros
   * @returns Promise con la lista de libros
   */
  async getBooks(params: ListBooksParams = {}): Promise<ApiResponse<BooksListResponse>> {
    try {
      const { limit = 10, offset = 0, ...filters } = params;
      
      // Construir query string con filtros
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString()
      });
      
      // Agregar filtros si están presentes
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
      
      const response = await apiService.get<BooksListResponse>(`books?${queryParams.toString()}`);
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error obteniendo libros');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Crear un nuevo libro
   * @param bookData - Datos del libro a crear
   * @returns Promise con el libro creado
   */
  async createBook(bookData: CreateBookRequest): Promise<ApiResponse<CreateBookResponse>> {
    try {
      // Validaciones básicas
      this.validateBookData(bookData);
      
      const response = await apiService.post<CreateBookResponse>('books', { ...bookData });
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error creando libro');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtener un libro por ID
   * @param id - ID del libro
   * @returns Promise con los datos del libro
   */
  async getBookById(id: string): Promise<ApiResponse<Book>> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('ID del libro es requerido');
      }
      
      const response = await apiService.get<Book>(`books/${id}`);
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error obteniendo libro');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Actualizar un libro existente
   * @param id - ID del libro a actualizar
   * @param bookData - Datos del libro a actualizar
   * @returns Promise con el libro actualizado
   */
  async updateBook(id: string, bookData: UpdateBookRequest): Promise<ApiResponse<UpdateBookResponse>> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('ID del libro es requerido');
      }
      
      // Validar que al menos un campo esté presente
      const hasData = Object.keys(bookData).some(key => {
        const value = bookData[key as keyof UpdateBookRequest];
        return value !== undefined && value !== null && 
               (Array.isArray(value) ? value.length > 0 : value !== '');
      });
      
      if (!hasData) {
        throw new Error('Debe proporcionar al menos un campo para actualizar');
      }
      
      // Validar campos si están presentes
      this.validateBookData(bookData, true);
      
      const response = await apiService.patch<UpdateBookResponse>(`books/${id}`, { ...bookData });
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error actualizando libro');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Eliminar un libro
   * @param id - ID del libro a eliminar
   * @returns Promise con confirmación de eliminación
   */
  async deleteBook(id: string): Promise<ApiResponse<DeleteBookResponse>> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('ID del libro es requerido');
      }
      
      const response = await apiService.delete<DeleteBookResponse>(`books/${id}`);
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error eliminando libro');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Buscar libros por título
   * @param searchTerm - Término de búsqueda
   * @param params - Parámetros de paginación
   * @returns Promise con los libros que coinciden
   */
  async searchBooks(searchTerm: string, params: ListBooksParams = {}): Promise<ApiResponse<BooksListResponse>> {
    try {
      if (!searchTerm || searchTerm.trim() === '') {
        throw new Error('Término de búsqueda es requerido');
      }
      
      const { limit = 10, offset = 0 } = params;
      const response = await apiService.get<BooksListResponse>(
        `books/search?q=${encodeURIComponent(searchTerm.trim())}&limit=${limit}&offset=${offset}`
      );
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Error buscando libros');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  }

  /**
   * Validar datos del libro
   * @param bookData - Datos del libro a validar
   * @param isUpdate - Si es una actualización (campos opcionales)
   */
  private validateBookData(bookData: CreateBookRequest | UpdateBookRequest, isUpdate = false): void {
    // Validaciones para creación (campos requeridos)
    if (!isUpdate) {
      const createData = bookData as CreateBookRequest;
      
      if (!createData.title || createData.title.trim() === '') {
        throw new Error('El título del libro es requerido');
      }
      
      if (!createData.isbn || createData.isbn.trim() === '') {
        throw new Error('El ISBN es requerido');
      }
      
      if (!createData.description || createData.description.trim() === '') {
        throw new Error('La descripción es requerida');
      }
      
      if (!createData.language || createData.language.trim() === '') {
        throw new Error('El idioma es requerido');
      }
      
      if (!createData.ageRating || createData.ageRating.trim() === '') {
        throw new Error('La clasificación por edad es requerida');
      }
      
      if (!createData.readingDifficulty || createData.readingDifficulty.trim() === '') {
        throw new Error('La dificultad de lectura es requerida');
      }
      
      if (!createData.authorIds || createData.authorIds.length === 0) {
        throw new Error('Debe especificar al menos un autor');
      }
      
      if (!createData.genreIds || createData.genreIds.length === 0) {
        throw new Error('Debe especificar al menos un género');
      }
    }
    
    // Validaciones comunes (para creación y actualización)
    if (bookData.title !== undefined) {
      if (bookData.title.trim() === '') {
        throw new Error('El título no puede estar vacío');
      }
      if (bookData.title.trim().length < 1 || bookData.title.trim().length > 200) {
        throw new Error('El título debe tener entre 1 y 200 caracteres');
      }
    }
    
    if (bookData.isbn !== undefined) {
      if (bookData.isbn.trim() === '') {
        throw new Error('El ISBN no puede estar vacío');
      }
      if (!this.isValidISBN(bookData.isbn)) {
        throw new Error('El formato del ISBN no es válido');
      }
    }
    
    if (bookData.description !== undefined) {
      if (bookData.description.trim() === '') {
        throw new Error('La descripción no puede estar vacía');
      }
      if (bookData.description.trim().length < 10 || bookData.description.trim().length > 2000) {
        throw new Error('La descripción debe tener entre 10 y 2000 caracteres');
      }
    }
    
    if (bookData.publicationYear !== undefined) {
      const currentYear = new Date().getFullYear();
      if (bookData.publicationYear < 1000 || bookData.publicationYear > currentYear + 5) {
        throw new Error(`El año de publicación debe estar entre 1000 y ${currentYear + 5}`);
      }
    }
    
    if (bookData.pageCount !== undefined) {
      if (bookData.pageCount < 1 || bookData.pageCount > 10000) {
        throw new Error('El número de páginas debe estar entre 1 y 10000');
      }
    }
    
    if (bookData.language !== undefined) {
      if (!LANGUAGES.includes(bookData.language as Language)) {
        throw new Error(`Idioma no válido. Opciones: ${LANGUAGES.join(', ')}`);
      }
    }
    
    if (bookData.ageRating !== undefined) {
      if (!AGE_RATINGS.includes(bookData.ageRating as AgeRating)) {
        throw new Error(`Clasificación por edad no válida. Opciones: ${AGE_RATINGS.join(', ')}`);
      }
    }
    
    if (bookData.readingDifficulty !== undefined) {
      if (!READING_DIFFICULTIES.includes(bookData.readingDifficulty as ReadingDifficulty)) {
        throw new Error(`Dificultad de lectura no válida. Opciones: ${READING_DIFFICULTIES.join(', ')}`);
      }
    }
    
    if (bookData.coverImage !== undefined) {
      if (bookData.coverImage.trim() === '') {
        throw new Error('La URL de la imagen de portada no puede estar vacía');
      }
      if (!this.isValidURL(bookData.coverImage)) {
        throw new Error('La URL de la imagen de portada no es válida');
      }
    }
    
    if (bookData.authorIds !== undefined) {
      if (!Array.isArray(bookData.authorIds) || bookData.authorIds.length === 0) {
        throw new Error('Debe especificar al menos un autor');
      }
      if (bookData.authorIds.some(id => !id || id.trim() === '')) {
        throw new Error('Todos los IDs de autores deben ser válidos');
      }
    }
    
    if (bookData.genreIds !== undefined) {
      if (!Array.isArray(bookData.genreIds) || bookData.genreIds.length === 0) {
        throw new Error('Debe especificar al menos un género');
      }
      if (bookData.genreIds.some(id => !id || id.trim() === '')) {
        throw new Error('Todos los IDs de géneros deben ser válidos');
      }
    }
    
    if (bookData.tagIds !== undefined) {
      if (!Array.isArray(bookData.tagIds)) {
        throw new Error('Los tags deben ser un array');
      }
      if (bookData.tagIds.some(id => !id || id.trim() === '')) {
        throw new Error('Todos los IDs de tags deben ser válidos');
      }
    }
    
    if (bookData.orderInSeries !== undefined && bookData.orderInSeries !== null) {
      if (bookData.orderInSeries < 1) {
        throw new Error('El orden en la serie debe ser mayor a 0');
      }
      if (!bookData.seriesId) {
        throw new Error('Debe especificar una serie si proporciona un orden en la serie');
      }
    }
  }

  /**
   * Validar formato ISBN
   * @param isbn - ISBN a validar
   * @returns true si el formato es válido
   */
  private isValidISBN(isbn: string): boolean {
    // Remover guiones y espacios
    const cleanISBN = isbn.replace(/[-\s]/g, '');
    
    // Validar ISBN-10 o ISBN-13
    const isbn10Regex = /^\d{9}[\dX]$/;
    const isbn13Regex = /^\d{13}$/;
    
    return isbn10Regex.test(cleanISBN) || isbn13Regex.test(cleanISBN);
  }

  /**
   * Validar formato URL
   * @param url - URL a validar
   * @returns true si el formato es válido
   */
  private isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Subir archivo JSON para carga masiva de libros
   * @param file - Archivo JSON con los datos de los libros
   * @returns Promise con el resultado de la carga masiva
   */
  async uploadBooksFile(file: File): Promise<ApiResponse<BulkUploadResponse>> {
    try {
      // Validar que sea un archivo JSON
      if (!file.type.includes('json') && !file.name.endsWith('.json')) {
        throw new Error('El archivo debe ser de tipo JSON');
      }

      // Validar tamaño del archivo (máximo 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('El archivo es demasiado grande. Tamaño máximo: 10MB');
      }

      const formData = new FormData();
      formData.append('file', file);

      return await apiService.upload<BulkUploadResponse>('/books/enhanced-bulk-file', formData);
    } catch (error) {
      console.error('Error en carga masiva:', error);
      throw error;
    }
  }

  /**
   * Obtener libros destacados basados en puntuaciones
   * @returns Promise con los libros destacados
   */
  async getFeaturedBooks(): Promise<ApiResponse<Book[]>> {
    try {
      return await apiService.get<Book[]>('/books/featured');
    } catch (error) {
      console.error('Error al obtener libros destacados:', error);
      throw error;
    }
  }
}

// Exportar instancia única del servicio
const bookManagementService = new BookManagementService();
export default bookManagementService;