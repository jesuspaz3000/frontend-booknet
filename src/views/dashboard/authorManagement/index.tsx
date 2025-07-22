'use client';

import { useState, useEffect, useCallback } from 'react';
import authorManagementService, { Author } from "@/services/dashboard/authorManagement/authorManagement.service";
import AddAuthor from './addAuthor';
import EditAuthor from './editAuthor';
import DeleteAuthor from './deleteAuthor';
import CommonTable, { TableColumn } from '@/components/commons/table';
import {
    IconButton,
    Avatar,
    Button,
    Box,
    Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';

// Definir las columnas de la tabla de autores
const getAuthorColumns = (
    page: number,
    rowsPerPage: number,
    onEditAuthor: (author: Author) => void,
    onDeleteAuthor: (author: Author) => void
): TableColumn<Author>[] => {
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-ES');
    };

    const calculateAge = (birthDate: string, deathDate?: string | null) => {
        if (!birthDate) return 'N/A';
        const birth = new Date(birthDate);
        const end = deathDate ? new Date(deathDate) : new Date();
        const age = end.getFullYear() - birth.getFullYear();
        return deathDate ? `${age} años (fallecido)` : `${age} años`;
    };

    return [
        {
            id: 'index',
            label: 'ID',
            format: (_, __, index) => page * rowsPerPage + (index || 0) + 1
        },
        {
            id: 'nombre',
            label: 'Autor',
            format: (value, author) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                        src={author.foto} 
                        sx={{ 
                            backgroundColor: '#60a5fa',
                            color: '#1a1a1a',
                            width: 40,
                            height: 40
                        }}
                    >
                        <PersonIcon sx={{ fontSize: '1.2rem' }} />
                    </Avatar>
                    <Typography sx={{ 
                        color: '#fff', 
                        fontWeight: 500,
                        fontSize: '0.875rem'
                    }}>
                        {String(value)}
                    </Typography>
                </Box>
            )
        },
        {
            id: 'nacionalidad',
            label: 'Nacionalidad',
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
            id: 'edad',
            label: 'Edad',
            format: (value, author) => (
                <Typography sx={{ 
                    color: '#9ca3af',
                    fontSize: '0.875rem'
                }}>
                    {calculateAge(author.fechaNacimiento, author.fechaMuerte)}
                </Typography>
            )
        },
        {
            id: 'cantidad_de_libros',
            label: 'Libros',
            format: (value, author) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ 
                        color: '#60a5fa',
                        fontSize: '0.875rem',
                        fontWeight: 600
                    }}>
                        {author.cantidad_de_libros || 0}
                    </Typography>
                    <Typography sx={{ 
                        color: '#9ca3af',
                        fontSize: '0.75rem'
                    }}>
                        {author.cantidad_de_libros === 1 ? 'libro' : 'libros'}
                    </Typography>
                </Box>
            )
        },
        {
            id: 'acerca_de',
            label: 'Descripción',
            format: (value) => (
                <Typography sx={{ 
                    color: '#9ca3af',
                    fontSize: '0.875rem',
                    maxWidth: '300px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {String(value)}
                </Typography>
            )
        },
        {
            id: 'fecha_nacimiento',
            label: 'Fecha de Nacimiento',
            format: (value, author) => (
                <Typography sx={{ 
                    color: '#9ca3af',
                    fontSize: '0.875rem'
                }}>
                    {formatDate(author.fechaNacimiento)}
                </Typography>
            )
        },
        {
            id: 'actions',
            label: 'Acciones',
            format: (_, author) => (
                <Box>
                    <IconButton
                        onClick={() => onEditAuthor(author)}
                        sx={{ 
                            color: '#60a5fa', 
                            '&:hover': { 
                                color: '#3b82f6',
                                backgroundColor: 'rgba(96, 165, 250, 0.1)'
                            },
                            mr: 1
                        }}
                    >
                        <EditIcon sx={{ fontSize: '1.1rem' }} />
                    </IconButton>
                    <IconButton
                        onClick={() => onDeleteAuthor(author)}
                        sx={{ 
                            color: '#ef4444', 
                            '&:hover': { 
                                color: '#dc2626',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)'
                            }
                        }}
                    >
                        <DeleteIcon sx={{ fontSize: '1.1rem' }} />
                    </IconButton>
                </Box>
            )
        }
    ];
};

