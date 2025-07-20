'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { TextField, Button, Typography, InputAdornment, Alert, CircularProgress, Box } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Link from 'next/link';
import { registerService } from '../../services/register/register.service';
import { useAuth } from '../../contexts/AuthContext';

export default function Register() {
    const [user, setUser] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [isRegistered, setIsRegistered] = useState<boolean>(false);

    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});
        
        // Validaciones básicas
        if (!user.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            setError('Todos los campos son obligatorios');
            return;
        }

        if (password !== confirmPassword) {
            setFieldErrors({ confirmPassword: 'Las contraseñas no coinciden' });
            return;
        }

        // Validar fortaleza de contraseña
        const passwordValidation = registerService.validatePasswordStrength(password);
        if (!passwordValidation.isValid) {
            setFieldErrors({ password: passwordValidation.errors.join(', ') });
            return;
        }

        setLoading(true);

        try {
            const registerData = {
                username: user.trim(),
                email: email.trim(),
                password: password
            };

            const response = await registerService.register(registerData);
            
            // Si el registro es exitoso, hacer login automático inmediatamente
            console.log('Registro exitoso:', response);
            
            // Hacer login automático sin mostrar pantalla de registro exitoso
            try {
                await login({ username: user.trim(), password: password }, true);
                // El AuthContext se encargará de mostrar el mensaje de login exitoso y la redirección
            } catch (loginError) {
                console.error('Error en login automático:', loginError);
                // Si falla el login automático, mostrar mensaje de éxito de registro y redirigir al login
                setIsRegistered(true);
                setSuccessMessage(`¡Registro exitoso ${response.user.username}! Por favor inicia sesión.`);
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            }
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error en el registro';
            setError(errorMessage);
            console.error('Error en registro:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tw:flex tw:items-center tw:justify-center tw:w-full tw:h-screen">
            <div className="tw:py-8 tw:px-12 tw:rounded-lg tw:shadow-xl tw:w-xl tw:flex tw:flex-col tw:items-center tw: tw:justify-center tw:gap-4 tw:relative">
                <div className='tw:absolute tw:inset-0 tw:bg-white tw:rounded-lg tw:opacity-5 tw:z-[-1]'></div>
                
                {isRegistered ? (
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
                            ¡Registro Exitoso!
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
                                Redirigiendo al inicio...
                            </Typography>
                        </Box>
                    </Box>
                ) : (
                    // Formulario de registro
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
                        label="Correo Electrónico"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete='new-email'
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <ContactMailIcon sx={{ color: "#fff" }} />
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
                        onChange={(e) => {
                            setPassword(e.target.value);
                            // Limpiar error de contraseña cuando el usuario escribe
                            if (fieldErrors.password) {
                                setFieldErrors(prev => {
                                    const newErrors = { ...prev };
                                    delete newErrors.password;
                                    return newErrors;
                                });
                            }
                        }}
                        required
                        autoComplete='new-password'
                        error={!!fieldErrors.password}
                        helperText={fieldErrors.password}
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
                        label="Confirmar contraseña"
                        variant="outlined"
                        fullWidth
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            // Limpiar error de confirmación cuando el usuario escribe
                            if (fieldErrors.confirmPassword) {
                                setFieldErrors(prev => {
                                    const newErrors = { ...prev };
                                    delete newErrors.confirmPassword;
                                    return newErrors;
                                });
                            }
                        }}
                        required
                        autoComplete='new-password'
                        error={!!fieldErrors.confirmPassword}
                        helperText={fieldErrors.confirmPassword}
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
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={handleSubmit}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </Button>
                    <div className='tw:flex tw:items-center tw:justify-center tw:gap-2'>
                        <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            ¿Ya tienes una cuenta?
                        </Typography>
                        <Link href="/login">
                            <Typography sx={{fontSize: { xs: '0.875rem', sm: '1rem' }, color: 'primary.main', '&:hover': { textDecoration: 'underline' }}}>
                                Iniciar Sesión
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