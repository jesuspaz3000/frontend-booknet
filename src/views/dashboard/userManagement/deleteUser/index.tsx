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
    Avatar,
    CircularProgress,
    Alert
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import WarningIcon from '@mui/icons-material/Warning';
import userManagementService, { User } from '@/services/dashboard/userManagement/userManagement.service';

interface DeleteUserProps {
    open: boolean;
    user: User | null;
    onClose: () => void;
    onUserDeleted: () => void; // Callback para recargar la lista
}

export default function DeleteUser({ open, user, onClose, onUserDeleted }: DeleteUserProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async () => {
        if (!user) return;
        
        setLoading(true);
        setError(null);
        
        try {
            await userManagementService.deleteUser(user.id.toString());
            
            // Cerrar el modal y recargar la lista
            onClose();
            onUserDeleted();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar el usuario');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            onClose();
            setError(null);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: '#1a1a1a',
                    color: '#fff',
                    border: '1px solid #333',
                    borderRadius: 2
                }
            }}
        >
            <DialogTitle sx={{ 
                color: '#60a5fa', 
                borderBottom: '1px solid #333',
                fontWeight: 600,
                fontSize: '1.25rem'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <WarningIcon sx={{ color: '#ef4444' }} />
                    Confirmar Eliminación
                </Box>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
                {error && (
                    <Alert 
                        severity="error" 
                        sx={{ 
                            mb: 2,
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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', marginTop: 2 }}>
                    <Typography variant="h6" sx={{ color: '#fff', textAlign: 'center', fontWeight: 500 }}>
                        ¿Estás seguro de que quieres eliminar este usuario?
                    </Typography>

                    {user && (
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            p: 2,
                            border: '1px solid #333',
                            borderRadius: 2,
                            backgroundColor: '#2d2d2d',
                            width: '100%'
                        }}>
                            <Avatar sx={{ backgroundColor: '#60a5fa', color: '#1a1a1a', width: 56, height: 56 }}>
                                <PersonIcon sx={{ fontSize: 32 }} />
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 500 }}>
                                    {user.username}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                                    {user.email}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#60a5fa', fontSize: '0.75rem' }}>
                                    {user.role}
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    <Box sx={{
                        backgroundColor: '#7c2d12',
                        border: '1px solid #ea580c',
                        borderRadius: 2,
                        p: 2,
                        width: '100%'
                    }}>
                        <Typography sx={{ color: '#fed7aa', textAlign: 'center', fontSize: '0.875rem' }}>
                            <strong>Advertencia:</strong> Esta acción no se puede deshacer. El usuario será eliminado permanentemente del sistema.
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ 
                borderTop: '1px solid #333', 
                pt: 2,
                gap: 2
            }}>
                <Button
                    onClick={handleClose}
                    disabled={loading}
                    sx={{ 
                        color: '#9ca3af',
                        '&:hover': {
                            backgroundColor: 'rgba(156, 163, 175, 0.1)',
                            color: '#fff'
                        }
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : null}
                    sx={{
                        backgroundColor: '#ef4444',
                        color: '#fff',
                        fontWeight: 600,
                        '&:hover': { 
                            backgroundColor: '#dc2626',
                            transform: 'translateY(-1px)'
                        },
                        '&:disabled': { 
                            backgroundColor: '#4b5563',
                            color: '#9ca3af'
                        },
                        transition: 'all 0.2s ease'
                    }}
                >
                    {loading ? 'Eliminando...' : 'Eliminar Usuario'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
