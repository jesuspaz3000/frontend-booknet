'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    OutlinedInput,
    Alert,
    CircularProgress
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import bookManagementService, { Book, UpdateBookRequest, AGE_RATINGS, READING_DIFFICULTIES, LANGUAGES } from '@/services/dashboard/bookManagement/bookManagement.service';
import authorManagementService, { Author } from '@/services/dashboard/authorManagement/authorManagement.service';
import genresManagementService, { Genre } from '@/services/dashboard/genresManagement/genresManagement.service';
import tagsManagementService, { Tag } from '@/services/dashboard/tagsManagement/tagsManagement.service';

interface EditBookProps {
    open: boolean;
    book: Book | null;
    onClose: () => void;
    onBookUpdated: () => void;
}

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 48 * 4.5 + 8,
            width: 250,
            backgroundColor: '#2a2a2a',
        },
    },
};

export default function EditBook({ open, book, onClose, onBookUpdated }: EditBookProps) {
    const [formData, setFormData] = useState<UpdateBookRequest>({
        title: '',
        isbn: '',
        description: '',
        publicationYear: new Date().getFullYear(),
        pageCount: 0,
        language: '',
        ageRating: '',
        readingDifficulty: '',
        coverImage: '',
        authorIds: [],
        genreIds: [],
        tagIds: []
    });

    const [authors, setAuthors] = useState<Author[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingReferenceData, setLoadingReferenceData] = useState(false);
    const [loadingBookData, setLoadingBookData] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar datos de referencia cuando se abre el modal
    useEffect(() => {
        if (open) {
            loadReferenceData();
        }
    }, [open]);

    // Cargar datos completos del libro cuando se abre para editar
    useEffect(() => {
        if (open && book?.id) {
            loadCompleteBookData(book.id);
        }
    }, [open, book?.id]);

    // Debug: Log state changes
    useEffect(() => {
        console.log('Authors state changed:', authors.length, authors);
    }, [authors]);

    useEffect(() => {
        console.log('Genres state changed:', genres.length, genres);
    }, [genres]);

    useEffect(() => {
        console.log('Tags state changed:', tags.length, tags);
    }, [tags]);

    const loadCompleteBookData = async (bookId: string) => {
        setLoadingBookData(true);
        try {
            const response = await bookManagementService.getBookById(bookId);
            
            if (response.success && response.data) {
                const completeBook = response.data;
                setFormData({
                    title: completeBook.title || '',
                    isbn: completeBook.isbn || '',
                    description: completeBook.description || '',
                    publicationYear: completeBook.publicationYear || new Date().getFullYear(),
                    pageCount: completeBook.pageCount || 0,
                    language: completeBook.language || '',
                    ageRating: completeBook.ageRating || '',
                    readingDifficulty: completeBook.readingDifficulty || '',
                    coverImage: completeBook.coverImage || '',
                    authorIds: completeBook.authors?.map(a => a.id) || [],
                    genreIds: completeBook.genres?.map(g => g.id) || [],
                    tagIds: completeBook.tags?.map(t => t.id) || []
                });
            }
        } catch (err) {
            console.error('Error loading complete book data:', err);
            setError('Error al cargar los datos completos del libro');
        } finally {
            setLoadingBookData(false);
        }
    };

    const loadReferenceData = async () => {
        setLoadingReferenceData(true);
        try {
            console.log('Loading reference data...');
            const [authorsResponse, genresResponse, tagsResponse] = await Promise.all([
                authorManagementService.getAllAuthors(),
                genresManagementService.getAllGenres(),
                tagsManagementService.getAllTags()
            ]);

            console.log('Authors response:', authorsResponse);
            console.log('Genres response:', genresResponse);
            console.log('Tags response:', tagsResponse);

            if (authorsResponse.success && authorsResponse.data) {
                console.log('Setting authors:', authorsResponse.data);
                setAuthors(authorsResponse.data);
            }
            if (genresResponse.success && genresResponse.data) {
                console.log('Setting genres:', genresResponse.data);
                setGenres(genresResponse.data);
            }
            if (tagsResponse.success && tagsResponse.data) {
                console.log('Setting tags:', tagsResponse.data);
                setTags(tagsResponse.data);
            }
        } catch (err) {
            console.error('Error loading reference data:', err);
            setError('Error al cargar los datos de referencia');
        } finally {
            setLoadingReferenceData(false);
        }
    };

    const handleInputChange = (field: keyof UpdateBookRequest, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSelectChange = (event: SelectChangeEvent<string[]>, field: 'authorIds' | 'genreIds' | 'tagIds') => {
        const value = typeof event.target.value === 'string' ? [] : event.target.value as string[];
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleChipDelete = (chipValue: string, field: 'authorIds' | 'genreIds' | 'tagIds') => {
        console.log('handleChipDelete called:', { chipValue, field, currentValues: formData[field] });
        const currentValues = formData[field] as string[];
        const newValues = currentValues.filter(value => value !== chipValue);
        console.log('New values after filter:', newValues);
        
        setFormData(prev => ({
            ...prev,
            [field]: newValues
        }));
        
        console.log('Form data updated with new values:', newValues);
    };

    const handleSubmit = async () => {
        if (!book) return;

        if (!formData.title?.trim() || !formData.isbn?.trim()) {
            setError('El título y el ISBN son campos obligatorios');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await bookManagementService.updateBook(book.id, formData);
            onBookUpdated();
            handleClose();
        } catch (err) {
            console.error('Error updating book:', err);
            const errorMessage = err instanceof Error && 'response' in err 
                ? (err as { response?: { data?: { message?: string } } }).response?.data?.message 
                : 'Error al actualizar el libro';
            setError(errorMessage || 'Error al actualizar el libro');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            title: '',
            isbn: '',
            description: '',
            publicationYear: new Date().getFullYear(),
            pageCount: 0,
            language: '',
            ageRating: '',
            readingDifficulty: '',
            coverImage: '',
            authorIds: [],
            genreIds: [],
            tagIds: []
        });
        setError(null);
        onClose();
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: '#1a1a1a',
                    color: '#fff',
                    border: '1px solid #333'
                }
            }}
        >
            <DialogTitle sx={{ 
                borderBottom: '1px solid #333', 
                color: '#fff',
                fontSize: '1.5rem',
                fontWeight: 600
            }}>
                Editar Libro
            </DialogTitle>
            
            <DialogContent sx={{ pt: 3, mt: 2 }}>
                {(loadingReferenceData || loadingBookData) ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress sx={{ color: '#ef4444' }} />
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Información básica */}
                        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                            <TextField
                                fullWidth
                                label="Título *"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: '#2a2a2a',
                                        color: '#fff',
                                        '& fieldset': { borderColor: '#ef4444' },
                                        '&:hover fieldset': { borderColor: '#dc2626' },
                                        '&.Mui-focused fieldset': { borderColor: '#ef4444' }
                                    },
                                    '& .MuiInputLabel-root': { color: '#9ca3af' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#ef4444' }
                                }}
                            />
                            <TextField
                                fullWidth
                                label="ISBN *"
                                value={formData.isbn}
                                onChange={(e) => handleInputChange('isbn', e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: '#2a2a2a',
                                        color: '#fff',
                                        '& fieldset': { borderColor: '#ef4444' },
                                        '&:hover fieldset': { borderColor: '#dc2626' },
                                        '&.Mui-focused fieldset': { borderColor: '#ef4444' }
                                    },
                                    '& .MuiInputLabel-root': { color: '#9ca3af' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#ef4444' }
                                }}
                            />
                        </Box>

                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Descripción"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: '#2a2a2a',
                                    color: '#fff',
                                    '& fieldset': { borderColor: '#ef4444' },
                                    '&:hover fieldset': { borderColor: '#dc2626' },
                                    '&.Mui-focused fieldset': { borderColor: '#ef4444' }
                                },
                                '& .MuiInputLabel-root': { color: '#9ca3af' },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#ef4444' }
                            }}
                        />

                        {/* Año y detalles */}
                        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Año de Publicación"
                                value={formData.publicationYear}
                                onChange={(e) => handleInputChange('publicationYear', parseInt(e.target.value))}
                                inputProps={{ min: 1000, max: new Date().getFullYear() + 10 }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: '#2a2a2a',
                                        color: '#fff',
                                        '& fieldset': { borderColor: '#ef4444' },
                                        '&:hover fieldset': { borderColor: '#dc2626' },
                                        '&.Mui-focused fieldset': { borderColor: '#ef4444' }
                                    },
                                    '& .MuiInputLabel-root': { color: '#9ca3af' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#ef4444' }
                                }}
                            />
                            <TextField
                                fullWidth
                                type="number"
                                label="Número de Páginas"
                                value={formData.pageCount}
                                onChange={(e) => handleInputChange('pageCount', parseInt(e.target.value))}
                                inputProps={{ min: 1 }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: '#2a2a2a',
                                        color: '#fff',
                                        '& fieldset': { borderColor: '#ef4444' },
                                        '&:hover fieldset': { borderColor: '#dc2626' },
                                        '&.Mui-focused fieldset': { borderColor: '#ef4444' }
                                    },
                                    '& .MuiInputLabel-root': { color: '#9ca3af' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#ef4444' }
                                }}
                            />
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: '#9ca3af', '&.Mui-focused': { color: '#ef4444' } }}>
                                    Idioma
                                </InputLabel>
                                <Select
                                    value={formData.language}
                                    onChange={(e) => handleInputChange('language', e.target.value)}
                                    label="Idioma"
                                    sx={{
                                        bgcolor: '#2a2a2a',
                                        color: '#fff',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ef4444' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#dc2626' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ef4444' },
                                        '& .MuiSvgIcon-root': { color: '#9ca3af' }
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                bgcolor: '#1a1a1a',
                                                color: '#fff',
                                                '& .MuiMenuItem-root': {
                                                    '&:hover': { bgcolor: '#2a2a2a' },
                                                    '&.Mui-selected': { bgcolor: '#ef4444' }
                                                }
                                            }
                                        }
                                    }}
                                >
                                    {LANGUAGES.map((language) => (
                                        <MenuItem key={language} value={language}>
                                            {language}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <TextField
                            fullWidth
                            label="URL de Portada"
                            value={formData.coverImage}
                            onChange={(e) => handleInputChange('coverImage', e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: '#2a2a2a',
                                    color: '#fff',
                                    '& fieldset': { borderColor: '#ef4444' },
                                    '&:hover fieldset': { borderColor: '#dc2626' },
                                    '&.Mui-focused fieldset': { borderColor: '#ef4444' }
                                },
                                '& .MuiInputLabel-root': { color: '#9ca3af' },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#ef4444' }
                            }}
                        />

                        {/* Clasificaciones */}
                        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: '#9ca3af', '&.Mui-focused': { color: '#ef4444' } }}>
                                    Clasificación de Edad
                                </InputLabel>
                                <Select
                                    value={formData.ageRating}
                                    onChange={(e) => handleInputChange('ageRating', e.target.value)}
                                    label="Clasificación de Edad"
                                    sx={{
                                        bgcolor: '#2a2a2a',
                                        color: '#fff',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ef4444' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#dc2626' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ef4444' },
                                        '& .MuiSvgIcon-root': { color: '#9ca3af' }
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                bgcolor: '#1a1a1a',
                                                color: '#fff',
                                                '& .MuiMenuItem-root': {
                                                    '&:hover': { bgcolor: '#2a2a2a' },
                                                    '&.Mui-selected': { bgcolor: '#ef4444' }
                                                }
                                            }
                                        }
                                    }}
                                >
                                    {AGE_RATINGS.map((rating) => (
                                        <MenuItem key={rating} value={rating}>
                                            {rating}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: '#9ca3af', '&.Mui-focused': { color: '#ef4444' } }}>
                                    Dificultad de Lectura
                                </InputLabel>
                                <Select
                                    value={formData.readingDifficulty}
                                    onChange={(e) => handleInputChange('readingDifficulty', e.target.value)}
                                    label="Dificultad de Lectura"
                                    sx={{
                                        bgcolor: '#2a2a2a',
                                        color: '#fff',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ef4444' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#dc2626' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ef4444' },
                                        '& .MuiSvgIcon-root': { color: '#9ca3af' }
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                bgcolor: '#1a1a1a',
                                                color: '#fff',
                                                '& .MuiMenuItem-root': {
                                                    '&:hover': { bgcolor: '#2a2a2a' },
                                                    '&.Mui-selected': { bgcolor: '#ef4444' }
                                                }
                                            }
                                        }
                                    }}
                                >
                                    {READING_DIFFICULTIES.map((difficulty) => (
                                        <MenuItem key={difficulty} value={difficulty}>
                                            {difficulty}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Selecciones múltiples */}
                        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: '#9ca3af', '&.Mui-focused': { color: '#ef4444' } }}>
                                    Autores
                                </InputLabel>
                                <Select
                                    multiple
                                    value={formData.authorIds}
                                    onChange={(e) => handleSelectChange(e as SelectChangeEvent<string[]>, 'authorIds')}
                                    input={<OutlinedInput label="Autores" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => {
                                                const author = authors.find(a => a.id === value);
                                                return (
                                                    <Chip
                                                        key={value}
                                                        label={author?.nombre || value}
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                        }}
                                                        onDelete={() => handleChipDelete(value, 'authorIds')}
                                                        onMouseDown={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                        }}
                                                        sx={{ 
                                                            bgcolor: '#ef4444', 
                                                            color: '#fff',
                                                            '& .MuiChip-deleteIcon': {
                                                                color: '#fff',
                                                                '&:hover': {
                                                                    color: '#f3f4f6'
                                                                },
                                                                '&:active': {
                                                                    color: '#f9fafb'
                                                                }
                                                            }
                                                        }}
                                                    />
                                                );
                                            })}
                                        </Box>
                                    )}
                                    MenuProps={MenuProps}
                                    sx={{
                                        bgcolor: '#2a2a2a',
                                        color: '#fff',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ef4444' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#dc2626' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ef4444' }
                                    }}
                                >
                                    {authors.map((author) => (
                                        <MenuItem key={author.id} value={author.id} sx={{ color: '#fff' }}>
                                            {author.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel sx={{ color: '#9ca3af', '&.Mui-focused': { color: '#ef4444' } }}>
                                    Géneros
                                </InputLabel>
                                <Select
                                    multiple
                                    value={formData.genreIds}
                                    onChange={(e) => handleSelectChange(e as SelectChangeEvent<string[]>, 'genreIds')}
                                    input={<OutlinedInput label="Géneros" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => {
                                                const genre = genres.find(g => g.id === value);
                                                return (
                                                    <Chip
                                                        key={value}
                                                        label={genre?.nombre || value}
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                        }}
                                                        onDelete={() => handleChipDelete(value, 'genreIds')}
                                                        onMouseDown={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                        }}
                                                        sx={{ 
                                                            bgcolor: '#60a5fa', 
                                                            color: '#fff',
                                                            '& .MuiChip-deleteIcon': {
                                                                color: '#fff',
                                                                '&:hover': {
                                                                    color: '#f3f4f6'
                                                                },
                                                                '&:active': {
                                                                    color: '#f9fafb'
                                                                }
                                                            }
                                                        }}
                                                    />
                                                );
                                            })}
                                        </Box>
                                    )}
                                    MenuProps={MenuProps}
                                    sx={{
                                        bgcolor: '#2a2a2a',
                                        color: '#fff',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ef4444' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#dc2626' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ef4444' }
                                    }}
                                >
                                    {genres.map((genre) => (
                                        <MenuItem key={genre.id} value={genre.id} sx={{ color: '#fff' }}>
                                            {genre.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel sx={{ color: '#9ca3af', '&.Mui-focused': { color: '#ef4444' } }}>
                                    Tags
                                </InputLabel>
                                <Select
                                    multiple
                                    value={formData.tagIds}
                                    onChange={(e) => handleSelectChange(e as SelectChangeEvent<string[]>, 'tagIds')}
                                    input={<OutlinedInput label="Tags" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => {
                                                const tag = tags.find(t => t.id === value);
                                                return (
                                                    <Chip
                                                        key={value}
                                                        label={tag?.nombre || value}
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                        }}
                                                        onDelete={() => handleChipDelete(value, 'tagIds')}
                                                        onMouseDown={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                        }}
                                                        sx={{ 
                                                            bgcolor: '#7c3aed', 
                                                            color: '#fff',
                                                            '& .MuiChip-deleteIcon': {
                                                                color: '#fff',
                                                                '&:hover': {
                                                                    color: '#f3f4f6'
                                                                },
                                                                '&:active': {
                                                                    color: '#f9fafb'
                                                                }
                                                            }
                                                        }}
                                                    />
                                                );
                                            })}
                                        </Box>
                                    )}
                                    MenuProps={MenuProps}
                                    sx={{
                                        bgcolor: '#2a2a2a',
                                        color: '#fff',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ef4444' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#dc2626' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ef4444' }
                                    }}
                                >
                                    {tags.map((tag) => (
                                        <MenuItem key={tag.id} value={tag.id} sx={{ color: '#fff' }}>
                                            {tag.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                )}

                {error && (
                    <Alert 
                        severity="error" 
                        sx={{ 
                            mt: 2,
                            bgcolor: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            '& .MuiAlert-icon': { color: '#ef4444' }
                        }}
                    >
                        {error}
                    </Alert>
                )}
            </DialogContent>
            
            <DialogActions sx={{ borderTop: '1px solid #333', p: 3, gap: 2 }}>
                <Button
                    onClick={handleClose}
                    sx={{
                        color: '#9ca3af',
                        borderColor: '#374151',
                        '&:hover': {
                            borderColor: '#4b5563',
                            bgcolor: 'rgba(75, 85, 99, 0.1)'
                        }
                    }}
                    variant="outlined"
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={loading || loadingReferenceData || loadingBookData}
                    variant="contained"
                    sx={{
                        bgcolor: '#ef4444',
                        color: '#fff',
                        '&:hover': { bgcolor: '#dc2626' },
                        '&:disabled': { bgcolor: '#374151', color: '#9ca3af' }
                    }}
                >
                    {loading ? (
                        <>
                            <CircularProgress size={20} sx={{ color: '#9ca3af', mr: 1 }} />
                            Actualizando...
                        </>
                    ) : (
                        'Actualizar Libro'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
