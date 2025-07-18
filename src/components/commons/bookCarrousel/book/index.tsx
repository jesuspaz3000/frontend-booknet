'use client';

import { bookList } from "@/constants/books";
import { authors } from "@/constants/authors";
import { users } from "@/constants/users";
import Image from "next/image";
import PersonIcon from '@mui/icons-material/Person';
import CommunityReviews from './communityReviews';
import { Rating, IconButton, Typography, Button } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import { useRouter } from 'next/navigation';

interface Props {
    id: string;
}

export default function Book({ id }: Props) {
    const router = useRouter();
    
    // Buscar el libro una sola vez
    const book = bookList.find((book) => book.id === id);

    // Si no encuentra el libro, mostrar mensaje de error
    if (!book) {
        return <div className="tw:text-white">Libro no encontrado</div>;
    }

    // Buscar el autor por authorId (usando la estructura actualizada)
    const author = authors.find((author) => author.id === book.authorId);

    // Función para navegar al contenido del libro
    const handleReadBook = () => {
        router.push(`/book/${id}/content`);
    };

    return (
        <div className="tw:w-full tw:h-screen">
            <div className="tw:w-full tw:h-screen tw:px-16 tw:pt-48 tw:gap-10">
                <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:fixed tw:h-[40rem] tw:w-[28rem] tw:mt-14">
                    <Image
                        src={book.image}
                        alt={book.name}
                        width={1500}
                        height={1000}
                        className="tw:h-[45rem] tw:object-cover tw:w-auto tw:z-25"
                    />
                    <div className="tw:flex tw:items-center tw:justify-center tw:mt-8 tw:w-full">
                        <Button 
                            variant="contained" 
                            sx={{ 
                                width: '100%',
                                backgroundColor: '#2563eb',
                                '&:hover': { backgroundColor: '#1d4ed8' },
                                color: 'white',
                                fontWeight: 600
                            }}
                            onClick={handleReadBook}
                        >
                            Leer libro
                        </Button>
                    </div>
                </div>
                <div className="tw:flex tw:flex-col tw:pl-[30rem]">
                    <div className="tw:flex tw:flex-col tw:items-start tw:justify-center tw:mb-8">
                        <h1 className="tw:text-4xl tw:font-bold tw:mb-4 tw:text-white">{book.name}</h1>
                        <h2 className="tw:text-2xl tw:font-semibold tw:mb-2 tw:text-gray-300">
                            {author?.name || "Autor desconocido"}
                        </h2>
                        <p className="tw:text-base tw:text-gray-300">{book.resume}</p>
                        <p className="tw:mt-4 tw:text-gray-300">
                            <strong className="tw:text-white">Género:</strong> {book.genre.length > 0 ? book.genre.join(", ") : "Sin géneros"}
                        </p>
                    </div>
                    <hr className="tw:border-gray-600" />
                    <div className="tw:w-full tw:my-8">
                        <h3 className="tw:text-xl tw:font-semibold tw:text-white">Sobre el autor:</h3>
                        <div className="tw:flex tw:items-center tw:gap-4 tw:mt-4">
                            {/* Renderizado condicional para imagen o ícono */}
                            {author?.image ? (
                                <Image
                                    src={author.image}
                                    alt={author.name}
                                    width={100}
                                    height={100}
                                    className="tw:rounded-full tw:object-cover tw:w-[100px] tw:h-[100px]"
                                />
                            ) : (
                                <div className="tw:w-[100px] tw:h-[100px] tw:rounded-full tw:bg-gray-700 tw:flex tw:items-center tw:justify-center">
                                    <PersonIcon
                                        sx={{
                                            fontSize: 60,
                                            color: '#9ca3af'
                                        }}
                                    />
                                </div>
                            )}
                            <div className="tw:flex tw:flex-col">
                                <p className="tw:text-base tw:text-white">
                                    {author?.name || "Información del autor no disponible"}
                                </p>
                                <p className="tw:text-base tw:text-gray-400">
                                    {author?.totalBooks ? `${author.totalBooks} libro(s)` : "Sin libros"}
                                </p>
                            </div>
                        </div>
                        <p className="tw:mt-2 tw:text-gray-300">
                            {author?.about || "No hay información disponible sobre el autor."}
                        </p>
                    </div>
                    <hr className="tw:border-gray-600" />

                    {/* Reemplaza la sección anterior con el nuevo componente */}
                    <CommunityReviews
                        averageRating={book.calification || 0}
                        totalRatings={9820}
                        totalReviews={1208}
                    />

                    <hr className="tw:my-8 tw:border-gray-600" />

                    {users.map((user) => (
                        <div key={user.id} className="tw:flex tw:gap-4 tw:mb-6 tw:w-full">
                            <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:w-[100px]">
                                <Image
                                    src={user.image}
                                    alt={user.name}
                                    width={80}
                                    height={80}
                                    className="tw:rounded-full tw:object-cover tw:w-[80px] tw:h-[80px]"
                                />
                                <p className="tw:text-sm tw:text-gray-300 tw:mt-2 tw:text-center">{user.name}</p>
                            </div>
                            <div className="tw:flex tw:flex-col tw:w-full">
                                <div className="tw:flex tw:items-center tw:justify-between tw:mb-3">
                                    <Rating
                                        name={`user-rating-${user.id}`}
                                        value={user.calification}
                                        precision={0.1}
                                        readOnly
                                        sx={{
                                            '& .MuiRating-iconFilled': {
                                                color: '#fbbf24'
                                            },
                                            '& .MuiRating-iconEmpty': {
                                                color: '#374151'
                                            }
                                        }}
                                    />
                                    <p className="tw:text-sm tw:text-gray-400">{user.date}</p>
                                </div>
                                <p className="tw:text-gray-300 tw:mb-3">{user.comment}</p>
                                <div className="tw:flex tw:items-center tw:gap-4 tw:mt-2">
                                    <IconButton sx={{ 
                                        display: "flex", 
                                        alignItems: "center", 
                                        gap: 1,
                                        color: '#9ca3af',
                                        '&:hover': { color: '#60a5fa' }
                                    }}>
                                        <ThumbUpIcon sx={{ fontSize: 18 }} />
                                        <Typography sx={{ fontSize: '0.875rem' }}>Me gusta</Typography>
                                    </IconButton>
                                    <IconButton sx={{ 
                                        display: "flex", 
                                        alignItems: "center", 
                                        gap: 1,
                                        color: '#9ca3af',
                                        '&:hover': { color: '#60a5fa' }
                                    }}>
                                        <ModeCommentIcon sx={{ fontSize: 18 }} />
                                        <Typography sx={{ fontSize: '0.875rem' }}>Comentar</Typography>
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}