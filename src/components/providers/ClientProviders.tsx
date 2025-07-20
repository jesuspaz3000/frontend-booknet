'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import HydrationProvider from './HydrationProvider';

// Importar AuthProvider dinámicamente sin SSR para evitar errores de hidratación
const AuthProvider = dynamic(
  () => import('../../contexts/AuthContext').then(mod => ({ default: mod.AuthProvider })),
  { 
    ssr: false,
    loading: () => (
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
    )
  }
);

interface ClientProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <HydrationProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </HydrationProvider>
  );
}
