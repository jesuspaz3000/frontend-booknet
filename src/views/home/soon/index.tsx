'use client';

import { useState, useEffect } from 'react';
import { CircularProgress, Typography, Box, Button } from '@mui/material';
import BookCarrousel from '@/components/commons/bookCarrousel';
import bookManagementService, { Book } from '@/services/dashboard/bookManagement/bookManagement.service';

export default function Soon() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Función para obtener libros próximamente de la base de datos
    const fetchSoon = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Obtener libros próximamente (offset 55 para obtener diferentes libros)
            const response = await bookManagementService.getBooks({ limit: 12, offset: 55 });
            
            if (response.success && response.data.books) {
                setBooks(response.data.books);
            } else {
                setError('No se pudieron cargar los libros próximamente');
            }
        } catch (err) {
            console.error('Error al cargar libros próximamente:', err);
            setError('Error al cargar los libros próximamente');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSoon();
    }, []);

    // Mostrar estado de carga
    if (loading) {
        return (
            <div className="tw:mb-8 tw:px-16">
                <h1 className="tw:text-2xl tw:font-bold tw:mb-4">Próximamente</h1>
                <Box className="tw:flex tw:items-center tw:justify-center tw:py-8">
                    <CircularProgress sx={{ color: 'white', mr: 2 }} />
                    <Typography variant="body1" sx={{ color: 'white' }}>
                        Cargando libros próximamente...
                    </Typography>
                </Box>
            </div>
        );
    }

    // Mostrar estado de error
    if (error) {
        return (
            <div className="tw:mb-8 tw:px-16">
                <h1 className="tw:text-2xl tw:font-bold tw:mb-4">Próximamente</h1>
                <Box className="tw:text-center tw:py-8">
                    <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
                        {error}
                    </Typography>
                    <Button 
                        variant="contained" 
                        onClick={fetchSoon}
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
                <h1 className="tw:text-2xl tw:font-bold tw:mb-4">Próximamente</h1>
                <Typography variant="body1" sx={{ color: 'white', textAlign: 'center', py: 4 }}>
                    No hay libros próximamente disponibles
                </Typography>
            </div>
        );
    }

    return (
        <div className='tw:mb-8'>
            <h1 className="tw:px-16 tw:text-2xl tw:font-bold tw:mb-4">Próximamente</h1>
            <BookCarrousel bookList={books} />
        </div>
    );
}