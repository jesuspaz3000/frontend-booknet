'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    CircularProgress,
    Alert,
    IconButton
} from '@mui/material';
import {
    Close as CloseIcon,
    Edit as EditIcon
} from '@mui/icons-material';
import genresManagementService, { Genre, UpdateGenreRequest } from '@/services/dashboard/genresManagement/genresManagement.service';

interface EditGenreProps {
    open: boolean;
    genre: Genre | null;
    onClose: () => void;
    onGenreUpdated: () => void;
}

export default function EditGenre({ open, genre, onClose, onGenreUpdated }: EditGenreProps) {
    const [formData, setFormData] = useState<UpdateGenreRequest>({
        nombre: '',
        descripcion: '',
        genero_padre: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar datos del género cuando se abre el modal
    useEffect(() => {
        if (open && genre) {
            setFormData({
                nombre: genre.nombre || '',
                descripcion: genre.descripcion || '',
                genero_padre: genre.genero_padre || null
            });
            setError(null);
        }
    }, [open, genre]);

    const handleInputChange = (field: keyof UpdateGenreRequest) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: field === 'genero_padre' && value === '' ? null : value
        }));
        if (error) setError(null);
    };

    const validateForm = (): boolean => {
        if (!formData.nombre?.trim()) {
            setError('El nombre del género es requerido');
            return false;
        }
        if (!formData.descripcion?.trim()) {
            setError('La descripción del género es requerida');
            return false;
        }
        return true;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!genre || !validateForm()) return;

        try {
            setLoading(true);
            setError(null);

            const requestData: UpdateGenreRequest = {
                nombre: formData.nombre?.trim(),
                descripcion: formData.descripcion?.trim(),
                genero_padre: formData.genero_padre?.trim() || null
            };

            const response = await genresManagementService.updateGenre(genre.id, requestData);
            
            if (response.success) {
                onGenreUpdated();
                handleClose();
            } else {
                setError(response.message || 'Error al actualizar el género');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setFormData({
                nombre: '',
                descripcion: '',
                genero_padre: null
            });
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
                    <EditIcon sx={{ color: '#60a5fa' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Editar Género
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

            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ bgcolor: '#2d2d2d', pt: 3 }}>
                    {error && (
                        <Alert 
                            severity="error" 
                            sx={{ 
                                mb: 2,
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

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            label="Nombre del Género"
                            value={formData.nombre || ''}
                            onChange={handleInputChange('nombre')}
                            required
                            fullWidth
                            disabled={loading}
                            placeholder="Ej: Ciencia Ficción, Romance, Terror..."
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: '#1a1a1a',
                                    '& fieldset': {
                                        borderColor: '#555'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#60a5fa'
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#60a5fa'
                                    },
                                    '&.Mui-error fieldset': {
                                        borderColor: '#555 !important'
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#9ca3af',
                                    '&.Mui-focused': {
                                        color: '#60a5fa'
                                    }
                                },
                                '& .MuiOutlinedInput-input': {
                                    color: '#fff'
                                }
                            }}
                        />

                        <TextField
                            label="Descripción"
                            value={formData.descripcion || ''}
                            onChange={handleInputChange('descripcion')}
                            required
                            fullWidth
                            multiline
                            rows={3}
                            disabled={loading}
                            placeholder="Describe las características principales de este género literario..."
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: '#1a1a1a',
                                    '& fieldset': {
                                        borderColor: '#555'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#60a5fa'
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#60a5fa'
                                    },
                                    '&.Mui-error fieldset': {
                                        borderColor: '#555 !important'
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#9ca3af',
                                    '&.Mui-focused': {
                                        color: '#60a5fa'
                                    }
                                },
                                '& .MuiOutlinedInput-input': {
                                    color: '#fff'
                                }
                            }}
                        />

                        <TextField
                            label="Género Padre (Opcional)"
                            value={formData.genero_padre || ''}
                            onChange={handleInputChange('genero_padre')}
                            fullWidth
                            disabled={loading}
                            placeholder="Ej: Ficción, No Ficción... (opcional)"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: '#1a1a1a',
                                    '& fieldset': {
                                        borderColor: '#555'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#60a5fa'
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#60a5fa'
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#9ca3af',
                                    '&.Mui-focused': {
                                        color: '#60a5fa'
                                    }
                                },
                                '& .MuiOutlinedInput-input': {
                                    color: '#fff'
                                }
                            }}
                        />
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
                        type="submit"
                        disabled={loading}
                        variant="contained"
                        sx={{
                            bgcolor: '#60a5fa',
                            color: '#1a1a1a',
                            fontWeight: 600,
                            '&:hover': {
                                bgcolor: '#3b82f6'
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
                                Actualizando...
                            </>
                        ) : (
                            'Actualizar Género'
                        )}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}