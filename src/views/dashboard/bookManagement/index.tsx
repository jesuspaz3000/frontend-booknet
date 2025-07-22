'use client';

import { useState, useEffect, useCallback } from 'react';
import bookManagementService, { Book } from "@/services/dashboard/bookManagement/bookManagement.service";
import AddBook from './addBook';
import EditBook from './editBook';
import DeleteBook from './deleteBook';
import BulkUpload from './bulkUpload';
import CommonTable, { TableColumn } from '@/components/commons/table';
import {
    IconButton,
    Button,
    Box,
    Typography,
    Avatar,
    Chip,
    Rating
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MenuBookIcon from '@mui/icons-material/MenuBook';

// Definir las columnas de la tabla de libros
const getBookColumns = (
    page: number,
    rowsPerPage: number,
    onEditBook: (book: Book) => void,
    onDeleteBook: (book: Book) => void
): TableColumn<Book>[] => {
    return [
        {
            id: 'index',
            label: 'ID',
            format: (_, __, index) => page * rowsPerPage + (index || 0) + 1
        },
        {
            id: 'title',
            label: 'Libro',
            format: (value, book) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                        src={book.coverImage} 
                        sx={{ 
                            backgroundColor: '#ef4444',
                            color: '#fff',
                            width: 40,
                            height: 40
                        }}
                    >
                        <MenuBookIcon sx={{ fontSize: '1.2rem' }} />
                    </Avatar>
                    <Box>
                        <Typography sx={{ 
                            color: '#fff', 
                            fontWeight: 500,
                            fontSize: '0.875rem'
                        }}>
                            {String(value)}
                        </Typography>
                        <Typography sx={{ 
                            color: '#9ca3af',
                            fontSize: '0.75rem'
                        }}>
                            {book.isbn}
                        </Typography>
                    </Box>
                </Box>
            )
        },
        {
            id: 'authors',
            label: 'Autor(es)',
            format: (value, book) => (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {book.authors && book.authors.length > 0 ? (
                        book.authors.slice(0, 2).map((author) => (
                            <Typography key={author.id} sx={{ 
                                color: '#9ca3af',
                                fontSize: '0.75rem'
                            }}>
                                {author.nombre}
                            </Typography>
                        ))
                    ) : (
                        <Typography sx={{ 
                            color: '#9ca3af',
                            fontSize: '0.75rem',
                            fontStyle: 'italic'
                        }}>
                            Sin autor
                        </Typography>
                    )}
                    {book.authors && book.authors.length > 2 && (
                        <Typography sx={{ 
                            color: '#60a5fa',
                            fontSize: '0.75rem'
                        }}>
                            +{book.authors.length - 2} más
                        </Typography>
                    )}
                </Box>
            )
        },
        {
            id: 'genres',
            label: 'Géneros',
            format: (value, book) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: '150px' }}>
                    {book.genres && book.genres.length > 0 ? (
                        book.genres.slice(0, 2).map((genre) => (
                            <Chip
                                key={genre.id}
                                label={genre.nombre}
                                size="small"
                                sx={{
                                    bgcolor: '#60a5fa',
                                    color: '#fff',
                                    fontSize: '0.65rem',
                                    height: '20px'
                                }}
                            />
                        ))
                    ) : (
                        <Typography sx={{ 
                            color: '#9ca3af',
                            fontSize: '0.75rem',
                            fontStyle: 'italic'
                        }}>
                            Sin género
                        </Typography>
                    )}
                    {book.genres && book.genres.length > 2 && (
                        <Typography sx={{ 
                            color: '#60a5fa',
                            fontSize: '0.65rem'
                        }}>
                            +{book.genres.length - 2}
                        </Typography>
                    )}
                </Box>
            )
        },
        {
            id: 'publicationYear',
            label: 'Año',
            format: (value) => (
                <Typography sx={{ 
                    color: '#9ca3af',
                    fontSize: '0.875rem'
                }}>
                    {String(value)}
                </Typography>
            )
        },
        {
            id: 'averageRating',
            label: 'Valoración',
            format: (value, book) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating 
                        value={Number(value) || 0} 
                        readOnly 
                        size="small"
                        sx={{
                            '& .MuiRating-iconFilled': {
                                color: '#fbbf24'
                            },
                            '& .MuiRating-iconEmpty': {
                                color: '#374151'
                            }
                        }}
                    />
                    <Typography sx={{ 
                        color: '#9ca3af',
                        fontSize: '0.75rem'
                    }}>
                        ({book.totalRatings || 0})
                    </Typography>
                </Box>
            )
        },
        {
            id: 'language',
            label: 'Idioma',
            format: (value) => (
                <Typography sx={{ 
                    color: '#9ca3af',
                    fontSize: '0.875rem'
                }}>
                    {String(value)}
                </Typography>
            )
        },
        {
            id: 'actions',
            label: 'Acciones',
            format: (_, book) => (
                <Box>
                    <IconButton
                        onClick={() => onEditBook(book)}
                        sx={{
                            color: '#60a5fa',
                            '&:hover': {
                                bgcolor: 'rgba(96, 165, 250, 0.1)',
                                transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease'
                        }}
                        size="small"
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        onClick={() => onDeleteBook(book)}
                        sx={{
                            color: '#ef4444',
                            '&:hover': {
                                bgcolor: 'rgba(239, 68, 68, 0.1)',
                                transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease'
                        }}
                        size="small"
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            )
        }
    ];
};

