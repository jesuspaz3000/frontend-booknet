'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Alert
} from '@mui/material';
import userManagementService from '@/services/dashboard/userManagement/userManagement.service';

interface UserFormData {
    username: string;
    email: string;
    role: 'USER' | 'ADMIN';
}

interface EditUserProps {
    open: boolean;
    userId: string | null;
    onClose: () => void;
    onUserUpdated: () => void; // Callback para recargar la lista
}

export default function EditUser({ open, userId, onClose, onUserUpdated }: EditUserProps) {
    const [formData, setFormData] = useState<UserFormData>({
        username: '',
        email: '',
        role: 'USER'
    });
    const [loading, setLoading] = useState(false);
    const [loadingUser, setLoadingUser] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Efecto para cargar los datos del usuario cuando se abre el modal
    useEffect(() => {
        const loadUser = async () => {
            if (open && userId) {
                setLoadingUser(true);
                setError(null);
                try {
                    const response = await userManagementService.getUserById(userId);
                    const userData = response.data;
                    setFormData({
                        username: userData.username,
                        email: userData.email,
                        role: userData.role
                    });
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'Error al cargar el usuario');
                } finally {
                    setLoadingUser(false);
                }
            }
        };
        
        loadUser();
    }, [open, userId]);

    const handleSave = async () => {
        if (!userId) return;
        
        setError(null);
        
        // Validaciones
        if (!formData.username.trim()) {
            setError('El nombre de usuario es requerido');
            return;
        }
        
        if (!formData.email.trim()) {
            setError('El email es requerido');
            return;
        }
        
        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Por favor ingresa un email válido');
            return;
        }

        setLoading(true);
        
        try {
            await userManagementService.updateUser(userId, {
                username: formData.username,
                email: formData.email,
                role: formData.role
            });
            
            // Cerrar el modal y recargar la lista
            onClose();
            onUserUpdated();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar el usuario');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
        // Resetear formulario al cerrar
        setFormData({
            username: '',
            email: '',
            role: 'USER'
        });
        setError(null);
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
                Editar Usuario
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
                {loadingUser ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress sx={{ color: '#60a5fa' }} />
                    </Box>
                ) : (
                    <>
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
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 2 }}>
                            <TextField
                                label="Nombre de Usuario"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                fullWidth
                                disabled={loading}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: '#fff',
                                        backgroundColor: '#2d2d2d',
                                        '& fieldset': { borderColor: '#333' },
                                        '&:hover fieldset': { borderColor: '#60a5fa' },
                                        '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                    },
                                    '& .MuiInputLabel-root': { 
                                        color: '#9ca3af',
                                        '&.Mui-focused': { color: '#60a5fa' }
                                    }
                                }}
                            />
                            <TextField
                                label="Email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                fullWidth
                                disabled={loading}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: '#fff',
                                        backgroundColor: '#2d2d2d',
                                        '& fieldset': { borderColor: '#333' },
                                        '&:hover fieldset': { borderColor: '#60a5fa' },
                                        '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                    },
                                    '& .MuiInputLabel-root': { 
                                        color: '#9ca3af',
                                        '&.Mui-focused': { color: '#60a5fa' }
                                    }
                                }}
                            />
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ 
                                        color: '#9ca3af',
                                        '&.Mui-focused': { color: '#60a5fa' }
                                    }}>Rol</InputLabel>
                                    <Select
                                        value={formData.role}
                                        label="Rol"
                                        disabled={loading}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value as 'USER' | 'ADMIN' })}
                                        sx={{
                                            color: '#fff',
                                            backgroundColor: '#2d2d2d',
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' },
                                            '& .MuiSvgIcon-root': { color: '#60a5fa' }
                                        }}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    bgcolor: '#2d2d2d',
                                                    '& .MuiMenuItem-root': {
                                                        color: '#fff',
                                                        '&:hover': {
                                                            backgroundColor: '#374151'
                                                        },
                                                        '&.Mui-selected': {
                                                            backgroundColor: '#60a5fa',
                                                            color: '#1a1a1a',
                                                            '&:hover': {
                                                                backgroundColor: '#3b82f6'
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    >
                                        <MenuItem value="USER">Usuario</MenuItem>
                                        <MenuItem value="ADMIN">Administrador</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                    </>
                )}
            </DialogContent>
            <DialogActions sx={{ 
                borderTop: '1px solid #333', 
                pt: 2,
                gap: 2
            }}>
                <Button 
                    onClick={handleClose}
                    disabled={loading || loadingUser}
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
                    onClick={handleSave}
                    variant="contained"
                    disabled={loading || loadingUser}
                    startIcon={loading ? <CircularProgress size={20} sx={{ color: '#1a1a1a' }} /> : null}
                    sx={{
                        backgroundColor: '#60a5fa',
                        color: '#1a1a1a',
                        fontWeight: 600,
                        '&:hover': { 
                            backgroundColor: '#3b82f6',
                            transform: 'translateY(-1px)'
                        },
                        '&:disabled': { 
                            backgroundColor: '#4b5563',
                            color: '#9ca3af'
                        },
                        transition: 'all 0.2s ease'
                    }}
                >
                    {loading ? 'Actualizando...' : 'Actualizar Usuario'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
