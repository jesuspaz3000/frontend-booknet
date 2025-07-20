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
import userManagementService, { User } from '@/services/userManagement/userManagement.service';

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
                    backgroundColor: '#1f2937',
                    color: 'white'
                }
            }}
        >
            <DialogTitle sx={{ color: 'white', borderBottom: '1px solid #374151' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <WarningIcon sx={{ color: '#ef4444' }} />
                    Confirmar Eliminación
                </Box>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', marginTop: 2 }}>
                    <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>
                        ¿Estás seguro de que quieres eliminar este usuario?
                    </Typography>

                    {user && (
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            p: 2,
                            border: '1px solid #374151',
                            borderRadius: 1,
                            backgroundColor: '#374151',
                            width: '100%'
                        }}>
                            <Avatar sx={{ backgroundColor: '#6b7280', width: 56, height: 56 }}>
                                <PersonIcon sx={{ fontSize: 32 }} />
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ color: 'white' }}>
                                    {user.username}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#d1d5db' }}>
                                    {user.email}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                                    {user.role}
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    <Box sx={{
                        backgroundColor: '#fef3c7',
                        border: '1px solid #f59e0b',
                        borderRadius: 1,
                        p: 2,
                        width: '100%'
                    }}>
                        <Typography sx={{ color: '#92400e', textAlign: 'center' }}>
                            <strong>Advertencia:</strong> Esta acción no se puede deshacer. El usuario será eliminado permanentemente del sistema.
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ borderTop: '1px solid #374151', pt: 2 }}>
                <Button
                    onClick={handleClose}
                    disabled={loading}
                    sx={{ color: '#d1d5db' }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : null}
                    sx={{
                        backgroundColor: '#ef4444',
                        '&:hover': { backgroundColor: '#dc2626' },
                        '&:disabled': { backgroundColor: '#374151' }
                    }}
                >
                    {loading ? 'Eliminando...' : 'Eliminar Usuario'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
