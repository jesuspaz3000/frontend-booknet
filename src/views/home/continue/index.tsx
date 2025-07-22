'use client';

import { useState, useEffect } from 'react';
import { CircularProgress, Typography, Box, Button } from '@mui/material';
import BookCarrouselContinue from '@/components/commons/bookCarrouselContinue';
import bookManagementService, { Book } from '@/services/dashboard/bookManagement/bookManagement.service';

export default function Continue() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Función para obtener libros destacados de la base de datos
    const fetchContinueBooks = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Obtener libros destacados basados en puntuaciones
            const response = await bookManagementService.getFeaturedBooks();
            
            if (response.success && response.data) {
                setBooks(response.data);
            } else {
                setError('No se pudieron cargar los libros para continuar');
            }
        } catch (err) {
            console.error('Error al cargar libros para continuar:', err);
            setError('Error al cargar los libros para continuar');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContinueBooks();
    }, []);

    // Mostrar estado de carga
    if (loading) {
        return (
            <div className="tw:mb-8 tw:px-16">
                <h1 className="tw:text-2xl tw:font-bold tw:mb-4">Continuar leyendo</h1>
                <Box className="tw:flex tw:items-center tw:justify-center tw:py-8">
                    <CircularProgress sx={{ color: 'white', mr: 2 }} />
                    <Typography variant="body1" sx={{ color: 'white' }}>
                        Cargando libros para continuar...
                    </Typography>
                </Box>
            </div>
        );
    }

    // Mostrar estado de error
    if (error) {
        return (
            <div className="tw:mb-8 tw:px-16">
                <h1 className="tw:text-2xl tw:font-bold tw:mb-4">Continuar leyendo</h1>
                <Box className="tw:text-center tw:py-8">
                    <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
                        {error}
                    </Typography>
                    <Button 
                        variant="contained" 
                        onClick={fetchContinueBooks}
                        sx={{ backgroundColor: '#ef4444', color: 'white', '&:hover': { backgroundColor: '#dc2626' } }}
                    >
                        Reintentar
                    </Button>
                </Box>
            </div>
        );
    }

    // Si no hay libros, mostrar mensaje
    if (books.length === 0) {
        return (
            <div className="tw:mb-8 tw:px-16">
                <h1 className="tw:text-2xl tw:font-bold tw:mb-4">Continuar leyendo</h1>
                <Typography variant="body1" sx={{ color: 'white', textAlign: 'center', py: 4 }}>
                    No hay libros para continuar disponibles
                </Typography>
            </div>
        );
    }

    return (
        <div>
            <h1 className="tw:px-16 tw:text-2xl tw:font-bold tw:mb-4">Continuar leyendo</h1>
            <BookCarrouselContinue bookList={books} />
        </div>
    );
}
