'use client';

import { useState, CSSProperties } from 'react';

import Image from 'next/image';
import { Button } from '@mui/material';
import { booksHero } from '@/constants/booksHero';

import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Hero() {
    const [activeSlide, setActiveSlide] = useState(0);

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

    return (
        <>
            <div className="tw:h-screen tw:w-full tw:flex tw:items-start tw:justify-center tw:relative">
                <Swiper
                    style={swiperStyles}
                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                    spaceBetween={10}
                    slidesPerView={1}
                    loop={true}
                    navigation
                    pagination={{ clickable: true }}
                    onSlideChange={handleSlideChange}
                    onSwiper={(swiper) => setActiveSlide(swiper.realIndex)}
                >
                    {booksHero.map((book, index) => (
                        <SwiperSlide key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                src={book.image}
                                alt={book.name}
                                width={1500}
                                height={1000}
                                className="tw:h-[95vh] tw:object-cover tw:w-auto tw:z-0"
                            />
                            <div className="tw:absolute tw:inset-0 tw:bg-gradient-to-t tw:from-black tw:via-black/20 tw:to-transparent tw:z-10"></div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="tw:absolute tw:bottom-0 tw:w-full tw:px-16 tw:pb-[20vh] tw:flex tw:items-start tw:flex-col tw:z-10 tw:pointer-events-none">
                    <div className="tw:w-[25%] tw:py-20 tw:flex tw:flex-col tw:justify-center tw:gap-4 tw:pointer-events-auto">
                        <h1 className="tw:text-5xl 2xl:tw:text-7xl tw:text-white tw-font-bold">{booksHero[activeSlide].name}</h1>
                        <div className="tw:flex tw:gap-4">
                            <span className="tw:text-white">{booksHero[activeSlide].age}</span>
                            <span className="tw:text-white">{booksHero[activeSlide].year}</span>
                        </div>
                        <p className="tw:text-white tw:text-xl 2xl:tw:text-2xl">{booksHero[activeSlide].description}</p>
                        <Button
                            variant="contained"
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
                            Ver ahora
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}