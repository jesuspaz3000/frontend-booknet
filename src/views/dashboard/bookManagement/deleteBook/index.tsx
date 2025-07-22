'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Chip,
    Avatar
} from '@mui/material';
import {
    Warning as WarningIcon,
    MenuBook as BookIcon
} from '@mui/icons-material';
import bookManagementService, { Book } from '@/services/dashboard/bookManagement/bookManagement.service';

interface DeleteBookProps {
    open: boolean;
    book: Book | null;
    onClose: () => void;
    onBookDeleted: () => void;
}

export default function DeleteBook({ open, book, onClose, onBookDeleted }: DeleteBookProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!book) return;

        setLoading(true);
        setError(null);

        try {
            const response = await bookManagementService.deleteBook(book.id);
            
            if (response.success) {
                onBookDeleted();
                handleClose();
            } else {
                setError(response.message || 'Error al eliminar el libro');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError(null);
        onClose();
    };

    if (!book) return null;

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: '#1a1a1a',
                    color: '#fff',
                    border: '1px solid #333'
                }
            }}
        >
            <DialogTitle sx={{ 
                borderBottom: '1px solid #333', 
                color: '#fff',
                fontSize: '1.25rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 2
            }}>
                <WarningIcon sx={{ color: '#ef4444', fontSize: '1.5rem' }} />
                Eliminar Libro
            </DialogTitle>
            
            <DialogContent sx={{ pt: 3 }}>
                <Box sx={{ mb: 3 }}>
                    <Alert 
                        severity="warning" 
                        sx={{
                            bgcolor: 'rgba(245, 158, 11, 0.1)',
                            color: '#f59e0b',
                            border: '1px solid rgba(245, 158, 11, 0.2)',
                            '& .MuiAlert-icon': { color: '#f59e0b' }
                        }}
                    >
                        Esta acción no se puede deshacer. El libro será eliminado permanentemente del sistema.
                    </Alert>
                </Box>

                <Box sx={{ 
                    bgcolor: '#2a2a2a', 
                    p: 3, 
                    borderRadius: 2, 
                    border: '1px solid #374151'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar 
                            src={book.coverImage} 
                            sx={{ 
                                backgroundColor: '#ef4444',
                                color: '#fff',
                                width: 56,
                                height: 56
                            }}
                        >
                            <BookIcon sx={{ fontSize: '1.5rem' }} />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    color: '#fff', 
                                    fontWeight: 600,
                                    mb: 0.5
                                }}
                            >
                                {book.title}
                            </Typography>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: '#9ca3af',
                                    mb: 1
                                }}
                            >
                                ISBN: {book.isbn}
                            </Typography>
                            {book.authors && book.authors.length > 0 && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                                        Autor(es):
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {book.authors.slice(0, 3).map((author) => (
                                            <Chip
                                                key={author.id}
                                                label={author.nombre}
                                                size="small"
                                                sx={{
                                                    bgcolor: '#ef4444',
                                                    color: '#fff',
                                                    fontSize: '0.65rem',
                                                    height: '20px'
                                                }}
                                            />
                                        ))}
                                        {book.authors.length > 3 && (
                                            <Typography sx={{ 
                                                color: '#60a5fa',
                                                fontSize: '0.75rem'
                                            }}>
                                                +{book.authors.length - 3} más
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            )}
                            {book.genres && book.genres.length > 0 && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                                        Géneros:
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {book.genres.slice(0, 3).map((genre) => (
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
                                        ))}
                                        {book.genres.length > 3 && (
                                            <Typography sx={{ 
                                                color: '#60a5fa',
                                                fontSize: '0.75rem'
                                            }}>
                                                +{book.genres.length - 3} más
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Box>

                    {book.description && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #374151' }}>
                            <Typography variant="body2" sx={{ color: '#9ca3af', mb: 1 }}>
                                Descripción:
                            </Typography>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: '#d1d5db',
                                    fontStyle: 'italic',
                                    maxHeight: '60px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                {book.description.length > 150 
                                    ? `${book.description.substring(0, 150)}...` 
                                    : book.description
                                }
                            </Typography>
                        </Box>
                    )}
                </Box>

                {error && (
                    <Alert 
                        severity="error" 
                        sx={{ 
                            mt: 2,
                            bgcolor: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            '& .MuiAlert-icon': { color: '#ef4444' }
                        }}
                    >
                        {error}
                    </Alert>
                )}
            </DialogContent>
            
            <DialogActions sx={{ borderTop: '1px solid #333', p: 3, gap: 2 }}>
                <Button
                    onClick={handleClose}
                    sx={{
                        color: '#9ca3af',
                        borderColor: '#374151',
                        '&:hover': {
                            borderColor: '#4b5563',
                            bgcolor: 'rgba(75, 85, 99, 0.1)'
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
                        '&:hover': { bgcolor: '#dc2626' },
                        '&:disabled': { bgcolor: '#374151', color: '#9ca3af' }
                    }}
                >
                    {loading ? (
                        <>
                            <CircularProgress size={20} sx={{ color: '#9ca3af', mr: 1 }} />
                            Eliminando...
                        </>
                    ) : (
                        'Eliminar Libro'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
}