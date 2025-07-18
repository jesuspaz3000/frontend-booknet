'use client';

import React, { useState } from 'react';
import { Button, IconButton, Typography, Box, Paper } from '@mui/material';
import { ArrowBack, ArrowForward, MenuBook, Close } from '@mui/icons-material';
import { getChapter, getTotalChapters } from '@/constants/contentBook';
import { bookList } from '@/constants/books';
import { useRouter } from 'next/navigation';

interface ContentBookProps {
    bookId: string;
}

export default function ContentBook({ bookId }: ContentBookProps) {
    const [currentChapter, setCurrentChapter] = useState(1);
    const [showContent, setShowContent] = useState(false);
    const router = useRouter();

    // Obtener información del libro
    const book = bookList.find(b => b.id === bookId);
    const totalChapters = getTotalChapters(bookId) || 3; // Mínimo 3 capítulos para demo
    const currentChapterData = getChapter(bookId, currentChapter.toString());

    // Si no hay contenido específico, crear contenido genérico
    const displayContent = currentChapterData || {
        title: `Capítulo ${currentChapter}`,
        content: `Este es el contenido del capítulo ${currentChapter} de "${book?.name}". 

El contenido específico para este libro estará disponible próximamente. Mientras tanto, puedes navegar entre los capítulos para explorar la estructura del libro.

Esta es una plataforma estilo Netflix donde tendrás acceso a una amplia biblioteca de libros con tu suscripción. Cada libro contendrá capítulos completos para tu lectura.

¡Gracias por usar BookNet!`
    };

    const handlePreviousChapter = () => {
        if (currentChapter > 1) {
            setCurrentChapter(currentChapter - 1);
        }
    };

    const handleNextChapter = () => {
        if (currentChapter < totalChapters) {
            setCurrentChapter(currentChapter + 1);
        }
    };

    const handleStartReading = () => {
        setShowContent(true);
    };

    const handleCloseReader = () => {
        setShowContent(false);
        setCurrentChapter(1);
    };

    const handleGoBack = () => {
        router.push(`/book/${bookId}`);
    };

    // Vista previa antes de comenzar a leer
    if (!showContent) {
        return (
            <div className="tw:min-h-screen tw:py-8">
                <div className="tw:max-w-4xl tw:mx-auto tw:px-4">
                    <Button 
                        onClick={handleGoBack}
                        startIcon={<ArrowBack />}
                        variant="outlined"
                        sx={{ 
                            color: 'white',
                            borderColor: 'white',
                            '&:hover': { borderColor: '#d1d5db' },
                            mb: 6
                        }}
                    >
                        Volver al libro
                    </Button>
                    
                    <Paper sx={{ backgroundColor: '#1f2937', color: 'white', p: 8, textAlign: 'center' }}>
                        <MenuBook sx={{ fontSize: '8rem', color: '#60a5fa', mb: 6 }} />
                        <Typography variant="h3" sx={{ color: 'white', mb: 4, fontWeight: 'bold' }}>
                            {book?.name}
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#d1d5db', mb: 6 }}>
                            Disponible para lectura
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#e5e7eb', mb: 8 }}>
                            Este libro contiene {totalChapters} capítulo{totalChapters > 1 ? 's' : ''} disponible{totalChapters > 1 ? 's' : ''} para lectura.
                        </Typography>
                        <Button 
                            variant="contained" 
                            size="large"
                            onClick={handleStartReading}
                            startIcon={<MenuBook />}
                            sx={{ 
                                backgroundColor: '#2563eb',
                                '&:hover': { backgroundColor: '#1d4ed8' },
                                color: 'white'
                            }}
                        >
                            Comenzar a leer
                        </Button>
                    </Paper>
                </div>
            </div>
        );
    }

    // Vista del lector
    return (
        <div className="tw:min-h-screen">
            {/* Barra superior */}
            <Paper sx={{ backgroundColor: '#1f2937', p: 4, mb: 4, borderRadius: 0, boxShadow: 3 }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    maxWidth: '72rem', 
                    mx: 'auto' 
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton 
                            onClick={handleCloseReader} 
                            sx={{ color: '#d1d5db' }}
                        >
                            <Close />
                        </IconButton>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                            {book?.name}
                        </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#d1d5db' }}>
                        Capítulo {currentChapter} de {totalChapters}
                    </Typography>
                </Box>
            </Paper>

            {/* Contenido del capítulo */}
            <div className="tw:max-w-4xl tw:mx-auto tw:px-4 tw:pb-8">
                <Paper sx={{ backgroundColor: '#111827', p: 8, mb: 6 }}>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            color: 'white', 
                            mb: 6, 
                            fontWeight: 'bold', 
                            textAlign: 'center' 
                        }}
                    >
                        {displayContent?.title}
                    </Typography>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            lineHeight: '1.8',
                            fontSize: '1.1rem',
                            fontFamily: 'Georgia, serif',
                            color: '#f3f4f6',
                            textAlign: 'justify'
                        }}
                    >
                        {displayContent?.content}
                    </Typography>
                </Paper>

                {/* Navegación entre capítulos */}
                <div className="tw:flex tw:justify-between tw:items-center">
                    <Button
                        onClick={handlePreviousChapter}
                        disabled={currentChapter === 1}
                        startIcon={<ArrowBack />}
                        variant="outlined"
                        sx={{ 
                            color: 'white',
                            borderColor: 'white',
                            '&:hover': { borderColor: '#d1d5db' },
                            '&:disabled': { 
                                color: '#6b7280',
                                borderColor: '#6b7280'
                            },
                            minWidth: '150px'
                        }}
                    >
                        Anterior
                    </Button>
                    
                    <div className="tw:flex tw:gap-2">
                        {Array.from({ length: totalChapters }, (_, i) => (
                            <Button
                                key={i + 1}
                                onClick={() => setCurrentChapter(i + 1)}
                                variant={currentChapter === i + 1 ? "contained" : "outlined"}
                                size="small"
                                sx={currentChapter === i + 1 ? {
                                    backgroundColor: '#2563eb',
                                    '&:hover': { backgroundColor: '#1d4ed8' },
                                    color: 'white',
                                    minWidth: '40px'
                                } : {
                                    color: 'white',
                                    borderColor: 'white',
                                    '&:hover': { borderColor: '#d1d5db' },
                                    minWidth: '40px'
                                }}
                            >
                                {i + 1}
                            </Button>
                        ))}
                    </div>
                    
                    <Button
                        onClick={handleNextChapter}
                        disabled={currentChapter === totalChapters}
                        endIcon={<ArrowForward />}
                        variant="outlined"
                        sx={{ 
                            color: 'white',
                            borderColor: 'white',
                            '&:hover': { borderColor: '#d1d5db' },
                            '&:disabled': { 
                                color: '#6b7280',
                                borderColor: '#6b7280'
                            },
                            minWidth: '150px'
                        }}
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
        </div>
    );
}
