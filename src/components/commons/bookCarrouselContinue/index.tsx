import { useState } from 'react';
import Image from 'next/image';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Typography } from '@mui/material';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Book {
    id: string;
    title: string;
    coverImage?: string;
    ageRating?: string;
    publicationYear?: number;
    pageCount?: number;
}

export default function BookCarrouselContinue({ bookList }: { bookList: Book[] }) {
    const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

    const swiperCustomStyles = {
        '--swiper-navigation-color': 'white',
        '--swiper-navigation-size': '24px',
        '--swiper-pagination-color': 'white',
        '--swiper-pagination-bullet-inactive-color': 'rgba(255, 255, 255, 0.5)',
        '--swiper-pagination-bullet-inactive-opacity': '1',
    } as React.CSSProperties;

    // Función para manejar errores de carga de imagen
    const handleImageError = (bookId: string) => {
        setImageErrors(prev => ({ ...prev, [bookId]: true }));
    };

    // Función para verificar si una URL de imagen es válida
    const isValidImageUrl = (url: string | undefined | null): boolean => {
        if (!url || url.trim() === '') return false;
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    return (
        <div>
            <Swiper
                style={swiperCustomStyles}
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={10}
                slidesPerView={6}
                navigation
                centeredSlides={false}
                slidesOffsetBefore={60}
                initialSlide={0}
            >
                {bookList.map((book) => {
                    const shouldShowPlaceholder = !isValidImageUrl(book.coverImage) || imageErrors[book.id];

                    // Validar que el libro tenga datos esenciales
                    const hasValidData = book.id && book.title;

                    if (!hasValidData) {
                        return (
                            <SwiperSlide key={book.id || 'invalid'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div className='tw:relative tw:flex tw:flex-col tw:items-center tw:justify-center tw:w-64 tw:h-64 tw:overflow-hidden'>
                                    <div className="tw:h-44 tw:w-32 tw:bg-red-800 tw:rounded-lg tw:shadow-xl tw:border-4 tw:border-red-600 tw:flex tw:flex-col tw:items-center tw:justify-center tw:text-white tw:relative tw:overflow-hidden">
                                        <div className="tw:text-center tw:z-10 tw:px-2">
                                            <div className="tw:text-2xl tw:mb-2 tw:opacity-60">
                                                ⚠️
                                            </div>
                                            <Typography variant="caption" sx={{ fontWeight: 'bold', opacity: 0.9, fontSize: '0.6rem' }}>
                                                Datos faltantes
                                            </Typography>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    }

                    return (
                        <SwiperSlide key={book.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Link href={`/book/${book.id}`}>
                                <div className='tw:relative tw:flex tw:flex-col tw:items-center tw:justify-start tw:w-48 tw:h-72 tw:cursor-pointer tw:group tw:bg-black/20 tw:backdrop-blur-sm tw:rounded-xl tw:p-4 tw:border tw:border-gray-700/50 tw:hover:bg-black/30 tw:hover:border-gray-500/70 tw:transition-all tw:duration-300 tw:mt-4 tw:mb-8'>
                                    {/* Contenedor de la imagen del libro */}
                                    <div className='tw:relative tw:w-32 tw:h-44 tw:rounded-lg tw:overflow-hidden tw:shadow-lg tw:border-2 tw:border-gray-600 tw:group-hover:border-white tw:transition-all tw:duration-300'>
                                        {shouldShowPlaceholder ? (
                                            <div className="tw:w-full tw:h-full tw:bg-gradient-to-b tw:from-gray-700 tw:to-gray-800 tw:flex tw:flex-col tw:items-center tw:justify-center tw:text-white">
                                                <div className="tw:text-center">
                                                    <div className="tw:text-2xl tw:mb-2 tw:opacity-60">
                                                        📚
                                                    </div>
                                                    <Typography variant="caption" sx={{ fontWeight: 'bold', opacity: 0.9, fontSize: '0.6rem' }}>
                                                        Sin imagen
                                                    </Typography>
                                                </div>
                                            </div>
                                        ) : (
                                            <Image
                                                src={book.coverImage!}
                                                alt={book.title}
                                                width={300}
                                                height={400}
                                                className="tw:w-full tw:h-full tw:object-cover"
                                                onError={() => {
                                                    console.log(`Error cargando imagen para: ${book.title}`);
                                                    handleImageError(book.id);
                                                }}
                                            />
                                        )}
                                        
                                        {/* Overlay para el botón "Continuar" */}
                                        <div className='tw:absolute tw:bottom-0 tw:left-0 tw:right-0 tw:bg-gradient-to-t tw:from-black/80 tw:to-transparent tw:p-2'>
                                            <div className='tw:text-center'>
                                                <Typography 
                                                    variant="caption" 
                                                    sx={{ 
                                                        color: 'white', 
                                                        fontWeight: 'bold', 
                                                        fontSize: '0.7rem',
                                                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                                                    }}
                                                >
                                                    Continuar página {book.pageCount || 'N/A'}
                                                </Typography>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Información del libro */}
                                    <div className='tw:w-full tw:mt-3 tw:text-center'>
                                        <h3 className='tw:text-white tw:text-sm tw:font-bold tw:mb-1 tw:line-clamp-2 tw:leading-tight'>
                                            {book.title}
                                        </h3>
                                        <div className='tw:flex tw:flex-row tw:justify-center tw:items-center tw:gap-2 tw:text-xs tw:text-gray-300'>
                                            <span className='tw:bg-gray-700 tw:px-2 tw:py-1 tw:rounded tw:text-xs'>
                                                {book.ageRating || 'N/A'}
                                            </span>
                                            <span className='tw:text-gray-400'>
                                                {book.publicationYear || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
}