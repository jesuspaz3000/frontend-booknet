import BookPageClient from './BookPageClient';
import { bookList } from "@/constants/books";
import Navbar from "@/views/home/navbar"

export async function generateStaticParams() {
    return bookList.map((book) => ({
        id: book.id,
    }));
}

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div>
            <Navbar />
            <BookPageClient id={id} />
        </div>
    );
}