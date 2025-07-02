'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Typography, Container, Box, Alert, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      setSuccess('Registro exitoso. Redireccionando...');
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);

    } catch (err: any) {
      setError(err.response?.data?.msg || 'Error al registrar usuario. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" className="flex items-center justify-center min-h-screen bg-gray-100">
      <Box className="p-8 bg-white rounded-lg shadow-xl w-full max-w-md">
        <Typography variant="h4" component="h1" gutterBottom className="text-center text-gray-800 font-bold mb-8">
          Registrarse
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <TextField
            label="Nombre de Usuario"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mb-4"
            sx={{ // Puedes reutilizar los mismos estilos para TextField
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#CBD5E0', },
                '&:hover fieldset': { borderColor: '#9CA3AF', },
                '&.Mui-focused fieldset': { borderColor: '#2563EB', },
              },
            }}
          />
          <TextField
            label="Correo Electrónico"
            variant="outlined"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mb-4"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#CBD5E0', },
                '&:hover fieldset': { borderColor: '#9CA3AF', },
                '&.Mui-focused fieldset': { borderColor: '#2563EB', },
              },
            }}
          />
          <TextField
            label="Contraseña"
            variant="outlined"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mb-4"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#CBD5E0', },
                '&:hover fieldset': { borderColor: '#9CA3AF', },
                '&.Mui-focused fieldset': { borderColor: '#2563EB', },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            className="py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
            sx={{
              '&:hover': {
                backgroundColor: '#16A34A', // green-600
              },
            }}
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </Button>
        </form>
        <Typography variant="body2" className="mt-6 text-center text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Button
            color="secondary"
            onClick={() => router.push('/login')}
            className="font-medium text-blue-600 hover:text-blue-800"
          >
            Inicia Sesión
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;