import React, { useState, useEffect, useCallback } from 'react';
import { Rating, Typography, CircularProgress } from '@mui/material';
import userManagementService, { BookRating } from '@/services/dashboard/userManagement/userManagement.service';

interface CommunityReviewsProps {
    bookId: string;
    averageRating: number;
    totalRatings?: number;
    refreshTrigger?: number;
}

interface RatingDistribution {
    stars: number;
    count: number;
    percentage: number;
}

export default function CommunityReviews({ 
    bookId,
    averageRating, 
    totalRatings = 0,
    refreshTrigger
}: CommunityReviewsProps) {
    const [ratingDistribution, setRatingDistribution] = useState<RatingDistribution[]>([]);
    const [totalReviews, setTotalReviews] = useState(0);
    const [actualTotalRatings, setActualTotalRatings] = useState(totalRatings);
    const [loading, setLoading] = useState(true);


    const loadRealRatingDistribution = useCallback(async () => {
        if (!bookId) return;
        
        try {
            setLoading(true);
            
            // Obtener una muestra más grande para calcular distribución real
            // Usaremos limit=100 para obtener una muestra representativa
            const response = await userManagementService.getBookRatings(bookId, {
                limit: 100,
                offset: 0
            });
            
            if (response.success && response.data) {
                const ratings = response.data;
                
                // Usar el total de calificaciones del libro
                setActualTotalRatings(totalRatings || ratings.length);
                
                // Contar reseñas reales (calificaciones con texto)
                const reviewsCount = ratings.filter(r => r.review && r.review.trim().length > 0).length;
                setTotalReviews(reviewsCount);
                
                // Calcular distribución real basada en los datos obtenidos
                const distribution = calculateRealRatingDistribution(ratings, totalRatings || ratings.length);
                setRatingDistribution(distribution);
            } else {
                // Si no hay datos, usar distribución vacía
                setRatingDistribution([
                    { stars: 5, count: 0, percentage: 0 },
                    { stars: 4, count: 0, percentage: 0 },
                    { stars: 3, count: 0, percentage: 0 },
                    { stars: 2, count: 0, percentage: 0 },
                    { stars: 1, count: 0, percentage: 0 }
                ]);
                setTotalReviews(0);
                setActualTotalRatings(0);
            }
        } catch (error) {
            console.error('Error cargando distribución real de calificaciones:', error);
            // En caso de error, usar distribución vacía
            setRatingDistribution([
                { stars: 5, count: 0, percentage: 0 },
                { stars: 4, count: 0, percentage: 0 },
                { stars: 3, count: 0, percentage: 0 },
                { stars: 2, count: 0, percentage: 0 },
                { stars: 1, count: 0, percentage: 0 }
            ]);
            setTotalReviews(0);
            setActualTotalRatings(0);
        } finally {
            setLoading(false);
        }
    }, [bookId, totalRatings]);

    useEffect(() => {
        loadRealRatingDistribution();
    }, [loadRealRatingDistribution, refreshTrigger]);

    const calculateRealRatingDistribution = (ratings: BookRating[], totalCount: number): RatingDistribution[] => {
        if (ratings.length === 0) {
            return [5, 4, 3, 2, 1].map(stars => ({ stars, count: 0, percentage: 0 }));
        }
        
        // Contar calificaciones reales por estrella
        const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        
        ratings.forEach(rating => {
            const stars = Math.round(rating.rating);
            if (stars >= 1 && stars <= 5) {
                counts[stars as keyof typeof counts]++;
            }
        });
        
        const sampleSize = ratings.length;
        
        // Si tenemos una muestra representativa, calcular porcentajes reales
        // Si no, extrapolar basado en la muestra
        return [5, 4, 3, 2, 1].map(stars => {
            const sampleCount = counts[stars as keyof typeof counts];
            const samplePercentage = sampleSize > 0 ? (sampleCount / sampleSize) * 100 : 0;
            
            // Extrapolar al total real si tenemos el dato
            const estimatedTotalCount = totalCount > sampleSize 
                ? Math.round((samplePercentage / 100) * totalCount)
                : sampleCount;
            
            return {
                stars,
                count: estimatedTotalCount,
                percentage: Math.round(samplePercentage)
            };
        });
    };

    // Función para formatear números
    const formatNumber = (num: number): string => {
        return num.toLocaleString();
    };

    if (loading) {
        return (
            <div className="tw:w-full tw:mt-8">
                <h3 className="tw:text-xl tw:font-semibold tw:mb-4 tw:text-white">Reseña de la comunidad</h3>
                <div className="tw:flex tw:items-center tw:justify-center tw:py-8">
                    <CircularProgress sx={{ color: '#60a5fa' }} size={24} />
                    <Typography sx={{ color: '#9ca3af', ml: 2 }}>
                        Cargando estadísticas reales...
                    </Typography>
                </div>
            </div>
        );
    }

    return (
        <div className="tw:w-full tw:mt-8">
            <h3 className="tw:text-xl tw:font-semibold tw:mb-4 tw:text-white">Reseña de la comunidad</h3>
            
            {/* Calificación promedio */}
            <div className="tw:flex tw:items-center tw:gap-4 tw:mb-6">
                <div className="tw:flex tw:items-center tw:gap-2">
                    <Rating
                        name="community-review"
                        value={averageRating}
                        precision={0.1}
                        readOnly
                        sx={{
                            '& .MuiRating-iconFilled': {
                                color: '#fbbf24'
                            },
                            '& .MuiRating-iconEmpty': {
                                color: '#374151'
                            }
                        }}
                    />
                    <span className="tw:text-2xl tw:font-bold tw:text-white">
                        {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
                    </span>
                </div>
                <div className="tw:text-gray-300">
                    {formatNumber(actualTotalRatings)} calificaciones · {formatNumber(totalReviews)} reseñas
                </div>
            </div>

            {/* Distribución de calificaciones */}
            {actualTotalRatings > 0 ? (
                <div className="tw:space-y-2">
                    {ratingDistribution.map((rating) => (
                        <div key={rating.stars} className="tw:flex tw:items-center tw:gap-3">
                            {/* Número de estrellas */}
                            <div className="tw:flex tw:items-center tw:gap-1 tw:w-16">
                                <span className="tw:text-sm tw:font-medium tw:text-gray-300">
                                    {rating.stars} estrella{rating.stars !== 1 ? 's' : ''}
                                </span>
                            </div>
                            
                            {/* Barra de progreso */}
                            <div className="tw:flex-1 tw:bg-gray-700 tw:rounded-full tw:h-3 tw:relative tw:overflow-hidden">
                                <div 
                                    className="tw:bg-amber-500 tw:h-full tw:rounded-full tw:transition-all tw:duration-300"
                                    style={{ width: `${rating.percentage}%` }}
                                />
                            </div>
                            
                            {/* Conteo y porcentaje */}
                            <div className="tw:flex tw:items-center tw:gap-2 tw:w-24 tw:text-sm tw:text-gray-300">
                                <span>{formatNumber(rating.count)}</span>
                                <span>({rating.percentage}%)</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="tw:text-center tw:py-4">
                    <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                        Aún no hay calificaciones para este libro
                    </Typography>
                </div>
            )}
        </div>
    );
}