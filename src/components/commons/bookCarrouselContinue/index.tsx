import Image from 'next/image';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function BookCarrouselContinue({ bookList }: { bookList: { name: string; image: string, age: string, year: number, page: number }[] }) {
    const swiperCustomStyles = {
        '--swiper-navigation-color': 'white',
        '--swiper-navigation-size': '24px',
        '--swiper-pagination-color': 'white',
        '--swiper-pagination-bullet-inactive-color': 'rgba(255, 255, 255, 0.5)',
        '--swiper-pagination-bullet-inactive-opacity': '1',
    } as React.CSSProperties;

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
                {bookList.map((book, index) => (
                    <SwiperSlide key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className='tw:relative tw:flex tw:flex-col tw:items-center tw:justify-center tw:w-64 tw:h-64 tw:overflow-hidden'>
                            <div className='tw:cursor-pointer tw:border-4 tw:border-transparent tw:hover:border-4 tw:hover:border-white tw:transition-all tw-duration-300'>
                                <Image
                                    src={book.image}
                                    alt={book.name}
                                    width={1500}
                                    height={1000}
                                    className="tw:h-44 tw:object-cover tw:w-auto tw:z-25"
                                />
                                <div className='tw:absolute tw:inset-0 tw:bg-white tw:opacity-5 tw:z-20'></div>
                            </div>
                            <div className='tw:h-28 tw:w-full tw:bg-black tw:text-white tw:text-base tw:z-30 tw:relative tw:mt-2'>
                                <h2 className='tw:text-white tw:text-base tw:font-bold'>{book.name}</h2>
                                <div className='tw:flex tw:flex-row tw:justify-start tw:w-full tw:gap-2'>
                                    <p className='tw:text-white tw:text-base'>{book.age}</p>
                                    <p className='tw:text-white tw:text-base'>{book.year}</p>
                                </div>
                            </div>
                            <div className='tw:absolute tw:bottom-20 tw:w-full tw:z-30 tw:flex tw:items-center tw:justify-center tw:cursor-pointer'>
                                <div className='tw:bg-black tw:opacity-50 tw:w-full tw:h-10'></div>
                                <p className='tw:text-white tw:text-base tw:text-center tw:absolute tw:bottom-2'>Continuar página {book.page}</p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}