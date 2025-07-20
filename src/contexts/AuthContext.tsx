'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService, User } from '../services/login/auth.service';
import { HomeService } from '../services/home/home.service';

// Tipos para el contexto
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isJustLoggedIn: boolean;
  isAfterRegistration: boolean;
  login: (credentials: { username: string; password: string }, afterRegistration?: boolean) => Promise<User>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setJustLoggedIn: (value: boolean) => void;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Props del provider
interface AuthProviderProps {
  children: ReactNode;
}

// Provider del contexto
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isJustLoggedIn, setIsJustLoggedIn] = useState(false);
  const [isAfterRegistration, setIsAfterRegistration] = useState(false);
  const router = useRouter();

  // Función para verificar autenticación
  const checkAuth = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Verificar si hay datos de usuario en localStorage
      const userData = HomeService.getUserData();
      
      if (!userData) {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      // Verificar si el token es válido
      const isValid = await HomeService.checkAndRefreshTokens();
      
      if (isValid) {
        // Token válido, establecer usuario
        // Convertir el user de HomeService al formato de AuthService
        const authUser: User = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          role: userData.role as 'USER' | 'ADMIN'
        };
        setUser(authUser);
        setIsAuthenticated(true);
      } else {
        // Token inválido, limpiar estado
        setUser(null);
        setIsAuthenticated(false);
        HomeService.clearUserData();
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      setUser(null);
      setIsAuthenticated(false);
      HomeService.clearUserData();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función de login
  const login = async (credentials: { username: string; password: string }, afterRegistration: boolean = false): Promise<User> => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      setIsJustLoggedIn(true);
      setIsAfterRegistration(afterRegistration);
      
      // Resetear el flag después de 3 segundos
      setTimeout(() => {
        setIsJustLoggedIn(false);
        setIsAfterRegistration(false);
      }, 3000);
      
      return response.user;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  // Función de logout
  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    }
  };

  // Verificar autenticación al montar el componente
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Verificación periódica cada 5 minutos
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      try {
        const isValid = await HomeService.checkAndRefreshTokens();
        if (!isValid) {
          setUser(null);
          setIsAuthenticated(false);
          router.push('/login');
        }
      } catch (error) {
        console.error('Error en verificación periódica:', error);
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [isAuthenticated, router]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    isJustLoggedIn,
    isAfterRegistration,
    login,
    logout,
    checkAuth,
    setJustLoggedIn: setIsJustLoggedIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
