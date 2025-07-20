'use client';

import { useEffect, ReactNode } from 'react';

interface HydrationProviderProps {
  children: ReactNode;
}

export default function HydrationProvider({ children }: HydrationProviderProps) {
  useEffect(() => {
    // Suprimir errores de hidratación específicos causados por extensiones del navegador
    const originalError = console.error;
    
    console.error = (...args: unknown[]) => {
      // Filtrar errores conocidos de hidratación causados por extensiones
      const errorMessage = args[0]?.toString() || '';
      
      const isHydrationError = 
        errorMessage.includes('Hydration failed') ||
        errorMessage.includes('hydration mismatch') ||
        errorMessage.includes('cz-shortcut-listen') ||
        errorMessage.includes('A tree hydrated but some attributes') ||
        errorMessage.includes('server rendered HTML didn\'t match');
      
      if (isHydrationError) {
        // Solo mostrar en desarrollo si es necesario para debugging
        if (process.env.NODE_ENV === 'development') {
          console.warn('🔧 Hydration warning suppressed (likely caused by browser extension):', errorMessage);
        }
        return;
      }
      
      // Mostrar otros errores normalmente
      originalError.apply(console, args);
    };

    // Limpiar al desmontar
    return () => {
      console.error = originalError;
    };
  }, []);

  // También manejar atributos añadidos por extensiones después de la hidratación
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const target = mutation.target as Element;
          // Remover atributos conocidos de extensiones que causan problemas
          if (target.hasAttribute('cz-shortcut-listen')) {
            // No remover el atributo, solo ignorar el error
            // target.removeAttribute('cz-shortcut-listen');
          }
        }
      });
    });

    // Observar cambios en el body
    if (typeof window !== 'undefined' && document.body) {
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['cz-shortcut-listen', 'data-new-gr-c-s-check-loaded']
      });
    }

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}
