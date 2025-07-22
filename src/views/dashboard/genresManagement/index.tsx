'use client';

import { useState, useEffect, useCallback } from 'react';
import genresManagementService, { Genre } from "@/services/dashboard/genresManagement/genresManagement.service";
import AddGenre from './addGenres';
import EditGenre from './editGenres';
import DeleteGenre from './deleteGenres';
import CommonTable, { TableColumn } from '@/components/commons/table';
import {
    IconButton,
    Button,
    Box,
    Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CategoryIcon from '@mui/icons-material/Category';

// Definir las columnas de la tabla de géneros
const getGenreColumns = (
    page: number,
    rowsPerPage: number,
    onEditGenre: (genre: Genre) => void,
    onDeleteGenre: (genre: Genre) => void
): TableColumn<Genre>[] => {
    return [
        {
            id: 'index',
            label: 'ID',
            format: (_, __, index) => page * rowsPerPage + (index || 0) + 1
        },
        {
            id: 'nombre',
            label: 'Género',
            format: (value) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CategoryIcon sx={{ 
                        color: '#60a5fa',
                        fontSize: '1.2rem'
                    }} />
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
            id: 'descripcion',
            label: 'Descripción',
            format: (value) => (
                <Typography sx={{ 
                    color: '#9ca3af',
                    fontSize: '0.875rem',
                    maxWidth: '400px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {String(value)}
                </Typography>
            )
        },
        {
            id: 'genero_padre',
            label: 'Género Padre',
            format: (value) => (
                <Typography sx={{ 
                    color: '#9ca3af',
                    fontSize: '0.875rem',
                    fontStyle: value ? 'normal' : 'italic'
                }}>
                    {value ? String(value) : 'Sin género padre'}
                </Typography>
            )
        },
        {
            id: 'actions',
            label: 'Acciones',
            format: (_, genre) => (
                <Box>
                    <IconButton
                        onClick={() => onEditGenre(genre)}
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
                        onClick={() => onDeleteGenre(genre)}
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

export default function GenresManagement() {
    const [genreList, setGenreList] = useState<Genre[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalGenres, setTotalGenres] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Estados para modales
    const [openAddGenre, setOpenAddGenre] = useState(false);
    const [openEditGenre, setOpenEditGenre] = useState(false);
    const [openDeleteGenre, setOpenDeleteGenre] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);

    const loadGenres = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await genresManagementService.getGenres({
                limit: rowsPerPage,
                offset: page * rowsPerPage
            });
            
            if (response.success && response.data) {
                setGenreList(response.data.generos || []);
                setTotalGenres(response.data.total || 0);
            } else {
                setError(response.message || 'Error al cargar géneros');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error de conexión');
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage]);

    useEffect(() => {
        loadGenres();
    }, [loadGenres]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    };

    // Handlers para modales
    const handleOpenAddGenre = () => setOpenAddGenre(true);
    const handleCloseAddGenre = () => setOpenAddGenre(false);

    const handleOpenEditGenre = (genre: Genre) => {
        setSelectedGenre(genre);
        setOpenEditGenre(true);
    };
    const handleCloseEditGenre = () => {
        setSelectedGenre(null);
        setOpenEditGenre(false);
    };

    const handleOpenDeleteGenre = (genre: Genre) => {
        setSelectedGenre(genre);
        setOpenDeleteGenre(true);
    };
    const handleCloseDeleteGenre = () => {
        setSelectedGenre(null);
        setOpenDeleteGenre(false);
    };

    const handleGenreAdded = () => {
        loadGenres();
        handleCloseAddGenre();
    };

    const handleGenreUpdated = () => {
        loadGenres();
        handleCloseEditGenre();
    };

    const handleGenreDeleted = () => {
        loadGenres();
        handleCloseDeleteGenre();
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
                        📚 Gestión de Géneros
                    </Typography>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            color: '#9ca3af',
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                    >
                        Administra los géneros literarios del sistema
                    </Typography>
                </Box>
                
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAddGenre}
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
                    Agregar Género
                </Button>
            </Box>

            <CommonTable<Genre>
                columns={getGenreColumns(page, rowsPerPage, handleOpenEditGenre, handleOpenDeleteGenre)}
                data={genreList}
                loading={loading}
                error={error}
                totalCount={totalGenres}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                getRowKey={(genre) => genre.id}
            />

            {/* Modales */}
            <AddGenre
                open={openAddGenre}
                onClose={handleCloseAddGenre}
                onGenreAdded={handleGenreAdded}
            />

            <EditGenre
                open={openEditGenre}
                genre={selectedGenre}
                onClose={handleCloseEditGenre}
                onGenreUpdated={handleGenreUpdated}
            />

            <DeleteGenre
                open={openDeleteGenre}
                genre={selectedGenre}
                onClose={handleCloseDeleteGenre}
                onGenreDeleted={handleGenreDeleted}
            />
        </Box>
    );
}