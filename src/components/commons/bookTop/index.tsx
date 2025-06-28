import Image from 'next/image';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function BookTop({ bookList }: { bookList: { name: string; image: string, ranked: number }[] }) {
    const swiperCustomStyles = {
        '--swiper-navigation-color': 'white',
        '--swiper-navigation-size': '24px',
        '--swiper-pagination-color': 'white',
        '--swiper-pagination-bullet-inactive-color': 'rgba(255, 255, 255, 0.5)',
        '--swiper-pagination-bullet-inactive-opacity': '1',
    } as React.CSSProperties;

    const rankedPosition = (ranked: number) => {
        if (ranked === 1) {
            return (
                <p className='text-black-white-border tw:text-[7rem] tw:text-center tw:absolute tw:bottom-[-20px] tw:left-[-25px]'>{ranked}</p>
            );
        }
        if (ranked < 10) {
            return (
                <p className='text-black-white-border tw:text-[7rem] tw:text-center tw:absolute tw:bottom-[-20px] tw:left-[-35px]'>{ranked}</p>
            );
        } else {
            return (
                <p className='text-black-white-border tw:text-[7rem] tw:text-center tw:absolute tw:bottom-[-20px] tw:left-[-95px]'>{ranked}</p>
            );
        }
    }

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
                {bookList.map((book, index) => (
                    <SwiperSlide key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className='tw:relative tw:flex tw:flex-col tw:items-center tw:justify-center tw:w-52 tw:h-64 tw:group'>
                            <Image
                                src={book.image}
                                alt={book.name}
                                width={1500}
                                height={1000}
                                className="tw:h-64 tw:object-cover tw:w-auto tw:z-25 tw:cursor-pointer tw:border-4 tw:border-transparent tw:hover:border-4 tw:hover:border-white tw:transition-all tw-duration-300"
                            />
                            <div className='tw:absolute tw:bottom-0 tw:w-full tw:z-20 tw:flex tw:items-center tw:justify-start tw:group-hover:scale-105 tw:transition-all tw-duration-300 tw:cursor-default'>
                                {rankedPosition(book.ranked)}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}