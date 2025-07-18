'use client';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Avatar
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import WarningIcon from '@mui/icons-material/Warning';

interface User {
    id: number;
    name: string;
    image: string;
    calification: number;
    comment: string;
    date: string;
    email?: string;
    status?: 'active' | 'inactive' | 'suspended';
    role?: 'user' | 'admin' | 'moderator';
}

interface DeleteUserProps {
    open: boolean;
    user: User | null;
    onClose: () => void;
    onConfirm: (userId: number) => void;
}

export default function DeleteUser({ open, user, onClose, onConfirm }: DeleteUserProps) {
    const handleConfirm = () => {
        if (user) {
            onConfirm(user.id);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        backgroundColor: '#1f2937',
                        color: 'white'
                    }
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
                            {user.image ? (
                                <Avatar src={user.image} alt={user.name} sx={{ width: 56, height: 56 }} />
                            ) : (
                                <Avatar sx={{ backgroundColor: '#6b7280', width: 56, height: 56 }}>
                                    <PersonIcon sx={{ fontSize: 32 }} />
                                </Avatar>
                            )}
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ color: 'white' }}>
                                    {user.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#d1d5db' }}>
                                    {user.email}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                                    {user.role} • {user.status}
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
                    onClick={onClose}
                    sx={{ color: '#d1d5db' }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    sx={{
                        backgroundColor: '#ef4444',
                        '&:hover': { backgroundColor: '#dc2626' }
                    }}
                >
                    Eliminar Usuario
                </Button>
            </DialogActions>
        </Dialog>
    );
}
