'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import PersonIcon from '@mui/icons-material/Person';
import CommunityReviews from './communityReviews';
import RealReviews from './realReviews';
import { Typography, Button, CircularProgress, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import bookManagementService, { Book as BookType } from '@/services/dashboard/bookManagement/bookManagement.service';
import UserRating from '@/components/commons/userRating';

interface Props {
    id: string;
}

interface Author {
    id: string;
    name: string;
    image?: string;
    biography?: string;
}

export default function Book({ id }: Props) {
    const router = useRouter();
    const [book, setBook] = useState<BookType | null>(null);
    const [author, setAuthor] = useState<Author | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const fetchBookData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Obtener datos del libro específico
                const bookResponse = await bookManagementService.getBookById(id);
                
                if (!bookResponse.success || !bookResponse.data) {
                    setError('Libro no encontrado');
                    return;
                }
                
                const foundBook = bookResponse.data;
                setBook(foundBook);
                
                // Si el libro tiene autores, usar el primer autor
                if (foundBook.authorIds && foundBook.authorIds.length > 0) {
                    try {
                        // Si hay información de autores en el objeto
                        if (foundBook.authors && foundBook.authors.length > 0) {
                            setAuthor({
                                id: foundBook.authors[0].id,
                                name: foundBook.authors[0].nombre,
                            });
                        } else {
                            // Placeholder básico
                            setAuthor({
                                id: foundBook.authorIds[0],
                                name: 'Autor desconocido',
                            });
                        }
                    } catch (authorError) {
                        console.log('Error obteniendo datos del autor:', authorError);
                        setAuthor(null);
                    }
                }
                
            } catch (err) {
                console.error('Error obteniendo datos del libro:', err);
                setError('Error al cargar los datos del libro');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBookData();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="tw:w-full tw:h-screen tw:flex tw:items-center tw:justify-center">
                <div className="tw:text-center">
                    <CircularProgress sx={{ color: 'white', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: 'white' }}>
                        Cargando libro...
                    </Typography>
                </div>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="tw:w-full tw:h-screen tw:flex tw:items-center tw:justify-center tw:px-4">
                <Alert 
                    severity="error" 
                    sx={{ 
                        backgroundColor: 'rgba(211, 47, 47, 0.1)',
                        border: '1px solid rgba(211, 47, 47, 0.3)',
                        color: 'white',
                        maxWidth: '500px'
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        {error || 'Libro no encontrado'}
                    </Typography>
                    <Typography variant="body2">
                        El libro que buscas no está disponible o ha sido eliminado.
                    </Typography>
                    <Button 
                        variant="outlined" 
                        sx={{ 
                            mt: 2, 
                            color: 'white', 
                            borderColor: 'white',
                            '&:hover': { borderColor: '#ccc', backgroundColor: 'rgba(255,255,255,0.1)' }
                        }}
                        onClick={() => router.push('/home')}
                    >
                        Volver al inicio
                    </Button>
                </Alert>
            </div>
        );
    }

    // Función para navegar al contenido del libro
    const handleReadBook = () => {
        router.push(`/book/${id}/content`);
    };

    return (
        <div className="tw:w-full tw:h-screen">
            <div className="tw:w-full tw:h-screen tw:px-16 tw:pt-48 tw:gap-10">
                <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:fixed tw:h-[40rem] tw:w-[28rem] tw:mt-14">
                    <Image
                        src={book.coverImage || '/images/placeholder-book.jpg'}
                        alt={book.title}
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
                    
                    {/* Sección de Rating del Usuario */}
                    <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:mt-6 tw:w-full tw:p-4 tw:bg-gray-800/30 tw:rounded-lg tw:border tw:border-gray-700/50">
                        <h4 className="tw:text-lg tw:font-medium tw:text-white tw:mb-3 tw:text-center">¿Qué te parece?</h4>
                        <UserRating 
                            bookId={book.id} 
                            onRatingUpdate={() => setRefreshTrigger(prev => prev + 1)}
                        />
                    </div>
                </div>
                <div className="tw:flex tw:flex-col tw:pl-[30rem]">
                    <div className="tw:flex tw:flex-col tw:items-start tw:justify-center tw:mb-8">
                        <h1 className="tw:text-4xl tw:font-bold tw:mb-4 tw:text-white">{book.title}</h1>
                        <h2 className="tw:text-2xl tw:font-semibold tw:mb-2 tw:text-gray-300">
                            {author?.name || "Autor desconocido"}
                        </h2>
                        <p className="tw:text-base tw:text-gray-300">{book.description}</p>
                        <p className="tw:mt-4 tw:text-gray-300">
                            <strong className="tw:text-white">Género:</strong> {book.genres && book.genres.length > 0 ? book.genres.map(g => g.nombre).join(", ") : "Sin géneros"}
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
                                    Autor
                                </p>
                            </div>
                        </div>
                        <p className="tw:mt-2 tw:text-gray-300">
                            {author?.biography || "No hay información disponible sobre el autor."}
                        </p>
                    </div>
                    <hr className="tw:border-gray-600" />

                    {/* Estadísticas de la comunidad */}
                    <CommunityReviews
                        bookId={book.id}
                        averageRating={book.averageRating || 0}
                        totalRatings={book.totalRatings || 0}
                        refreshTrigger={refreshTrigger}
                    />

                    <hr className="tw:my-8 tw:border-gray-600" />

                    {/* Reseñas reales de otros usuarios */}
                    <RealReviews 
                        bookId={book.id}
                        refreshTrigger={refreshTrigger}
                    />
                </div>
            </div>
        </div>
    );
}