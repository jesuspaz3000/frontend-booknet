'use client';

import { useState, useEffect } from 'react';
import NavBar from "../home/navbar";
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Alert,
    CircularProgress,
    InputAdornment,
    Typography
} from "@mui/material";
import accountSettingsService, { GetProfileResponse, UpdateProfileRequest } from '@/services/accountSettings/accountSettings.service';

interface EditModalProps {
    open: boolean;
    onClose: () => void;
    type: 'email' | 'username' | 'password';
    currentValue?: string;
    onSuccess: () => void;
}

function EditModal({ open, onClose, type, currentValue, onSuccess }: EditModalProps) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newValue, setNewValue] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isPasswordChange = type === 'password';

    const handleClose = () => {
        setCurrentPassword('');
        setNewValue('');
        setConfirmPassword('');
        setError(null);
        onClose();
    };

    const handleSubmit = async () => {
        setError(null);
        setLoading(true);

        try {
            // Validaciones
            if (!currentPassword.trim()) {
                throw new Error('La contraseña actual es requerida');
            }

            if (!newValue.trim()) {
                const fieldName = type === 'email' ? 'email' : type === 'username' ? 'nombre de usuario' : 'contraseña';
                throw new Error(`El nuevo ${fieldName} es requerido`);
            }

            if (isPasswordChange) {
                if (newValue.length < 6) {
                    throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
                }
                if (newValue !== confirmPassword) {
                    throw new Error('Las contraseñas no coinciden');
                }
            }

            // Preparar datos para el servicio
            const updateData: UpdateProfileRequest = {
                currentPassword,
                ...(type === 'email' && { newEmail: newValue }),
                ...(type === 'username' && { newUsername: newValue }),
                ...(type === 'password' && { newPassword: newValue })
            };

            await accountSettingsService.updateProfile(updateData);
            onSuccess();
            handleClose();
        } catch (error: unknown) {
            let errorMessage = 'Error actualizando perfil';
            
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'object' && error !== null && 'message' in error) {
                errorMessage = String(error.message);
            } else if (typeof error === 'string') {
                errorMessage = error;
            }
            
            // Asegurar que mensajes específicos del backend se muestren correctamente
            if (errorMessage.includes('contraseña actual es incorrecta') || 
                errorMessage.includes('current password is incorrect') ||
                errorMessage.includes('La contraseña actual es incorrecta')) {
                errorMessage = 'La contraseña actual es incorrecta. Por favor, verifica e intenta nuevamente.';
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const getTitle = () => {
        switch (type) {
            case 'email': return 'Cambiar Correo Electrónico';
            case 'username': return 'Cambiar Nombre de Usuario';
            case 'password': return 'Cambiar Contraseña';
            default: return 'Editar';
        }
    };

    const getNewFieldLabel = () => {
        switch (type) {
            case 'email': return 'Nuevo correo electrónico';
            case 'username': return 'Nuevo nombre de usuario';
            case 'password': return 'Nueva contraseña';
            default: return 'Nuevo valor';
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
                    color: 'white',
                    border: '1px solid #374151'
                }
            }}
        >
            <DialogTitle sx={{ borderBottom: '1px solid #374151', pb: 2, color: 'white' }}>
                {getTitle()}
            </DialogTitle>
            
            <DialogContent sx={{ pt: 3 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2, backgroundColor: '#7f1d1d', color: 'white' }}>
                        {error}
                    </Alert>
                )}

                {/* Campo oculto para evitar autocompletado */}
                <input
                    type="password"
                    style={{ display: 'none' }}
                    autoComplete="off"
                    tabIndex={-1}
                />

                {/* Contraseña actual - siempre requerida */}
                <TextField
                    fullWidth
                    label="Contraseña actual"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    margin="normal"
                    required
                    disabled={loading}
                    autoComplete="one-time-code"
                    name="current-password-verification"
                    id={`current-password-${Date.now()}`}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockIcon sx={{ color: '#9ca3af' }} />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    sx={{ color: '#9ca3af' }}
                                >
                                    {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                            </InputAdornment>
                        ),
                        sx: {
                            color: 'white',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#374151'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#6b7280'
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#3b82f6'
                            }
                        }
                    }}
                    InputLabelProps={{
                        sx: { color: '#9ca3af' }
                    }}
                />

                {/* Campo para el nuevo valor */}
                <TextField
                    fullWidth
                    label={getNewFieldLabel()}
                    type={isPasswordChange ? (showNewPassword ? 'text' : 'password') : type === 'email' ? 'email' : 'text'}
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    margin="normal"
                    required
                    disabled={loading}
                    placeholder={currentValue}
                    autoComplete={isPasswordChange ? "new-password" : "off"}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                {type === 'email' ? <EmailIcon sx={{ color: '#9ca3af' }} /> :
                                 type === 'username' ? <PersonIcon sx={{ color: '#9ca3af' }} /> :
                                 <LockIcon sx={{ color: '#9ca3af' }} />}
                            </InputAdornment>
                        ),
                        endAdornment: isPasswordChange ? (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    sx={{ color: '#9ca3af' }}
                                >
                                    {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                            </InputAdornment>
                        ) : undefined,
                        sx: {
                            color: 'white',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#374151'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#6b7280'
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#3b82f6'
                            }
                        }
                    }}
                    InputLabelProps={{
                        sx: { color: '#9ca3af' }
                    }}
                />

                {/* Confirmar contraseña - solo para cambios de contraseña */}
                {isPasswordChange && (
                    <TextField
                        fullWidth
                        label="Confirmar nueva contraseña"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        margin="normal"
                        required
                        disabled={loading}
                        autoComplete="new-password"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon sx={{ color: '#9ca3af' }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        sx={{ color: '#9ca3af' }}
                                    >
                                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: {
                                color: 'white',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#374151'
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#6b7280'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#3b82f6'
                                }
                            }
                        }}
                        InputLabelProps={{
                            sx: { color: '#9ca3af' }
                        }}
                    />
                )}
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
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : null}
                    sx={{
                        backgroundColor: '#3b82f6',
                        '&:hover': { backgroundColor: '#2563eb' },
                        '&:disabled': { backgroundColor: '#374151' }
                    }}
                >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default function AccountSettings() {
    const [profile, setProfile] = useState<GetProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editModal, setEditModal] = useState<{
        open: boolean;
        type: 'email' | 'username' | 'password';
    }>({ open: false, type: 'email' });

    const loadProfile = async () => {
        try {
            setLoading(true);
            const response = await accountSettingsService.getProfile();
            setProfile(response.data);
            setError(null);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error cargando perfil';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleEditClick = (type: 'email' | 'username' | 'password') => {
        setEditModal({ open: true, type });
    };

    const handleCloseModal = () => {
        setEditModal({ open: false, type: 'email' });
    };

    const handleSuccess = () => {
        loadProfile(); // Recargar perfil tras cambios exitosos
    };

    if (loading) {
        return (
            <div>
                <NavBar />
                <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:min-h-screen tw:w-full tw:py-8">
                    <CircularProgress sx={{ color: 'white' }} />
                    <Typography sx={{ color: 'white', mt: 2 }}>Cargando perfil...</Typography>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <NavBar />
                <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:min-h-screen tw:w-full tw:py-8">
                    <Alert severity="error" sx={{ backgroundColor: '#7f1d1d', color: 'white' }}>
                        {error}
                    </Alert>
                    <Button
                        onClick={loadProfile}
                        variant="contained"
                        sx={{ mt: 2, backgroundColor: '#3b82f6' }}
                    >
                        Reintentar
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <NavBar />
            <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:min-h-screen tw:w-full tw:py-8">
                <div className="tw:flex tw:flex-col tw:items-center tw:w-[900px] tw:max-w-[90%]">
                    <h1 className="tw:text-5xl tw:font-bold tw:mb-16 tw:text-white">Cuenta</h1>

                    {/* Correo Electrónico */}
                    <div className="tw:flex tw:flex-col tw:w-full tw:rounded-t-lg tw:relative tw:border-b-[0.5px] tw:border-[#e0e0e098] tw:cursor-pointer tw:group">
                        <div className="tw:absolute tw:w-full tw:h-full tw:bg-white tw:group-hover:opacity-7 tw:transition tw:duration-200 tw:opacity-5 tw:z-0 tw:rounded-t-lg tw:pointer-events-none"></div>
                        <div className="tw:flex tw:items-center tw:justify-between tw:w-full tw:pl-8 tw:pr-6">
                            <div className="tw:z-10 tw:pt-6 tw:flex tw:items-center">
                                <h2 className="tw:text-xl tw:font-bold tw:text-white">Correo Electrónico</h2>
                            </div>
                            <div className="tw:pt-6">
                                <IconButton
                                    onClick={() => handleEditClick('email')}
                                    sx={{
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                        }
                                    }}
                                >
                                    <EditIcon sx={{ fontSize: '1.5rem', color: 'white' }} />
                                </IconButton>
                            </div>
                        </div>
                        <p className="tw:text-xl tw:font-normal tw:z-10 tw:px-8 tw:pb-6 tw:text-white tw:relative">
                            {profile?.email || 'Cargando...'}
                        </p>
                    </div>

                    {/* Contraseña */}
                    <div className="tw:flex tw:flex-col tw:w-full tw:rounded-t-lg tw:relative tw:border-b-[0.5px] tw:border-[#e0e0e098] tw:cursor-pointer tw:group">
                        <div className="tw:absolute tw:w-full tw:h-full tw:bg-white tw:group-hover:opacity-7 tw:transition tw:duration-200 tw:opacity-5 tw:z-0 tw:pointer-events-none"></div>
                        <div className="tw:flex tw:items-center tw:justify-between tw:w-full tw:pl-8 tw:pr-6">
                            <div className="tw:z-10 tw:pt-6 tw:flex tw:items-center">
                                <h2 className="tw:text-xl tw:font-bold tw:text-white">Contraseña</h2>
                            </div>
                            <div className="tw:pt-6">
                                <IconButton
                                    onClick={() => handleEditClick('password')}
                                    sx={{
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                        }
                                    }}
                                >
                                    <EditIcon sx={{ fontSize: '1.5rem', color: 'white' }} />
                                </IconButton>
                            </div>
                        </div>
                        <p className="tw:text-xl tw:font-normal tw:z-10 tw:px-8 tw:pb-6 tw:text-white tw:relative">********</p>
                    </div>

                    {/* Nombre de Usuario */}
                    <div className="tw:flex tw:flex-col tw:w-full tw:rounded-t-lg tw:relative tw:cursor-pointer tw:group">
                        <div className="tw:absolute tw:w-full tw:h-full tw:bg-white tw:group-hover:opacity-7 tw:transition tw:duration-200 tw:opacity-5 tw:z-0 tw:rounded-b-lg tw:pointer-events-none"></div>
                        <div className="tw:flex tw:items-center tw:justify-between tw:w-full tw:pl-8 tw:pr-6">
                            <div className="tw:z-10 tw:pt-6 tw:flex tw:items-center">
                                <h2 className="tw:text-xl tw:font-bold tw:text-white">Nombre del usuario</h2>
                            </div>
                            <div className="tw:pt-6">
                                <IconButton
                                    onClick={() => handleEditClick('username')}
                                    sx={{
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                        }
                                    }}
                                >
                                    <EditIcon sx={{ fontSize: '1.5rem', color: 'white' }} />
                                </IconButton>
                            </div>
                        </div>
                        <p className="tw:text-xl tw:font-normal tw:z-10 tw:px-8 tw:pb-6 tw:text-white tw:relative">
                            {profile?.username || 'Cargando...'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Modal de edición */}
            <EditModal
                open={editModal.open}
                onClose={handleCloseModal}
                type={editModal.type}
                currentValue={
                    editModal.type === 'email' ? profile?.email :
                    editModal.type === 'username' ? profile?.username :
                    undefined
                }
                onSuccess={handleSuccess}
            />
        </div>
    );
}
