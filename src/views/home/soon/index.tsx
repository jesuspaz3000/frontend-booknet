'use client'

import { bookList } from '@/constants/books';
import BookCarrousel from '@/components/commons/bookCarrousel';

export default function Soon() {
    return (
        <div className='tw:mb-8'>
            <h1 className="tw:px-16 tw:text-2xl tw:font-bold tw:mb-4">Próximamente</h1>
            <BookCarrousel bookList={bookList} />
        </div>
    );
}