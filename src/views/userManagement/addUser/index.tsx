'use client';

import { useState } from 'react';
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
import userManagementService from '@/services/userManagement/userManagement.service';

interface UserFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'USER' | 'ADMIN';
}

interface AddUserProps {
    open: boolean;
    onClose: () => void;
    onUserAdded: () => void; // Callback para recargar la lista
}

export default function AddUser({ open, onClose, onUserAdded }: AddUserProps) {
    const [formData, setFormData] = useState<UserFormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'USER'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
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
        
        if (!formData.password) {
            setError('La contraseña es requerida');
            return;
        }
        
        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);
        
        try {
            await userManagementService.createUser({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });
            
            // Limpiar el formulario
            setFormData({
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
                role: 'USER'
            });
            
            // Cerrar el modal y recargar la lista
            onClose();
            onUserAdded();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear el usuario');
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
            password: '',
            confirmPassword: '',
            role: 'USER'
        });
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
                Nuevo Usuario
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 2 }}>
                    <TextField
                        label="Nombre de Usuario"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        fullWidth
                        autoComplete="off"
                        disabled={loading}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': { borderColor: '#374151' },
                                '&:hover fieldset': { borderColor: '#60a5fa' },
                                '&.Mui-focused fieldset': { borderColor: '#2563eb' }
                            },
                            '& .MuiInputLabel-root': { color: '#d1d5db' }
                        }}
                    />
                    <TextField
                        label="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        fullWidth
                        autoComplete="off"
                        disabled={loading}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': { borderColor: '#374151' },
                                '&:hover fieldset': { borderColor: '#60a5fa' },
                                '&.Mui-focused fieldset': { borderColor: '#2563eb' }
                            },
                            '& .MuiInputLabel-root': { color: '#d1d5db' }
                        }}
                    />
                    
                    <TextField
                        label="Contraseña"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        fullWidth
                        autoComplete="new-password"
                        disabled={loading}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': { borderColor: '#374151' },
                                '&:hover fieldset': { borderColor: '#60a5fa' },
                                '&.Mui-focused fieldset': { borderColor: '#2563eb' }
                            },
                            '& .MuiInputLabel-root': { color: '#d1d5db' }
                        }}
                    />
                    
                    <TextField
                        label="Confirmar Contraseña"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        fullWidth
                        autoComplete="new-password"
                        disabled={loading}
                        error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ''}
                        helperText={formData.password !== formData.confirmPassword && formData.confirmPassword !== '' ? 'Las contraseñas no coinciden' : ''}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': { borderColor: '#374151' },
                                '&:hover fieldset': { borderColor: '#60a5fa' },
                                '&.Mui-focused fieldset': { borderColor: '#2563eb' }
                            },
                            '& .MuiInputLabel-root': { color: '#d1d5db' },
                            '& .MuiFormHelperText-root': { color: '#f87171' }
                        }}
                    />
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel sx={{ color: '#d1d5db' }}>Rol</InputLabel>
                            <Select
                                value={formData.role}
                                label="Rol"
                                disabled={loading}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'USER' | 'ADMIN' })}
                                sx={{
                                    color: 'white',
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#374151' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563eb' }
                                }}
                            >
                                <MenuItem value="USER">Usuario</MenuItem>
                                <MenuItem value="ADMIN">Administrador</MenuItem>
                            </Select>
                        </FormControl>
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
                    onClick={handleSave}
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : null}
                    sx={{
                        backgroundColor: '#2563eb',
                        '&:hover': { backgroundColor: '#1d4ed8' },
                        '&:disabled': { backgroundColor: '#374151' }
                    }}
                >
                    {loading ? 'Creando...' : 'Crear Usuario'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
