'use client';

import { useState, useEffect } from 'react';
import { CircularProgress, Typography, Box, Button } from '@mui/material';
import BookCarrousel from '@/components/commons/bookCarrousel';
import bookManagementService, { Book } from '@/services/dashboard/bookManagement/bookManagement.service';

export default function Sagas() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Función para obtener libros de sagas de la base de datos
    const fetchSagas = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Obtener libros de sagas (offset 40 para obtener diferentes libros)
            const response = await bookManagementService.getBooks({ limit: 12, offset: 40 });
            
            if (response.success && response.data.books) {
                setBooks(response.data.books);
            } else {
                setError('No se pudieron cargar las sagas');
            }
        } catch (err) {
            console.error('Error al cargar sagas:', err);
            setError('Error al cargar las sagas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSagas();
    }, []);

    // Mostrar estado de carga
    if (loading) {
        return (
            <div className="tw:mb-8 tw:px-16">
                <h1 className="tw:text-2xl tw:font-bold tw:mb-4">Sagas</h1>
                <Box className="tw:flex tw:items-center tw:justify-center tw:py-8">
                    <CircularProgress sx={{ color: 'white', mr: 2 }} />
                    <Typography variant="body1" sx={{ color: 'white' }}>
                        Cargando sagas...
                    </Typography>
                </Box>
            </div>
        );
    }

    // Mostrar estado de error
    if (error) {
        return (
            <div className="tw:mb-8 tw:px-16">
                <h1 className="tw:text-2xl tw:font-bold tw:mb-4">Sagas</h1>
                <Box className="tw:text-center tw:py-8">
                    <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
                        {error}
                    </Typography>
                    <Button 
                        variant="contained" 
                        onClick={fetchSagas}
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
                <h1 className="tw:text-2xl tw:font-bold tw:mb-4">Sagas</h1>
                <Typography variant="body1" sx={{ color: 'white', textAlign: 'center', py: 4 }}>
                    No hay sagas disponibles
                </Typography>
            </div>
        );
    }

    return (
        <div className='tw:mb-8'>
            <h1 className="tw:px-16 tw:text-2xl tw:font-bold tw:mb-4">Sagas</h1>
            <BookCarrousel bookList={books} />
        </div>
    );
}