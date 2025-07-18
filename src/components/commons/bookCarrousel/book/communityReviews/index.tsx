import React from 'react';
import Rating from '@mui/material/Rating';

interface CommunityReviewsProps {
    averageRating: number;
    totalRatings?: number;
    totalReviews?: number;
}

interface RatingDistribution {
    stars: number;
    count: number;
    percentage: number;
}

export default function CommunityReviews({ 
    averageRating, 
    totalRatings = 9820, 
    totalReviews = 1208 
}: CommunityReviewsProps) {
    
    // Datos estáticos para la distribución de calificaciones
    const ratingDistribution: RatingDistribution[] = [
        { stars: 5, count: 4016, percentage: 40 },
        { stars: 4, count: 3759, percentage: 38 },
        { stars: 3, count: 1610, percentage: 16 },
        { stars: 2, count: 331, percentage: 3 },
        { stars: 1, count: 104, percentage: 1 }
    ];

    // Función para formatear números
    const formatNumber = (num: number): string => {
        return num.toLocaleString();
    };

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
                        {averageRating.toFixed(2)}
                    </span>
                </div>
                <div className="tw:text-gray-300">
                    {formatNumber(totalRatings)} ratings · {formatNumber(totalReviews)} reviews
                </div>
            </div>

            {/* Distribución de calificaciones */}
            <div className="tw:space-y-2">
                {ratingDistribution.map((rating) => (
                    <div key={rating.stars} className="tw:flex tw:items-center tw:gap-3">
                        {/* Número de estrellas */}
                        <div className="tw:flex tw:items-center tw:gap-1 tw:w-16">
                            <span className="tw:text-sm tw:font-medium tw:underline tw:cursor-pointer tw:text-gray-300 hover:tw:text-white">
                                {rating.stars} star{rating.stars !== 1 ? 's' : ''}
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
        </div>
    );
}