export default function BookManagement() {
    const [bookList, setBookList] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalBooks, setTotalBooks] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Estados para modales
    const [openAddBook, setOpenAddBook] = useState(false);
    const [openEditBook, setOpenEditBook] = useState(false);
    const [openDeleteBook, setOpenDeleteBook] = useState(false);
    const [openBulkUpload, setOpenBulkUpload] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    const loadBooks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await bookManagementService.getBooks({
                limit: rowsPerPage,
                offset: page * rowsPerPage
            });
            
            if (response.success && response.data) {
                setBookList(response.data.books || []);
                setTotalBooks(response.data.totalBooks || 0);
            } else {
                setError(response.message || 'Error al cargar libros');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error de conexión');
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage]);

    useEffect(() => {
        loadBooks();
    }, [loadBooks]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    };

    // Handlers para modales
    const handleOpenAddBook = () => setOpenAddBook(true);
    const handleCloseAddBook = () => setOpenAddBook(false);

    const handleOpenEditBook = (book: Book) => {
        setSelectedBook(book);
        setOpenEditBook(true);
    };
    const handleCloseEditBook = () => {
        setSelectedBook(null);
        setOpenEditBook(false);
    };

    const handleOpenDeleteBook = (book: Book) => {
        setSelectedBook(book);
        setOpenDeleteBook(true);
    };
    const handleCloseDeleteBook = () => {
        setSelectedBook(null);
        setOpenDeleteBook(false);
    };

    const handleBookAdded = () => {
        loadBooks();
        handleCloseAddBook();
    };

    const handleBookUpdated = () => {
        loadBooks();
        handleCloseEditBook();
    };

    const handleBookDeleted = () => {
        loadBooks();
        handleCloseDeleteBook();
    };

    const handleOpenBulkUpload = () => setOpenBulkUpload(true);
    const handleCloseBulkUpload = () => setOpenBulkUpload(false);

    const handleBulkUploadComplete = () => {
        loadBooks();
        // No cerramos el modal automáticamente para que el usuario vea los resultados
    };

    return (
        <Box sx={{ 
            p: { xs: 2, sm: 3, md: 4 }, 
            bgcolor: '#000', 
            minHeight: '100vh',
            height: '100%',
            color: '#fff'
        }}>
            {/* Header */}
            <Box sx={{ 
                mb: 4, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2
            }}>
                <Box>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            fontWeight: 'bold', 
                            color: '#fff', 
                            mb: 1,
                            fontSize: { xs: '1.5rem', sm: '2rem' }
                        }}
                    >
                        📚 Gestión de Libros
                    </Typography>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            color: '#9ca3af',
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                    >
                        Administra el catálogo de libros del sistema
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenAddBook}
                        sx={{
                            backgroundColor: '#ef4444',
                            color: '#fff',
                            fontWeight: 600,
                            px: 3,
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: 'none',
                            '&:hover': { 
                                backgroundColor: '#dc2626',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                            },
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Agregar Libro
                    </Button>
                    
                    <Button
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        onClick={handleOpenBulkUpload}
                        sx={{
                            borderColor: '#ef4444',
                            color: '#ef4444',
                            fontWeight: 600,
                            px: 3,
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: 'none',
                            '&:hover': { 
                                borderColor: '#dc2626',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                color: '#dc2626',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                            },
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Carga Masiva
                    </Button>
                </Box>
            </Box>

            <CommonTable<Book>
                columns={getBookColumns(page, rowsPerPage, handleOpenEditBook, handleOpenDeleteBook)}
                data={bookList}
                loading={loading}
                error={error}
                totalCount={totalBooks}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                getRowKey={(book) => book.id}
            />

            {/* Modales */}
            <AddBook
                open={openAddBook}
                onClose={handleCloseAddBook}
                onBookAdded={handleBookAdded}
            />

            <EditBook
                open={openEditBook}
                book={selectedBook}
                onClose={handleCloseEditBook}
                onBookUpdated={handleBookUpdated}
            />

            <DeleteBook
                open={openDeleteBook}
                book={selectedBook}
                onClose={handleCloseDeleteBook}
                onBookDeleted={handleBookDeleted}
            />

            <BulkUpload
                open={openBulkUpload}
                onClose={handleCloseBulkUpload}
                onUploadComplete={handleBulkUploadComplete}
            />
        </Box>
    );
}