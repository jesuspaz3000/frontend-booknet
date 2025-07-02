import Image from 'next/image';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function BookCarrousel({ bookList }: { bookList: { name: string; image: string }[] }) {
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
                        <Image
                            src={book.image}
                            alt={book.name}
                            width={1500}
                            height={1000}
                            className="tw:h-72 tw:object-cover tw:w-auto tw:z-0 tw:cursor-pointer tw:border-4 tw:border-transparent tw:hover:border-4 tw:hover:border-white tw:transition-all tw-duration-300"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}