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
import tagsManagementService, { Tag, UpdateTagRequest } from '@/services/dashboard/tagsManagement/tagsManagement.service';

interface EditTagProps {
    open: boolean;
    tag: Tag | null;
    onClose: () => void;
    onTagUpdated: () => void;
}

export default function EditTag({ open, tag, onClose, onTagUpdated }: EditTagProps) {
    const [formData, setFormData] = useState<UpdateTagRequest>({
        nombre: '',
        categoria: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar datos del tag cuando se abre el modal
    useEffect(() => {
        if (open && tag) {
            setFormData({
                nombre: tag.nombre || '',
                categoria: tag.categoria || ''
            });
            setError(null);
        }
    }, [open, tag]);

    const handleInputChange = (field: keyof UpdateTagRequest) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        if (error) setError(null);
    };

    const validateForm = (): boolean => {
        if (!formData.nombre?.trim()) {
            setError('El nombre del tag es requerido');
            return false;
        }
        if (!formData.categoria?.trim()) {
            setError('La categoría del tag es requerida');
            return false;
        }
        return true;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!tag || !validateForm()) return;

        try {
            setLoading(true);
            setError(null);

            const requestData: UpdateTagRequest = {
                nombre: formData.nombre?.trim(),
                categoria: formData.categoria?.trim()
            };

            const response = await tagsManagementService.updateTag(tag.id, requestData);
            
            if (response.success) {
                onTagUpdated();
                handleClose();
            } else {
                setError(response.message || 'Error al actualizar el tag');
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
                categoria: ''
            });
            setError(null);
            onClose();
        }
    };

    if (!tag) return null;

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
                    <EditIcon sx={{ color: '#7c3aed' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Editar Tag
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
                            label="Nombre del Tag"
                            value={formData.nombre || ''}
                            onChange={handleInputChange('nombre')}
                            required
                            fullWidth
                            disabled={loading}
                            placeholder="Ej: Aventura, Romance, Misterio..."
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: '#1a1a1a',
                                    '& fieldset': {
                                        borderColor: '#555'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#7c3aed'
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#7c3aed'
                                    },
                                    '&.Mui-error fieldset': {
                                        borderColor: '#555 !important'
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#9ca3af',
                                    '&.Mui-focused': {
                                        color: '#7c3aed'
                                    }
                                },
                                '& .MuiOutlinedInput-input': {
                                    color: '#fff'
                                }
                            }}
                        />

                        <TextField
                            label="Categoría"
                            value={formData.categoria || ''}
                            onChange={handleInputChange('categoria')}
                            required
                            fullWidth
                            disabled={loading}
                            placeholder="Ej: Temática, Género, Estado..."
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: '#1a1a1a',
                                    '& fieldset': {
                                        borderColor: '#555'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#7c3aed'
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#7c3aed'
                                    },
                                    '&.Mui-error fieldset': {
                                        borderColor: '#555 !important'
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#9ca3af',
                                    '&.Mui-focused': {
                                        color: '#7c3aed'
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
                            bgcolor: '#7c3aed',
                            color: '#fff',
                            fontWeight: 600,
                            '&:hover': {
                                bgcolor: '#6d28d9'
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
                            'Actualizar Tag'
                        )}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}