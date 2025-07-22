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
    Divider,
    Chip
} from '@mui/material';
import {
    Close as CloseIcon,
    Delete as DeleteIcon,
    Warning as WarningIcon,
    LocalOffer as TagIcon
} from '@mui/icons-material';
import tagsManagementService, { Tag } from '@/services/dashboard/tagsManagement/tagsManagement.service';

interface DeleteTagProps {
    open: boolean;
    tag: Tag | null;
    onClose: () => void;
    onTagDeleted: () => void;
}

export default function DeleteTag({ open, tag, onClose, onTagDeleted }: DeleteTagProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!tag) return;

        try {
            setLoading(true);
            setError(null);

            const response = await tagsManagementService.deleteTag(tag.id);
            
            if (response.success) {
                onTagDeleted();
                handleClose();
            } else {
                setError(response.message || 'Error al eliminar el tag');
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
                    <DeleteIcon sx={{ color: '#ef4444' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Eliminar Tag
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
                            Esta acción no se puede deshacer. El tag será eliminado permanentemente.
                        </Typography>
                    </Box>
                </Box>

                {/* Información del tag */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ color: '#9ca3af', mb: 2 }}>
                        ¿Estás seguro de que deseas eliminar el siguiente tag?
                    </Typography>
                    
                    <Box sx={{ 
                        bgcolor: '#1a1a1a', 
                        p: 3, 
                        borderRadius: 2,
                        border: '1px solid #374151'
                    }}>
                        {/* Nombre del tag */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <TagIcon sx={{ color: '#7c3aed', fontSize: '1.5rem' }} />
                            <Box>
                                <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                                    Tag
                                </Typography>
                                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                                    {tag.nombre}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ bgcolor: '#374151', my: 2 }} />

                        {/* Categoría */}
                        <Box>
                            <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: '0.75rem', mb: 1 }}>
                                Categoría
                            </Typography>
                            <Chip
                                label={tag.categoria}
                                size="small"
                                sx={{
                                    bgcolor: '#7c3aed',
                                    color: '#fff',
                                    fontWeight: 500,
                                    fontSize: '0.75rem'
                                }}
                            />
                        </Box>
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
                        'Eliminar Tag'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
}