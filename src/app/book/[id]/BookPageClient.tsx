'use client';

import Book from '@/components/commons/bookCarrousel/book';

interface BookPageClientProps {
    id: string;
}

export default function BookPageClient({ id }: BookPageClientProps) {
    return (
        <div>
            <Book id={id} />
        </div>
    );
}