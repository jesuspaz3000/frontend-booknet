import BookPageClient from './BookPageClient';
import Navbar from "@/views/home/navbar"

// Ya no necesitamos generateStaticParams porque permitimos rutas dinámicas
// export async function generateStaticParams() {
//     return [];
// }

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div>
            <Navbar />
            <BookPageClient id={id} />
        </div>
    );
}