export default function AuthorManagement() {
    const [authorList, setAuthorList] = useState<Author[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalAuthors, setTotalAuthors] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    
    // Estados para modales
    const [addAuthorOpen, setAddAuthorOpen] = useState(false);
    const [editAuthorOpen, setEditAuthorOpen] = useState(false);
    const [deleteAuthorOpen, setDeleteAuthorOpen] = useState(false);
    const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);
    const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

    // Función para cargar autores
    const loadAuthors = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const offset = page * rowsPerPage;
            const response = await authorManagementService.getAuthors({
                limit: rowsPerPage,
                offset: offset
            });
            
            if (response.success && response.data) {
                setAuthorList(response.data.autores);
                setTotalAuthors(response.data.totalAutores);
            } else {
                setError(response.message || 'Error al cargar autores');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error de conexión');
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage]);

    // Cargar autores al montar el componente y cuando cambien page o rowsPerPage
    useEffect(() => {
        loadAuthors();
    }, [loadAuthors]);

    // Handlers para paginación
    const handleChangePage = useCallback((event: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    // Handlers para modales
    const handleOpenAddAuthor = () => setAddAuthorOpen(true);
    const handleCloseAddAuthor = () => setAddAuthorOpen(false);

    const handleOpenEditAuthor = (author: Author) => {
        setSelectedAuthorId(author.id);
        setEditAuthorOpen(true);
    };
    const handleCloseEditAuthor = () => {
        setEditAuthorOpen(false);
        setSelectedAuthorId(null);
    };

    const handleOpenDeleteAuthor = (author: Author) => {
        setSelectedAuthor(author);
        setDeleteAuthorOpen(true);
    };
    const handleCloseDeleteAuthor = () => {
        setDeleteAuthorOpen(false);
        setSelectedAuthor(null);
    };

    // Handlers para refrescar la tabla después de operaciones CRUD
    const handleAuthorAdded = () => {
        loadAuthors();
        handleCloseAddAuthor();
    };

    const handleAuthorUpdated = () => {
        loadAuthors();
        handleCloseEditAuthor();
    };

    const handleAuthorDeleted = () => {
        loadAuthors();
        handleCloseDeleteAuthor();
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
                        👤 Gestión de Autores
                    </Typography>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            color: '#9ca3af',
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                    >
                        Administra los autores de libros en el sistema
                    </Typography>
                </Box>
                
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAddAuthor}
                    sx={{
                        backgroundColor: '#60a5fa',
                        color: '#1a1a1a',
                        fontWeight: 600,
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        '&:hover': { 
                            backgroundColor: '#3b82f6',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(96, 165, 250, 0.3)'
                        },
                        transition: 'all 0.2s ease'
                    }}
                >
                    Agregar Autor
                </Button>
            </Box>

            <CommonTable<Author>
                columns={getAuthorColumns(page, rowsPerPage, handleOpenEditAuthor, handleOpenDeleteAuthor)}
                data={authorList}
                loading={loading}
                error={error}
                totalCount={totalAuthors}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                getRowKey={(author) => author.id.toString()}
                emptyMessage="No hay autores disponibles"
            />

            {/* Modales para agregar, editar y eliminar autores */}
            <AddAuthor
                open={addAuthorOpen}
                onClose={handleCloseAddAuthor}
                onAuthorAdded={handleAuthorAdded}
            />
            
            <EditAuthor
                open={editAuthorOpen}
                authorId={selectedAuthorId}
                onClose={handleCloseEditAuthor}
                onAuthorUpdated={handleAuthorUpdated}
            />
            
            <DeleteAuthor
                open={deleteAuthorOpen}
                author={selectedAuthor}
                onClose={handleCloseDeleteAuthor}
                onAuthorDeleted={handleAuthorDeleted}
            />
        </Box>
    );
}