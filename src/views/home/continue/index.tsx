'use client'

import BookCarrouselContinue from '@/components/commons/bookCarrouselContinue';
import { bookList } from '@/constants/books';

export default function Continue() {
    return (
        <div>
            <h1 className="tw:px-16 tw:text-2xl tw:font-bold tw:mb-4">Continuar leyendo</h1>
            <BookCarrouselContinue bookList={bookList} />
        </div>
    );
}
