'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { TextField, Button, Typography, InputAdornment, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import Link from 'next/link';

export default function Login() {
    const [user, setUser] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí puedes agregar la lógica para manejar el inicio de sesión
        console.log('Usuario:', user);
        console.log('Password:', password);
        // Redirigir al usuario a la página principal o donde sea necesario
        router.push('/home');
    };

    return (
        <div className="tw:flex tw:items-center tw:justify-center tw:w-full tw:h-screen">
            <div className="tw:py-8 tw:px-12 tw:rounded-lg tw:shadow-xl tw:w-xl tw:flex tw:flex-col tw:items-center tw: tw:justify-center tw:gap-4 tw:relative">
                <div className='tw:absolute tw:inset-0 tw:bg-white tw:rounded-lg tw:opacity-10 tw:z-[-1]'></div>
                <Image
                    src="/Images/BookNetLogo.png"
                    alt="Logo"
                    width={400}
                    height={400}
                    className="tw:mb-8 tw:w-auto tw:h-[100px] tw:object-contain tw:mx-auto"
                    priority
                />

                <form autoComplete='off' className="tw:flex tw:flex-col tw:gap-4 tw:w-full">
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
                    >
                        Iniciar Sesión
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
            </div>
        </div>
    );
};