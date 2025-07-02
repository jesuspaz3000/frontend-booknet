'use client'

import BookTop from '@/components/commons/bookTop';
import { bookList } from '@/constants/books';

export default function TopRead() {
    return (
        <div className="tw:px-16 tw:mb-8">
            <div className="tw:flex tw:flex-row tw:gap-4 tw:text-center tw:mb-8">
                <div className="tw:flex tw:justify-center tw:items-center">
                    <h1 className="tw:text-8xl text-black-white-border">TOP 10</h1>
                </div>
                <div className="tw:flex tw:flex-col tw:justify-center tw:items-start tw:gap-0 tw:mt-2">
                    <p className="tw:text-2xl tw:uppercase tw:tracking-[0.2em]">libros</p>
                    <p className="tw:text-2xl tw:uppercase tw:tracking-[0.2em]">hoy</p>
                </div>
            </div>
            <BookTop bookList={bookList.map((book, index) => ({ ...book, ranked: index + 1 }))} />
        </div>
    );
}
