'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Rating, Typography, IconButton, Button, CircularProgress, Alert, Box, Pagination } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import PersonIcon from '@mui/icons-material/Person';
import userManagementService, { BookRating } from '@/services/dashboard/userManagement/userManagement.service';

interface RealReviewsProps {
    bookId: string;
    refreshTrigger?: number; // Para forzar actualización cuando el usuario agrega/edita su reseña
}

export default function RealReviews({ bookId, refreshTrigger }: RealReviewsProps) {
    const [reviews, setReviews] = useState<BookRating[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMoreReviews, setHasMoreReviews] = useState(false);
    const reviewsPerPage = 10; // Usar 10 como solicitó el usuario

    const loadReviews = useCallback(async () => {
        if (!bookId) return;
        
        try {
            setLoading(true);
            setError(null);
            
            const response = await userManagementService.getBookRatings(bookId, {
                limit: reviewsPerPage,
                offset: (currentPage - 1) * reviewsPerPage // Calcular offset basado en la página actual
            });
            
            if (response.success && response.data) {
                setReviews(response.data);
                // Calcular si hay más páginas basado en si recibimos el número completo de reseñas
                setHasMoreReviews(response.data.length === reviewsPerPage);
                
                // Calcular páginas totales aproximadas
                if (response.data.length < reviewsPerPage && currentPage === 1) {
                    setTotalPages(1);
                } else if (response.data.length < reviewsPerPage) {
                    setTotalPages(currentPage);
                } else {
                    // Estimamos que hay al menos una página más
                    setTotalPages(prev => Math.max(currentPage + 1, prev));
                }
            } else {
                setReviews([]);
                setTotalPages(1);
                setHasMoreReviews(false);
            }
        } catch (error) {
            console.error('Error cargando reseñas:', error);
            setError('Error al cargar las reseñas');
            setReviews([]);
        } finally {
            setLoading(false);
        }
    }, [bookId, currentPage, reviewsPerPage]);

    useEffect(() => {
        loadReviews();
    }, [loadReviews, refreshTrigger]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return 'Fecha no disponible';
        }
    };

    if (loading && currentPage === 1) {
        return (
            <div className="tw:flex tw:items-center tw:justify-center tw:py-8">
                <CircularProgress sx={{ color: '#60a5fa' }} />
                <Typography sx={{ color: '#9ca3af', ml: 2 }}>
                    Cargando reseñas...
                </Typography>
            </div>
        );
    }

    if (error) {
        return (
            <Alert 
                severity="error" 
                sx={{ 
                    backgroundColor: 'rgba(211, 47, 47, 0.1)',
                    border: '1px solid rgba(211, 47, 47, 0.3)',
                    color: 'white',
                    mb: 2
                }}
            >
                {error}
                <Button 
                    size="small" 
                    onClick={loadReviews}
                    sx={{ 
                        color: 'white', 
                        ml: 2,
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                    }}
                >
                    Reintentar
                </Button>
            </Alert>
        );
    }

    if (reviews.length === 0) {
        return (
            <Box className="tw:text-center tw:py-8">
                <Typography variant="h6" sx={{ color: '#9ca3af', mb: 2 }}>
                    No hay reseñas aún
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    ¡Sé el primero en dejar una reseña para este libro!
                </Typography>
            </Box>
        );
    }

    return (
        <div className="tw:w-full">
            <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 'bold' }}>
                Reseñas de la comunidad ({reviews.length > 0 ? `${reviews.length}${hasMoreReviews ? '+' : ''}` : '0'})
            </Typography>

            {loading && currentPage > 1 && (
                <div className="tw:flex tw:items-center tw:justify-center tw:py-4">
                    <CircularProgress size={24} sx={{ color: '#60a5fa' }} />
                </div>
            )}

            <div className="tw:space-y-6">
                {reviews.map((review) => (
                    <div key={`${review.userId}-${review.createdAt}`} className="tw:flex tw:gap-4 tw:w-full">
                        {/* Avatar del usuario */}
                        <div className="tw:flex tw:flex-col tw:items-center tw:justify-start tw:w-[100px] tw:flex-shrink-0">
                            <div className="tw:w-[80px] tw:h-[80px] tw:rounded-full tw:bg-gray-700 tw:flex tw:items-center tw:justify-center">
                                <PersonIcon
                                    sx={{
                                        fontSize: 40,
                                        color: '#9ca3af'
                                    }}
                                />
                            </div>
                            <Typography variant="caption" sx={{ color: '#9ca3af', mt: 1, textAlign: 'center', wordBreak: 'break-word' }}>
                                {review.username || 'Usuario anónimo'}
                            </Typography>
                        </div>

                        {/* Contenido de la reseña */}
                        <div className="tw:flex tw:flex-col tw:w-full tw:min-w-0">
                            {/* Header con rating y fecha */}
                            <div className="tw:flex tw:items-center tw:justify-between tw:mb-3 tw:flex-wrap tw:gap-2">
                                <Rating
                                    name={`review-rating-${review.userId}`}
                                    value={review.rating}
                                    precision={0.1}
                                    readOnly
                                    size="small"
                                    sx={{
                                        '& .MuiRating-iconFilled': {
                                            color: '#fbbf24'
                                        },
                                        '& .MuiRating-iconEmpty': {
                                            color: '#374151'
                                        }
                                    }}
                                />
                                <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                                    {formatDate(review.createdAt)}
                                </Typography>
                            </div>

                            {/* Título de la reseña */}
                            {review.reviewTitle && (
                                <Typography 
                                    variant="subtitle2" 
                                    sx={{ 
                                        color: '#60a5fa', 
                                        fontWeight: 'bold', 
                                        mb: 1,
                                        wordBreak: 'break-word'
                                    }}
                                >
                                    {review.reviewTitle}
                                </Typography>
                            )}

                            {/* Texto de la reseña */}
                            {review.review && (
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        color: '#d1d5db', 
                                        mb: 3, 
                                        lineHeight: 1.6,
                                        wordBreak: 'break-word'
                                    }}
                                >
                                    {review.review}
                                </Typography>
                            )}

                            {/* Acciones de la reseña */}
                            <div className="tw:flex tw:items-center tw:gap-4 tw:mt-2">
                                <IconButton 
                                    size="small"
                                    sx={{ 
                                        display: "flex", 
                                        alignItems: "center", 
                                        gap: 1,
                                        color: '#9ca3af',
                                        '&:hover': { color: '#60a5fa' },
                                        padding: '4px 8px'
                                    }}
                                >
                                    <ThumbUpIcon sx={{ fontSize: 16 }} />
                                    <Typography sx={{ fontSize: '0.75rem' }}>
                                        Útil ({review.helpfulVotes || 0})
                                    </Typography>
                                </IconButton>
                                <IconButton 
                                    size="small"
                                    sx={{ 
                                        display: "flex", 
                                        alignItems: "center", 
                                        gap: 1,
                                        color: '#9ca3af',
                                        '&:hover': { color: '#60a5fa' },
                                        padding: '4px 8px'
                                    }}
                                >
                                    <ModeCommentIcon sx={{ fontSize: 16 }} />
                                    <Typography sx={{ fontSize: '0.75rem' }}>
                                        Responder
                                    </Typography>
                                </IconButton>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <Box className="tw:flex tw:justify-center tw:mt-6">
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        sx={{
                            '& .MuiPaginationItem-root': {
                                color: '#9ca3af',
                                '&:hover': {
                                    backgroundColor: 'rgba(96, 165, 250, 0.1)'
                                }
                            },
                            '& .Mui-selected': {
                                backgroundColor: '#2563eb !important',
                                color: 'white'
                            }
                        }}
                    />
                </Box>
            )}
        </div>
    );
}
