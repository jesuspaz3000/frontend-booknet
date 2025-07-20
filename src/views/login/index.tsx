'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TextField, Button, Typography, InputAdornment, Checkbox, FormGroup, FormControlLabel, Alert, CircularProgress, Box } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
    const [user, setUser] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const { login: authLogin } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        // Validaciones básicas
        if (!user.trim() || !password.trim()) {
            setError('Usuario y contraseña son obligatorios');
            return;
        }

        setLoading(true);

        try {
            const loginData = {
                username: user.trim(),
                password: password
            };

            const userResponse = await authLogin(loginData);
            
            // Si el login es exitoso, mostrar mensaje de éxito
            console.log('Login exitoso:', userResponse);
            setIsAuthenticated(true);
            setSuccessMessage(`¡Bienvenido de nuevo, ${userResponse.username}!`);
            
            // El ProtectedRoute se encargará de la redirección automáticamente
            // No necesitamos redirección manual aquí
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error en el login';
            setError(errorMessage);
            console.error('Error en login:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tw:flex tw:items-center tw:justify-center tw:w-full tw:h-screen">
            <div className="tw:py-8 tw:px-12 tw:rounded-lg tw:shadow-xl tw:w-xl tw:flex tw:flex-col tw:items-center tw: tw:justify-center tw:gap-4 tw:relative">
                <div className='tw:absolute tw:inset-0 tw:bg-white tw:rounded-lg tw:opacity-10 tw:z-[-1]'></div>
                
                {isAuthenticated ? (
                    // Pantalla de éxito
                    <Box className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-6 tw:text-center">
                        <CheckCircleIcon 
                            sx={{ 
                                fontSize: 80, 
                                color: '#10B981',
                                mb: 2
                            }} 
                        />
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                color: '#fff',
                                fontWeight: 'bold',
                                mb: 2
                            }}
                        >
                            ¡Login Exitoso!
                        </Typography>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                color: '#fff',
                                mb: 3,
                                maxWidth: '400px'
                            }}
                        >
                            {successMessage}
                        </Typography>
                        <Box className="tw:flex tw:items-center tw:gap-2">
                            <CircularProgress 
                                size={20} 
                                sx={{ color: '#fff' }} 
                            />
                            <Typography 
                                variant="body2" 
                                sx={{ color: '#fff' }}
                            >
                                Accediendo al sistema...
                            </Typography>
                        </Box>
                    </Box>
                ) : (
                    // Formulario de login
                    <>
                        <Image
                            src="/Images/BookNetLogo.png"
                            alt="Logo"
                            width={400}
                            height={400}
                            className="tw:mb-8 tw:w-auto tw:h-[100px] tw:object-contain tw:mx-auto"
                            priority
                        />

                        <form autoComplete='off' className="tw:flex tw:flex-col tw:gap-4 tw:w-full">
                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}
                            <input type="text" style={{ display: 'none' }} autoComplete="false" />
                            <input type="password" style={{ display: 'none' }} autoComplete="false" />
                            <TextField
                                label="Usuario"
                                variant="outlined"
                                fullWidth
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                                required
                                        autoComplete='new-user'
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <PersonIcon sx={{ color: "#fff" }} />
                                            </InputAdornment>
                                        ),
                                        sx: {
                                            color: '#fff',
                                        }
                                    },
                                    inputLabel: {
                                        sx: {
                                            color: '#fff'
                                        }
                                    }
                                }}
                                sx={{
                                    marginBottom: '16px',
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#CBD5E0',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#9CA3AF',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#2563EB',
                                        },
                                    },
                                }}
                                    />
                            <TextField
                                label="Contraseña"
                                variant="outlined"
                                fullWidth
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete='new-password'
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <LockIcon sx={{ color: "#fff" }} />
                                            </InputAdornment>
                                        ),
                                        sx: {
                                            color: '#fff',
                                        }
                                    },
                                    inputLabel: {
                                        sx: {
                                            color: '#fff'
                                        }
                                    }
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#CBD5E0',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#9CA3AF',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#2563EB',
                                        },
                                    },
                                }}
                                    />
                            <div className='tw:flex tw:items-center tw:justify-between'>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                                sx={{
                                                    color: 'white',
                                                    '&.Mui-checked': { color: 'white' },
                                                    '&.Mui-checked:hover': { color: 'white' }
                                                }}
                                            />
                                        }
                                        label="Recordarme"
                                        sx={{
                                            color: 'white',
                                            '& .MuiFormControlLabel-label': {
                                                fontSize: { xs: '0.875rem', sm: '1rem' }
                                            }
                                        }}
                                    />
                                </FormGroup>
                                <Link href="/forgot-password">
                                    <Typography
                                        sx={{
                                            textAlign: 'right',
                                            cursor: 'pointer',
                                            color: "#fff",
                                            transition: '0.3s',
                                            '&:hover': {
                                                textDecoration: 'underline',
                                            }
                                        }}
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Typography>
                                </Link>
                            </div>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                size="large"
                                onClick={handleSubmit}
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                            >
                                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                            </Button>
                            <div className='tw:flex tw:items-center tw:justify-center tw:gap-2'>
                                <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                    ¿No tienes una cuenta?
                                </Typography>
                                <Link href="/register">
                                    <Typography sx={{fontSize: { xs: '0.875rem', sm: '1rem' }, color: 'primary.main', '&:hover': { textDecoration: 'underline' }}}>
                                        Registrarse
                                    </Typography>
                                </Link>
                            </div>
                </form>
                </>
                )}
            </div>
        </div>
    );
};