import ContentBook from '@/components/commons/bookCarrousel/book/contentBook';
import { bookList } from '@/constants/books';

interface ContentPageProps {
    params: Promise<{
        id: string;
    }>;
}

// Función requerida para exportación estática con rutas dinámicas
export async function generateStaticParams() {
    return bookList.map((book) => ({
        id: book.id,
    }));
}

export default async function ContentPage({ params }: ContentPageProps) {
    const { id } = await params;
    return (
        <div>
            <ContentBook bookId={id} />
        </div>
    );
}
