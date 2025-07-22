'use client';

import { useState, useEffect } from 'react';
import { Rating, Typography, Snackbar, Alert, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import EditIcon from '@mui/icons-material/Edit';
import userManagementService, { UserRating as UserRatingType } from '@/services/dashboard/userManagement/userManagement.service';

interface UserRatingProps {
    bookId: string;
    initialRating?: number;
    onRatingUpdate?: () => void;
}

export default function UserRating({ bookId, initialRating = 0, onRatingUpdate }: UserRatingProps) {
    const [userRating, setUserRating] = useState<number>(initialRating);
    const [userReview, setUserReview] = useState<UserRatingType | null>(null);
    const [hoverRating, setHoverRating] = useState<number>(-1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showReviewDialog, setShowReviewDialog] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [reviewTitle, setReviewTitle] = useState('');
    const [tempRating, setTempRating] = useState(0);

    // Cargar el rating inicial del usuario al montar el componente
    useEffect(() => {
        const loadUserRating = async () => {
            if (!bookId) return;
            
            try {
                setIsLoading(true);
                const response = await userManagementService.getMyRating(bookId);
                
                if (response.success && response.data) {
                    setUserRating(response.data.rating);
                    setUserReview(response.data);
                    setReviewText(response.data.review || '');
                    setReviewTitle(response.data.reviewTitle || '');
                } else {
                    // El usuario no ha calificado este libro aún
                    setUserRating(0);
                    setUserReview(null);
                }
            } catch (error) {
                console.error('Error cargando rating del usuario:', error);
                setUserRating(0);
                setUserReview(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadUserRating();
    }, [bookId]);

    const handleRatingChange = async (event: React.SyntheticEvent, newValue: number | null) => {
        if (newValue === null) return;
        
        // Si es la primera vez que califica o quiere cambiar, abrir diálogo
        setTempRating(newValue);
        setShowReviewDialog(true);
    };

    const handleSubmitReview = async () => {
        setIsSubmitting(true);
        setErrorMessage('');
        
        try {
            // Llamada real al servicio para enviar el rating con reseña
            const response = await userManagementService.rateBook({
                bookId: bookId,
                rating: tempRating,
                review: reviewText.trim() || undefined,
                reviewTitle: reviewTitle.trim() || undefined
            });
            
            if (response.success) {
                setUserRating(tempRating);
                setUserReview(response.data);
                setShowReviewDialog(false);
                setShowSuccess(true);
                onRatingUpdate?.(); // Notificar al componente padre
                console.log(`Rating y reseña enviados exitosamente para libro ${bookId}`);
            } else {
                throw new Error(response.message || 'Error al enviar la calificación');
            }
            
        } catch (error) {
            console.error('Error enviando rating:', error);
            const errorMsg = error instanceof Error ? error.message : 'Error al enviar la calificación';
            setErrorMessage(errorMsg);
            setShowError(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditReview = () => {
        setTempRating(userRating);
        setShowReviewDialog(true);
    };

    const getRatingText = (rating: number): string => {
        switch (rating) {
            case 1: return 'No me gustó';
            case 2: return 'Estuvo bien';
            case 3: return 'Me gustó';
            case 4: return 'Me encantó';
            case 5: return '¡Increíble!';
            default: return 'Califica este libro';
        }
    };

    const displayRating = hoverRating !== -1 ? hoverRating : userRating;

    // Mostrar indicador de carga inicial
    if (isLoading) {
        return (
            <div className="tw:flex tw:items-center tw:gap-3">
                <div className="tw:animate-spin tw:rounded-full tw:h-6 tw:w-6 tw:border-b-2 tw:border-blue-400"></div>
                <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                    Cargando calificación...
                </Typography>
            </div>
        );
    }

    return (
        <div className="tw:flex tw:flex-col tw:gap-3">
            <div className="tw:flex tw:items-center tw:gap-3">
                <Rating
                    name={`book-rating-${bookId}`}
                    value={userRating}
                    onChange={handleRatingChange}
                    onChangeActive={(event, newHover) => {
                        setHoverRating(newHover);
                    }}
                    precision={1}
                    size="large"
                    disabled={isSubmitting}
                    emptyIcon={
                        <StarIcon 
                            style={{ 
                                opacity: 0.3, 
                                color: '#9ca3af' 
                            }} 
                            fontSize="inherit" 
                        />
                    }
                    icon={
                        <StarIcon 
                            style={{ 
                                color: '#fbbf24' 
                            }} 
                            fontSize="inherit" 
                        />
                    }
                    sx={{
                        '& .MuiRating-iconFilled': {
                            color: '#fbbf24'
                        },
                        '& .MuiRating-iconHover': {
                            color: '#f59e0b'
                        },
                        '& .MuiRating-iconEmpty': {
                            color: '#374151'
                        }
                    }}
                />
                
                {isSubmitting && (
                    <div className="tw:flex tw:items-center tw:gap-2">
                        <div className="tw:animate-spin tw:rounded-full tw:h-4 tw:w-4 tw:border-b-2 tw:border-blue-400"></div>
                        <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                            Enviando...
                        </Typography>
                    </div>
                )}
            </div>
            
            <Typography 
                variant="body2" 
                sx={{ 
                    color: displayRating > 0 ? '#60a5fa' : '#9ca3af',
                    fontWeight: displayRating > 0 ? 'bold' : 'normal',
                    transition: 'all 0.2s ease'
                }}
            >
                {getRatingText(displayRating)}
            </Typography>

            {/* Mostrar reseña existente */}
            {userReview && (userReview.review || userReview.reviewTitle) && (
                <Box className="tw:mt-2 tw:p-3 tw:bg-gray-800/50 tw:rounded-lg tw:border tw:border-gray-700/50">
                    {userReview.reviewTitle && (
                        <Typography variant="subtitle2" sx={{ color: '#60a5fa', fontWeight: 'bold', mb: 1 }}>
                            {userReview.reviewTitle}
                        </Typography>
                    )}
                    {userReview.review && (
                        <Typography variant="body2" sx={{ color: '#d1d5db', mb: 2 }}>
                            {userReview.review}
                        </Typography>
                    )}
                    <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={handleEditReview}
                        sx={{ 
                            color: '#9ca3af', 
                            '&:hover': { color: '#60a5fa' },
                            textTransform: 'none'
                        }}
                    >
                        Editar reseña
                    </Button>
                </Box>
            )}

            {/* Diálogo para agregar/editar reseña */}
            <Dialog 
                open={showReviewDialog} 
                onClose={() => setShowReviewDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151'
                    }
                }}
            >
                <DialogTitle sx={{ color: 'white', borderBottom: '1px solid #374151' }}>
                    {userReview ? 'Editar tu reseña' : 'Agregar una reseña'}
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Box className="tw:flex tw:items-center tw:gap-2 tw:mb-4">
                        <Typography sx={{ color: '#d1d5db' }}>Tu calificación:</Typography>
                        <Rating
                            value={tempRating}
                            onChange={(event, newValue) => setTempRating(newValue || 0)}
                            sx={{
                                '& .MuiRating-iconFilled': { color: '#fbbf24' },
                                '& .MuiRating-iconEmpty': { color: '#374151' }
                            }}
                        />
                        <Typography sx={{ color: '#60a5fa', fontWeight: 'bold' }}>
                            {tempRating > 0 ? `${tempRating}.0` : ''}
                        </Typography>
                    </Box>
                    
                    <TextField
                        fullWidth
                        label="Título de tu reseña (opcional)"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        margin="normal"
                        placeholder="Ej: Una obra maestra"
                        InputLabelProps={{ sx: { color: '#9ca3af' } }}
                        InputProps={{
                            sx: {
                                color: 'white',
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#374151' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' }
                            }
                        }}
                    />
                    
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Tu reseña (opcional)"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        margin="normal"
                        placeholder="Comparte tu opinión sobre este libro..."
                        InputLabelProps={{ sx: { color: '#9ca3af' } }}
                        InputProps={{
                            sx: {
                                color: 'white',
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#374151' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' }
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3, borderTop: '1px solid #374151' }}>
                    <Button 
                        onClick={() => setShowReviewDialog(false)}
                        sx={{ color: '#9ca3af' }}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleSubmitReview}
                        disabled={tempRating === 0 || isSubmitting}
                        variant="contained"
                        sx={{ 
                            backgroundColor: '#2563eb',
                            '&:hover': { backgroundColor: '#1d4ed8' },
                            '&:disabled': { backgroundColor: '#374151' }
                        }}
                    >
                        {isSubmitting ? 'Enviando...' : (userReview ? 'Actualizar' : 'Publicar')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar para éxito */}
            <Snackbar
                open={showSuccess}
                autoHideDuration={3000}
                onClose={() => setShowSuccess(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setShowSuccess(false)} 
                    severity="success" 
                    sx={{ 
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        color: 'white'
                    }}
                >
                    ¡Calificación enviada exitosamente!
                </Alert>
            </Snackbar>

            {/* Snackbar para error */}
            <Snackbar
                open={showError}
                autoHideDuration={4000}
                onClose={() => setShowError(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setShowError(false)} 
                    severity="error"
                    sx={{ 
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: 'white'
                    }}
                >
                    {errorMessage || 'Error al enviar la calificación. Inténtalo de nuevo.'}
                </Alert>
            </Snackbar>
        </div>
    );
}
