'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Tipos para las props
interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

// Componente de carga uniforme (mismo estilo que ClientProviders)
const UnifiedLoadingScreen: React.FC = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#000',
    color: 'white',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  }}>
    <div style={{
      width: '60px',
      height: '60px',
      border: '4px solid #333',
      borderTop: '4px solid #fff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '16px'
    }}></div>
    <div style={{ fontSize: '18px' }}>
      Verificando autenticación...
    </div>
    <style dangerouslySetInnerHTML={{
      __html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `
    }} />
  </div>
);

// Componente de éxito de login
const LoginSuccessScreen: React.FC<{ username: string; isAfterRegistration?: boolean }> = ({ username, isAfterRegistration = false }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#000',
      color: 'white',
      textAlign: 'center',
      padding: 4
    }}
  >
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
      {isAfterRegistration ? '¡Registro y Login Exitoso!' : '¡Login Exitoso!'}
    </Typography>
    <Typography 
      variant="body1" 
      sx={{ 
        color: '#fff',
        mb: 3,
        maxWidth: '400px'
      }}
    >
      {isAfterRegistration 
        ? `¡Bienvenido a BookNet, ${username}! Tu cuenta ha sido creada y has iniciado sesión exitosamente.`
        : `¡Bienvenido de nuevo, ${username}!`
      }
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
);

// Componente para rutas protegidas
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireAdmin = false,
  redirectTo = '/login',
}) => {
  const { user, isAuthenticated, isLoading, isJustLoggedIn, isAfterRegistration } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si no requiere autenticación (páginas públicas como login/register)
    if (!requireAuth) {
      // Si el usuario ya está autenticado, redirigir al home
      if (!isLoading && isAuthenticated) {
        router.push('/home');
        return;
      }
      return;
    }

    // Si aún está cargando, esperar (ClientProviders maneja la pantalla de carga)
    if (isLoading) {
      return;
    }

    // Si requiere autenticación pero no está autenticado
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // Si requiere permisos de admin pero el usuario no es admin
    if (requireAdmin && user?.role !== 'ADMIN') {
      router.push('/home'); // Redirigir a home si no es admin
      return;
    }

    // Si el usuario acaba de loguearse, redirigir al home después de mostrar mensaje de éxito
    if (isJustLoggedIn) {
      setTimeout(() => {
        router.push('/home');
      }, 3000);
    }
  }, [isAuthenticated, isLoading, user, requireAuth, requireAdmin, router, redirectTo, isJustLoggedIn]);

  // Si está cargando, mostrar pantalla de carga unificada
  if (isLoading) {
    return <UnifiedLoadingScreen />;
  }

  // Si no requiere autenticación (páginas públicas)
  if (!requireAuth) {
    // Si el usuario está autenticado, mostrar pantalla de carga mientras redirecciona
    if (isAuthenticated) {
      return <UnifiedLoadingScreen />;
    }
    // Si no está autenticado, mostrar el contenido (login/register)
    return <>{children}</>;
  }

  // Si requiere autenticación pero no está autenticado, mostrar pantalla de carga mientras redirecciona
  if (requireAuth && !isAuthenticated) {
    return <UnifiedLoadingScreen />;
  }

  // Si requiere permisos de admin pero no los tiene, mostrar pantalla de carga mientras redirecciona
  if (requireAdmin && user?.role !== 'ADMIN') {
    return <UnifiedLoadingScreen />;
  }

  // Si el usuario acaba de loguearse, mostrar pantalla de éxito
  if (isJustLoggedIn && user) {
    return <LoginSuccessScreen username={user.username} isAfterRegistration={isAfterRegistration} />;
  }

  // Si pasa todas las validaciones, mostrar el contenido
  return <>{children}</>;
};

// HOC para páginas que requieren autenticación
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  options?: { requireAdmin?: boolean; redirectTo?: string }
) => {
  const AuthenticatedComponent: React.FC<P> = (props) => (
    <ProtectedRoute 
      requireAuth={true} 
      requireAdmin={options?.requireAdmin}
      redirectTo={options?.redirectTo}
    >
      <Component {...props} />
    </ProtectedRoute>
  );

  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  
  return AuthenticatedComponent;
};

// HOC para páginas que requieren permisos de admin
export const withAdminAuth = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return withAuth(Component, { requireAdmin: true });
};
