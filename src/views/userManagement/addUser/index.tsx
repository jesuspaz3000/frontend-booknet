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
    MenuItem
} from '@mui/material';

interface UserFormData {
    name: string;
    email: string;
    image: string;
    password: string;
    confirmPassword: string;
    role: 'user' | 'admin';
}

interface AddUserProps {
    open: boolean;
    onClose: () => void;
    onSave: (userData: UserFormData) => void;
}

export default function AddUser({ open, onClose, onSave }: AddUserProps) {
    const [formData, setFormData] = useState<UserFormData>({
        name: '',
        email: '',
        image: '/images/users/carameme.jpg',
        password: '',
        confirmPassword: '',
        role: 'user'
    });

    const handleSave = () => {
        // Validación de contraseñas
        if (formData.password !== formData.confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        
        if (formData.password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        onSave(formData);
        // Resetear formulario
        setFormData({
            name: '',
            email: '',
            image: '/images/users/carameme.jpg',
            password: '',
            confirmPassword: '',
            role: 'user'
        });
    };

    const handleClose = () => {
        onClose();
        // Resetear formulario al cerrar
        setFormData({
            name: '',
            email: '',
            image: '/images/users/carameme.jpg',
            password: '',
            confirmPassword: '',
            role: 'user'
        });
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            maxWidth="md"
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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 2 }}>
                    <TextField
                        label="Nombre"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        fullWidth
                        autoComplete="off"
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
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'admin' })}
                                sx={{
                                    color: 'white',
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#374151' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563eb' }
                                }}
                            >
                                <MenuItem value="user">Usuario</MenuItem>
                                <MenuItem value="admin">Administrador</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ borderTop: '1px solid #374151', pt: 2 }}>
                <Button 
                    onClick={handleClose}
                    sx={{ color: '#d1d5db' }}
                >
                    Cancelar
                </Button>
                <Button 
                    onClick={handleSave}
                    variant="contained"
                    sx={{
                        backgroundColor: '#2563eb',
                        '&:hover': { backgroundColor: '#1d4ed8' }
                    }}
                >
                    Crear Usuario
                </Button>
            </DialogActions>
        </Dialog>
    );
}
