import { CSSProperties, useState } from 'react';
import Image from 'next/image';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import { Typography } from '@mui/material';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Book {
    id: string;
    title: string;
    coverImage?: string;
}

export default function BookCarrousel({ bookList }: { bookList: Book[] }) {
    const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

    const swiperCustomStyles = {
        '--swiper-navigation-color': 'white',
        '--swiper-navigation-size': '24px',
        '--swiper-pagination-color': 'white',
        '--swiper-pagination-bullet-inactive-color': 'rgba(255, 255, 255, 0.5)',
        '--swiper-pagination-bullet-inactive-opacity': '1',
    } as CSSProperties;

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
                slidesPerView={9}
                loop={true}
                navigation
                centeredSlides={false}
                slidesOffsetBefore={60}
                initialSlide={0}
            >
                {bookList.map((book) => {
                    const shouldShowPlaceholder = !isValidImageUrl(book.coverImage) || imageErrors[book.id];

                    return (
                        <SwiperSlide key={book.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Link href={`/book/${book.id}`}>
                                {shouldShowPlaceholder ? (
                                    <div className="tw:h-72 tw:w-48 tw:bg-gradient-to-b tw:from-gray-700 tw:to-gray-800 tw:rounded-lg tw:shadow-xl tw:border-4 tw:border-transparent tw:flex tw:flex-col tw:items-center tw:justify-center tw:text-white tw:relative tw:overflow-hidden tw:cursor-pointer hover:tw:border-white tw:transition-all tw:duration-300">
                                        {/* Efecto de brillo sutil */}
                                        <div className="tw:absolute tw:inset-0 tw:bg-gradient-to-tr tw:from-transparent tw:via-white/5 tw:to-transparent tw:pointer-events-none"></div>

                                        {/* Contenido del placeholder */}
                                        <div className="tw:text-center tw:z-10 tw:px-4">
                                            <div className="tw:text-4xl tw:mb-3 tw:opacity-60">
                                                📚
                                            </div>
                                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold', opacity: 0.9, fontSize: '0.75rem' }}>
                                                Imagen no disponible
                                            </Typography>
                                            <Typography variant="caption" sx={{ opacity: 0.7, textAlign: 'center', fontSize: '0.65rem' }}>
                                                {book.title}
                                            </Typography>
                                        </div>

                                        {/* Decoración adicional */}
                                        <div className="tw:absolute tw:top-2 tw:right-2 tw:w-2 tw:h-2 tw:bg-white/20 tw:rounded-full"></div>
                                        <div className="tw:absolute tw:bottom-2 tw:left-2 tw:w-1.5 tw:h-1.5 tw:bg-white/10 tw:rounded-full"></div>
                                    </div>
                                ) : (
                                    <Image
                                        src={book.coverImage!}
                                        alt={book.title}
                                        width={1500}
                                        height={1000}
                                        className="tw:h-72 tw:object-cover tw:w-auto tw:z-0 tw:cursor-pointer tw:border-4 tw:border-transparent tw:hover:border-4 tw:hover:border-white tw:transition-all tw:duration-300"
                                        onError={() => {
                                            console.log(`Error cargando imagen para: ${book.title}`);
                                            handleImageError(book.id);
                                        }}
                                    />
                                )}
                            </Link>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    )
}