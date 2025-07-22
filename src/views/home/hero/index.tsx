'use client';

import { useState, useEffect, CSSProperties } from 'react';

import Image from 'next/image';
import { Button, CircularProgress, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import bookManagementService, { Book } from '@/services/dashboard/bookManagement/bookManagement.service';

import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Hero() {
    const router = useRouter();
    const [activeSlide, setActiveSlide] = useState(0);
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

    // Función para obtener libros específicos de la base de datos
    const fetchHeroBooks = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Obtener los primeros 5 libros de la base de datos
            const response = await bookManagementService.getBooks({ limit: 5, offset: 0 });
            
            if (response.success && response.data.books) {
                setBooks(response.data.books);
            } else {
                setError('No se pudieron cargar los libros');
            }
        } catch (err) {
            console.error('Error al cargar libros para el hero:', err);
            setError('Error al cargar los libros');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHeroBooks();
    }, []);

    // Función para manejar errores de carga de imagen
    const handleImageError = (bookId: string) => {
        setImageErrors(prev => ({ ...prev, [bookId]: true }));
    };

    // Función para navegar a los detalles del libro
    const handleReadNow = () => {
        if (books[activeSlide]?.id) {
            router.push(`/book/${books[activeSlide].id}`);
        }
    };

    // Función para verificar si una URL de imagen es válida
    const isValidImageUrl = (url: string | undefined | null): boolean => {
        if (!url || url.trim() === '') return false;
        // Verificar si es una URL que parece válida
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleSlideChange = (swiper: SwiperType) => {
        setActiveSlide(swiper.realIndex);
    };

    // Estilos personalizados para Swiper
    const swiperStyles = {
        '--swiper-navigation-color': 'white',
        '--swiper-navigation-size': '24px',
        '--swiper-pagination-color': 'white',
        '--swiper-pagination-bullet-inactive-color': 'rgba(255, 255, 255, 0.5)',
        '--swiper-pagination-bullet-inactive-opacity': '1',
    } as CSSProperties;

    // Mostrar estado de carga
    if (loading) {
        return (
            <div className="tw:h-screen tw:w-full tw:flex tw:items-center tw:justify-center tw:bg-gray-900">
                <Box className="tw:text-center">
                    <CircularProgress sx={{ color: 'white', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: 'white' }}>
                        Cargando libros destacados...
                    </Typography>
                </Box>
            </div>
        );
    }

    // Mostrar estado de error
    if (error) {
        return (
            <div className="tw:h-screen tw:w-full tw:flex tw:items-center tw:justify-center tw:bg-gray-900">
                <Box className="tw:text-center">
                    <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                        {error}
                    </Typography>
                    <Button 
                        variant="contained" 
                        onClick={fetchHeroBooks}
                        sx={{ backgroundColor: 'white', color: 'black' }}
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
            <div className="tw:h-screen tw:w-full tw:flex tw:items-center tw:justify-center tw:bg-gray-900">
                <Typography variant="h6" sx={{ color: 'white' }}>
                    No hay libros disponibles para mostrar
                </Typography>
            </div>
        );
    }

    return (
        <>
            <div className="tw:h-screen tw:w-full tw:flex tw:items-start tw:justify-center tw:relative">
                <Swiper
                    style={swiperStyles}
                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                    spaceBetween={10}
                    slidesPerView={1}
                    loop={books.length > 1}
                    navigation
                    pagination={{ clickable: true }}
                    onSlideChange={handleSlideChange}
                    onSwiper={(swiper) => setActiveSlide(swiper.realIndex)}
                >
                    {books.map((book, index) => {
                        // Determinar si debe mostrar placeholder
                        const shouldShowPlaceholder = !isValidImageUrl(book.coverImage) || imageErrors[book.id];
                        
                        return (
                            <SwiperSlide key={book.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {shouldShowPlaceholder ? (
                                    <div className="tw:h-[95vh] tw:w-full tw:bg-gradient-to-br tw:from-gray-900 tw:via-gray-800 tw:to-black tw:flex tw:items-center tw:justify-center tw:z-0">
                                        {/* Rectángulo que simula la imagen del libro */}
                                        <div className="tw:w-[400px] tw:h-[600px] tw:bg-gradient-to-b tw:from-gray-700 tw:to-gray-800 tw:rounded-lg tw:shadow-2xl tw:border tw:border-gray-600 tw:flex tw:flex-col tw:items-center tw:justify-center tw:text-white tw:relative tw:overflow-hidden">
                                            {/* Efecto de brillo sutil */}
                                            <div className="tw:absolute tw:inset-0 tw:bg-gradient-to-tr tw:from-transparent tw:via-white/5 tw:to-transparent tw:pointer-events-none"></div>
                                            
                                            {/* Contenido del placeholder */}
                                            <div className="tw:text-center tw:z-10 tw:px-8">
                                                <div className="tw:text-6xl tw:mb-4 tw:opacity-60">
                                                    📚
                                                </div>
                                                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', opacity: 0.9 }}>
                                                    Imagen no disponible
                                                </Typography>
                                                <Typography variant="body1" sx={{ mb: 3, opacity: 0.7, textAlign: 'center' }}>
                                                    La portada de este libro será agregada próximamente
                                                </Typography>
                                                <div className="tw:w-full tw:h-1 tw:bg-gradient-to-r tw:from-transparent tw:via-white/30 tw:to-transparent tw:rounded"></div>
                                            </div>
                                            
                                            {/* Decoración adicional */}
                                            <div className="tw:absolute tw:top-4 tw:right-4 tw:w-3 tw:h-3 tw:bg-white/20 tw:rounded-full"></div>
                                            <div className="tw:absolute tw:bottom-4 tw:left-4 tw:w-2 tw:h-2 tw:bg-white/10 tw:rounded-full"></div>
                                        </div>
                                    </div>
                                ) : (
                                    <Image
                                        src={book.coverImage!}
                                        alt={book.title}
                                        width={1500}
                                        height={1000}
                                        className="tw:h-[95vh] tw:object-cover tw:w-auto tw:z-0"
                                        priority={index === 0}
                                        onError={() => {
                                            console.log(`Error cargando imagen para: ${book.title}`);
                                            handleImageError(book.id);
                                        }}
                                    />
                                )}
                                <div className="tw:absolute tw:inset-0 tw:bg-gradient-to-t tw:from-black tw:via-black/20 tw:to-transparent tw:z-10"></div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
                <div className="tw:absolute tw:bottom-0 tw:w-full tw:px-16 tw:pb-[20vh] tw:flex tw:items-start tw:flex-col tw:z-10 tw:pointer-events-none">
                    <div className="tw:w-[25%] tw:py-20 tw:flex tw:flex-col tw:justify-center tw:gap-4 tw:pointer-events-auto">
                        <h1 className="tw:text-5xl 2xl:tw:text-7xl tw:text-white tw-font-bold">{books[activeSlide]?.title}</h1>
                        <div className="tw:flex tw:gap-4">
                            <span className="tw:text-white">{books[activeSlide]?.ageRating}</span>
                            <span className="tw:text-white">{books[activeSlide]?.publicationYear}</span>
                            {books[activeSlide]?.language && (
                                <span className="tw:text-white">{books[activeSlide].language}</span>
                            )}
                        </div>
                        <p className="tw:text-white tw:text-xl 2xl:tw:text-2xl">
                            {books[activeSlide]?.description || 'Descripción no disponible'}
                        </p>
                        <div className="tw:flex tw:gap-4 tw:mb-4">
                            {books[activeSlide]?.averageRating && (
                                <span className="tw:text-yellow-400">
                                    ★ {books[activeSlide].averageRating.toFixed(1)}
                                </span>
                            )}
                            {books[activeSlide]?.totalRatings && (
                                <span className="tw:text-gray-300">
                                    ({books[activeSlide].totalRatings} reseñas)
                                </span>
                            )}
                        </div>
                        <Button
                            variant="contained"
                            onClick={handleReadNow}
                            sx={{
                                backgroundColor: 'white',
                                color: 'black',
                                width: '250px',
                                transition: 'all 0.3s ease',
                                textTransform: 'none',
                                fontSize: '1.5rem',
                                borderRadius: '10px',
                                '&:hover': {
                                    boxShadow: '0 0 8px 2px rgba(255, 255, 255, 0.3)',
                                },
                            }}
                        >
                            Leer ahora
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}