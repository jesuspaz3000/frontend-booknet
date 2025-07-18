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
    MenuItem
} from '@mui/material';

interface User {
    id: number;
    name: string;
    image: string;
    calification: number;
    comment: string;
    date: string;
    email?: string;
    status?: 'active' | 'inactive' | 'suspended';
    role?: 'user' | 'admin';
}

interface UserFormData {
    name: string;
    email: string;
    image: string;
    role: 'user' | 'admin';
}

interface EditUserProps {
    open: boolean;
    user: User | null;
    onClose: () => void;
    onSave: (userData: UserFormData) => void;
}

export default function EditUser({ open, user, onClose, onSave }: EditUserProps) {
    const [formData, setFormData] = useState<UserFormData>({
        name: '',
        email: '',
        image: '/images/users/carameme.jpg',
        role: 'user'
    });

    // Efecto para cargar los datos del usuario cuando se abre el modal
    useEffect(() => {
        if (user && open) {
            setFormData({
                name: user.name,
                email: user.email || '',
                image: user.image,
                role: user.role || 'user'
            });
        }
    }, [user, open]);

    const handleSave = () => {
        onSave(formData);
    };

    const handleClose = () => {
        onClose();
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
                Editar Usuario
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 2 }}>
                    <TextField
                        label="Nombre"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        fullWidth
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
                    Actualizar Usuario
                </Button>
            </DialogActions>
        </Dialog>
    );
}
