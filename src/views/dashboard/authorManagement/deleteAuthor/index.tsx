'use client';

import { useState } from 'react';
import authorManagementService, { Author } from '@/services/dashboard/authorManagement/authorManagement.service';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Box,
    Avatar
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import WarningIcon from '@mui/icons-material/Warning';

interface DeleteAuthorProps {
    open: boolean;
    author: Author | null;
    onClose: () => void;
    onAuthorDeleted: () => void;
}

export default function DeleteAuthor({ open, author, onClose, onAuthorDeleted }: DeleteAuthorProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!author) return;

        try {
            setLoading(true);
            setError(null);

            const response = await authorManagementService.deleteAuthor(author.id);
            
            if (response.success) {
                onAuthorDeleted();
                handleClose();
            } else {
                setError(response.message || 'Error al eliminar el autor');
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

    if (!author) return null;

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    bgcolor: '#1a1a1a',
                    color: '#fff',
                    border: '1px solid #333'
                }
            }}
        >
            <DialogTitle sx={{ 
                bgcolor: '#2d2d2d', 
                color: '#ef4444',
                fontWeight: 'bold',
                borderBottom: '1px solid #333',
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <WarningIcon sx={{ color: '#ef4444' }} />
                Eliminar Autor
            </DialogTitle>
            
            <DialogContent sx={{ bgcolor: '#1a1a1a', py: 3 }}>
                {error && (
                    <Alert 
                        severity="error" 
                        sx={{ 
                            mb: 3,
                            bgcolor: '#7f1d1d',
                            color: '#fecaca',
                            '& .MuiAlert-icon': {
                                color: '#ef4444'
                            }
                        }}
                    >
                        {error}
                    </Alert>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    {/* Avatar del autor */}
                    <Avatar 
                        src={author.foto} 
                        sx={{ 
                            width: 80,
                            height: 80,
                            bgcolor: '#ef4444',
                            color: '#fff'
                        }}
                    >
                        <PersonIcon sx={{ fontSize: '2rem' }} />
                    </Avatar>

                    {/* Información del autor */}
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                color: '#fff', 
                                fontWeight: 600,
                                mb: 1
                            }}
                        >
                            {author.nombre}
                        </Typography>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                color: '#9ca3af',
                                mb: 2
                            }}
                        >
                            {author.nacionalidad}
                        </Typography>
                    </Box>

                    {/* Mensaje de advertencia */}
                    <Box 
                        sx={{ 
                            bgcolor: '#7f1d1d',
                            border: '1px solid #ef4444',
                            borderRadius: 2,
                            p: 3,
                            width: '100%'
                        }}
                    >
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                color: '#fecaca',
                                textAlign: 'center',
                                fontWeight: 500
                            }}
                        >
                            ¿Estás seguro de que deseas eliminar este autor?
                        </Typography>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                color: '#fca5a5',
                                textAlign: 'center',
                                mt: 1
                            }}
                        >
                            Esta acción no se puede deshacer. Se eliminará permanentemente el autor y toda su información asociada.
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>
            
            <DialogActions sx={{ 
                bgcolor: '#2d2d2d', 
                borderTop: '1px solid #333',
                px: 3,
                py: 2
            }}>
                <Button
                    onClick={handleClose}
                    disabled={loading}
                    sx={{
                        color: '#9ca3af',
                        borderColor: '#555',
                        '&:hover': {
                            borderColor: '#60a5fa',
                            color: '#60a5fa',
                            bgcolor: 'rgba(96, 165, 250, 0.1)'
                        },
                        transition: 'all 0.2s ease'
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
                            bgcolor: '#dc2626',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                        },
                        '&:disabled': {
                            bgcolor: '#374151',
                            color: '#6b7280'
                        },
                        transition: 'all 0.2s ease'
                    }}
                >
                    {loading ? (
                        <>
                            <CircularProgress size={20} sx={{ color: '#6b7280', mr: 1 }} />
                            Eliminando...
                        </>
                    ) : (
                        'Eliminar Autor'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
}