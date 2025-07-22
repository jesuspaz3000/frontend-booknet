'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    CircularProgress,
    Alert,
    IconButton,
    Divider
} from '@mui/material';
import {
    Close as CloseIcon,
    Delete as DeleteIcon,
    Warning as WarningIcon,
    Category as CategoryIcon
} from '@mui/icons-material';
import genresManagementService, { Genre } from '@/services/dashboard/genresManagement/genresManagement.service';

interface DeleteGenreProps {
    open: boolean;
    genre: Genre | null;
    onClose: () => void;
    onGenreDeleted: () => void;
}

export default function DeleteGenre({ open, genre, onClose, onGenreDeleted }: DeleteGenreProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!genre) return;

        try {
            setLoading(true);
            setError(null);

            const response = await genresManagementService.deleteGenre(genre.id);
            
            if (response.success) {
                onGenreDeleted();
                handleClose();
            } else {
                setError(response.message || 'Error al eliminar el género');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setError(null);
            onClose();
        }
    };

    if (!genre) return null;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: '#2d2d2d',
                    color: '#fff',
                    borderRadius: 2
                }
            }}
        >
            <DialogTitle sx={{ 
                bgcolor: '#2d2d2d', 
                color: '#fff',
                borderBottom: '1px solid #555',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pb: 2
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <DeleteIcon sx={{ color: '#ef4444' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Eliminar Género
                    </Typography>
                </Box>
                <IconButton
                    onClick={handleClose}
                    disabled={loading}
                    sx={{ 
                        color: '#9ca3af',
                        '&:hover': { 
                            color: '#fff',
                            bgcolor: 'rgba(255, 255, 255, 0.1)' 
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ bgcolor: '#2d2d2d', pt: 3 }}>
                {error && (
                    <Alert 
                        severity="error" 
                        sx={{ 
                            mb: 3,
                            bgcolor: 'rgba(239, 68, 68, 0.1)',
                            color: '#fca5a5',
                            '& .MuiAlert-icon': {
                                color: '#ef4444'
                            }
                        }}
                    >
                        {error}
                    </Alert>
                )}

                {/* Advertencia */}
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2, 
                    mb: 3,
                    p: 2,
                    bgcolor: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: 1,
                    border: '1px solid rgba(245, 158, 11, 0.3)'
                }}>
                    <WarningIcon sx={{ color: '#f59e0b', fontSize: '2rem' }} />
                    <Box>
                        <Typography variant="subtitle1" sx={{ color: '#fbbf24', fontWeight: 600 }}>
                            ¡Atención!
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#fcd34d' }}>
                            Esta acción no se puede deshacer. El género será eliminado permanentemente.
                        </Typography>
                    </Box>
                </Box>

                {/* Información del género */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ color: '#9ca3af', mb: 2 }}>
                        ¿Estás seguro de que deseas eliminar el siguiente género?
                    </Typography>
                    
                    <Box sx={{ 
                        bgcolor: '#1a1a1a', 
                        p: 3, 
                        borderRadius: 2,
                        border: '1px solid #374151'
                    }}>
                        {/* Nombre del género */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <CategoryIcon sx={{ color: '#60a5fa', fontSize: '1.5rem' }} />
                            <Box>
                                <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                                    Género
                                </Typography>
                                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                                    {genre.nombre}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ bgcolor: '#374151', my: 2 }} />

                        {/* Descripción */}
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: '0.75rem', mb: 1 }}>
                                Descripción
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#d1d5db' }}>
                                {genre.descripcion}
                            </Typography>
                        </Box>

                        {/* Género padre */}
                        {genre.genero_padre && (
                            <Box>
                                <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: '0.75rem', mb: 1 }}>
                                    Género Padre
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#d1d5db' }}>
                                    {genre.genero_padre}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ 
                bgcolor: '#2d2d2d', 
                borderTop: '1px solid #555',
                p: 3,
                gap: 2
            }}>
                <Button
                    onClick={handleClose}
                    disabled={loading}
                    sx={{
                        color: '#9ca3af',
                        borderColor: '#555',
                        '&:hover': {
                            borderColor: '#9ca3af',
                            bgcolor: 'rgba(156, 163, 175, 0.1)'
                        }
                    }}
                    variant="outlined"
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleDelete}
                    disabled={loading}
                    variant="contained"
                    sx={{
                        bgcolor: '#ef4444',
                        color: '#fff',
                        fontWeight: 600,
                        '&:hover': {
                            bgcolor: '#dc2626'
                        },
                        '&:disabled': {
                            bgcolor: '#374151',
                            color: '#6b7280'
                        }
                    }}
                >
                    {loading ? (
                        <>
                            <CircularProgress size={20} sx={{ mr: 1, color: '#6b7280' }} />
                            Eliminando...
                        </>
                    ) : (
                        'Eliminar Género'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
}