'use client';

import { useState } from 'react';

import Image from 'next/image';
import { Button } from '@mui/material';

import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Estilos personalizados para Swiper
const swiperStyles = `
  .swiper-button-next,
  .swiper-button-prev {
    color: white !important;
  }
  
  .swiper-button-next::after,
  .swiper-button-prev::after {
    font-size: 24px !important;
  }
  
  .swiper-pagination-bullet {
    background: rgba(255, 255, 255, 0.5) !important;
  }
  
  .swiper-pagination-bullet-active {
    background: white !important;
  }
`;

const books = [
    {
        name: "El Señor de los anillos",
        image: "/Images/senior-de-los-anillos.jpg",
        description: "La historia de un grupo de amigos que se embarcan en una aventura épica para salvar el mundo.",
        age: '16+',
        year: 2003,
        rating: 4.5,
        reviews: 100,
        price: 19.99
    },
    {
        name: "El Hobbit",
        image: "/Images/el-hobbit.jpg",
        description: "Un hobbit que se embarca en una aventura épica para salvar el mundo.",
        age: '16+',
        year: 2003,
        rating: 4.5,
        reviews: 100,
        price: 19.99
    },
    {
        name: "Jardines de la Luna",
        image: "/Images/jardines-de-la-luna.jpg",
        description: "Una epopeya de fantasía donde imperios se desmoronan, dioses despiertan y el destino de mundos pende de un hilo. ¿Estás listo para el inicio de una saga legendaria?",
        age: '16+',
        year: 2003,
        rating: 4.5,
        reviews: 100,
        price: 19.99
    }
];

export default function Hero() {
    const [activeSlide, setActiveSlide] = useState(0);

    const handleSlideChange = (swiper: SwiperType) => {
        setActiveSlide(swiper.realIndex);
    };

    return (
        <>
            <style jsx global>{swiperStyles}</style>
            <div className="tw:h-screen tw:w-full tw:flex tw:items-start tw:justify-center tw:relative">
                <Swiper
                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                    spaceBetween={10}
                    slidesPerView={1}
                    loop={true}
                    navigation
                    pagination={{ clickable: true }}
                    onSlideChange={handleSlideChange}
                    onSwiper={(swiper) => setActiveSlide(swiper.realIndex)}
                >
                    {books.map((book, index) => (
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
                        <h1 className="tw:text-5xl 2xl:tw:text-7xl tw:text-white tw-font-bold">{books[activeSlide].name}</h1>
                        <div className="tw:flex tw:gap-4">
                            <span className="tw:text-white">{books[activeSlide].age}</span>
                            <span className="tw:text-white">{books[activeSlide].year}</span>
                        </div>
                        <p className="tw:text-white tw:text-xl 2xl:tw:text-2xl">{books[activeSlide].description}</p>
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