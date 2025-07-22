'use client';

import { useState, useEffect } from 'react';
import { CircularProgress, Typography, Box, Button } from '@mui/material';
import BookTop from '@/components/commons/bookTop';
import bookManagementService, { Book } from '@/services/dashboard/bookManagement/bookManagement.service';

interface BookWithRanking extends Book {
    ranked: number;
}

export default function TopRead() {
    const [books, setBooks] = useState<BookWithRanking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Función para obtener los libros destacados de la base de datos
    const fetchTopBooks = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Obtener los libros destacados basados en puntuaciones
            const response = await bookManagementService.getFeaturedBooks();
            
            if (response.success && response.data) {
                // Agregar el ranking a cada libro
                const booksWithRanking: BookWithRanking[] = response.data.map((book, index) => ({
                    ...book,
                    ranked: index + 1
                }));
                setBooks(booksWithRanking);
            } else {
                setError('No se pudieron cargar los libros más leídos');
            }
        } catch (err) {
            console.error('Error al cargar top libros:', err);
            setError('Error al cargar los libros más leídos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopBooks();
    }, []);

    // Mostrar estado de carga
    if (loading) {
        return (
            <div className="tw:px-16 tw:mb-8">
                <div className="tw:flex tw:flex-row tw:gap-4 tw:text-center tw:mb-8">
                    <div className="tw:flex tw:justify-center tw:items-center">
                        <h1 className="tw:text-8xl text-black-white-border">TOP 10</h1>
                    </div>
                    <div className="tw:flex tw:flex-col tw:justify-center tw:items-start tw:gap-0 tw:mt-2">
                        <p className="tw:text-2xl tw:uppercase tw:tracking-[0.2em]">libros</p>
                        <p className="tw:text-2xl tw:uppercase tw:tracking-[0.2em]">hoy</p>
                    </div>
                </div>
                <Box className="tw:flex tw:items-center tw:justify-center tw:py-8">
                    <CircularProgress sx={{ color: 'white', mr: 2 }} />
                    <Typography variant="body1" sx={{ color: 'white' }}>
                        Cargando top libros...
                    </Typography>
                </Box>
            </div>
        );
    }

    // Mostrar estado de error
    if (error) {
        return (
            <div className="tw:px-16 tw:mb-8">
                <div className="tw:flex tw:flex-row tw:gap-4 tw:text-center tw:mb-8">
                    <div className="tw:flex tw:justify-center tw:items-center">
                        <h1 className="tw:text-8xl text-black-white-border">TOP 10</h1>
                    </div>
                    <div className="tw:flex tw:flex-col tw:justify-center tw:items-start tw:gap-0 tw:mt-2">
                        <p className="tw:text-2xl tw:uppercase tw:tracking-[0.2em]">libros</p>
                        <p className="tw:text-2xl tw:uppercase tw:tracking-[0.2em]">hoy</p>
                    </div>
                </div>
                <Box className="tw:text-center tw:py-8">
                    <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
                        {error}
                    </Typography>
                    <Button 
                        variant="contained" 
                        onClick={fetchTopBooks}
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
            <div className="tw:px-16 tw:mb-8">
                <div className="tw:flex tw:flex-row tw:gap-4 tw:text-center tw:mb-8">
                    <div className="tw:flex tw:justify-center tw:items-center">
                        <h1 className="tw:text-8xl text-black-white-border">TOP 10</h1>
                    </div>
                    <div className="tw:flex tw:flex-col tw:justify-center tw:items-start tw:gap-0 tw:mt-2">
                        <p className="tw:text-2xl tw:uppercase tw:tracking-[0.2em]">libros</p>
                        <p className="tw:text-2xl tw:uppercase tw:tracking-[0.2em]">hoy</p>
                    </div>
                </div>
                <Typography variant="body1" sx={{ color: 'white', textAlign: 'center', py: 4 }}>
                    No hay libros top disponibles
                </Typography>
            </div>
        );
    }

    return (
        <div className="tw:px-16 tw:mb-8">
            <div className="tw:flex tw:flex-row tw:gap-4 tw:text-center tw:mb-8">
                <div className="tw:flex tw:justify-center tw:items-center">
                    <h1 className="tw:text-8xl text-black-white-border">TOP 10</h1>
                </div>
                <div className="tw:flex tw:flex-col tw:justify-center tw:items-start tw:gap-0 tw:mt-2">
                    <p className="tw:text-2xl tw:uppercase tw:tracking-[0.2em]">libros</p>
                    <p className="tw:text-2xl tw:uppercase tw:tracking-[0.2em]">hoy</p>
                </div>
            </div>
            <BookTop bookList={books} />
        </div>
    );
}
