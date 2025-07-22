'use client';

import { useState, useEffect, useCallback } from 'react';
import authorManagementService, { UpdateAuthorRequest } from '@/services/dashboard/authorManagement/authorManagement.service';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Alert,
    CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

interface EditAuthorProps {
    open: boolean;
    authorId: string | null;
    onClose: () => void;
    onAuthorUpdated: () => void;
}

export default function EditAuthor({ open, authorId, onClose, onAuthorUpdated }: EditAuthorProps) {
    const [formData, setFormData] = useState<UpdateAuthorRequest>({
        nombre: '',
        acerca_de: '',
        fechaNacimiento: '',
        fechaMuerte: null,
        nacionalidad: '',
        foto: ''
    });
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [birthDate, setBirthDate] = useState<Dayjs | null>(null);
    const [deathDate, setDeathDate] = useState<Dayjs | null>(null);

    const loadAuthorData = useCallback(async () => {
        if (!authorId) return;
        
        try {
            setLoadingData(true);
            setError(null);
            
            const response = await authorManagementService.getAuthorById(authorId);
            
            if (response.success && response.data) {
                const author = response.data;
                setFormData({
                    nombre: author.nombre,
                    acerca_de: author.acerca_de,
                    fechaNacimiento: author.fechaNacimiento,
                    fechaMuerte: author.fechaMuerte,
                    nacionalidad: author.nacionalidad,
                    foto: author.foto
                });
                
                // Configurar fechas para los DatePickers
                setBirthDate(author.fechaNacimiento ? dayjs(author.fechaNacimiento) : null);
                setDeathDate(author.fechaMuerte ? dayjs(author.fechaMuerte) : null);
            } else {
                setError(response.message || 'Error al cargar los datos del autor');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error de conexión');
        } finally {
            setLoadingData(false);
        }
    }, [authorId]);

    // Cargar datos del autor cuando se abre el modal
    useEffect(() => {
        if (open && authorId) {
            loadAuthorData();
        } else if (!open) {
            // Limpiar datos cuando se cierra el modal
            resetForm();
        }
    }, [open, authorId, loadAuthorData]);

    const resetForm = () => {
        setFormData({
            nombre: '',
            acerca_de: '',
            fechaNacimiento: '',
            fechaMuerte: null,
            nacionalidad: '',
            foto: ''
        });
        setBirthDate(null);
        setDeathDate(null);
        setError(null);
    };

    const handleInputChange = (field: keyof UpdateAuthorRequest) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
        if (error) setError(null);
    };

    const handleBirthDateChange = (date: Dayjs | null) => {
        setBirthDate(date);
        setFormData(prev => ({
            ...prev,
            fechaNacimiento: date ? date.format('YYYY-MM-DD') : ''
        }));
        if (error) setError(null);
    };

    const handleDeathDateChange = (date: Dayjs | null) => {
        setDeathDate(date);
        setFormData(prev => ({
            ...prev,
            fechaMuerte: date ? date.format('YYYY-MM-DD') : null
        }));
        if (error) setError(null);
    };

    const validateForm = (): boolean => {
        if (!formData.nombre?.trim()) {
            setError('El nombre del autor es requerido');
            return false;
        }
        if (!formData.acerca_de?.trim()) {
            setError('La descripción del autor es requerida');
            return false;
        }
        if (!formData.fechaNacimiento) {
            setError('La fecha de nacimiento es requerida');
            return false;
        }
        if (!formData.nacionalidad?.trim()) {
            setError('La nacionalidad es requerida');
            return false;
        }
        if (!formData.foto?.trim()) {
            setError('La URL de la foto es requerida');
            return false;
        }
        return true;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!validateForm() || !authorId) return;

        try {
            setLoading(true);
            setError(null);

            const response = await authorManagementService.updateAuthor(authorId, formData);
            
            if (response.success) {
                onAuthorUpdated();
                handleClose();
            } else {
                setError(response.message || 'Error al actualizar el autor');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading && !loadingData) {
            onClose();
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    bgcolor: '#1a1a1a',
                    color: '#fff',
                    border: '1px solid #333'
                }
            }}
        >
            <DialogTitle sx={{ 
                bgcolor: '#2d2d2d', 
                color: '#60a5fa',
                fontWeight: 'bold',
                borderBottom: '1px solid #333'
            }}>
                Editar Autor
            </DialogTitle>
            
            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ bgcolor: '#1a1a1a', py: 3 }}>
                    {loadingData ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress sx={{ color: '#60a5fa' }} />
                        </Box>
                    ) : (
                        <>
                            {error && (
                                <Alert 
                                    severity="error" 
                                    sx={{ 
                                        mb: 3,
                                        bgcolor: '#7f1d1d',
                                        color: '#fecaca',
                                        '& .MuiAlert-icon': {
                                            color: '#ef4444'
                                        }
                                    }}
                                >
                                    {error}
                                </Alert>
                            )}

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <TextField
                                    label="Nombre del Autor"
                                    value={formData.nombre || ''}
                                    onChange={handleInputChange('nombre')}
                                    required
                                    fullWidth
                                    disabled={loading}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: '#fff',
                                            bgcolor: '#2d2d2d',
                                            '& fieldset': {
                                                borderColor: '#555'
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#60a5fa'
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#60a5fa'
                                            }
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: '#9ca3af',
                                            '&.Mui-focused': {
                                                color: '#60a5fa'
                                            }
                                        }
                                    }}
                                />

                                <TextField
                                    label="Nacionalidad"
                                    value={formData.nacionalidad || ''}
                                    onChange={handleInputChange('nacionalidad')}
                                    required
                                    fullWidth
                                    disabled={loading}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: '#fff',
                                            bgcolor: '#2d2d2d',
                                            '& fieldset': {
                                                borderColor: '#555'
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#60a5fa'
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#60a5fa'
                                            }
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: '#9ca3af',
                                            '&.Mui-focused': {
                                                color: '#60a5fa'
                                            }
                                        }
                                    }}
                                />

                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                                    <DatePicker
                                        label="Fecha de Nacimiento"
                                        value={birthDate}
                                        onChange={handleBirthDateChange}
                                        disabled={loading}
                                        slotProps={{
                                            textField: {
                                                sx: {
                                                    '& .MuiOutlinedInput-root': {
                                                        color: '#fff',
                                                        bgcolor: '#2d2d2d',
                                                        '& fieldset': {
                                                            borderColor: '#555 !important'
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: '#60a5fa !important'
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#60a5fa !important'
                                                        },
                                                        '&.Mui-error fieldset': {
                                                            borderColor: '#555 !important'
                                                        }
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        color: '#9ca3af',
                                                        '&.Mui-focused': {
                                                            color: '#60a5fa'
                                                        },
                                                        '&.Mui-error': {
                                                            color: '#9ca3af'
                                                        }
                                                    },
                                                    '& .MuiIconButton-root': {
                                                        color: '#60a5fa'
                                                    }
                                                }
                                            },
                                        }}
                                    />
                                </LocalizationProvider>

                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                                    <DatePicker
                                        label="Fecha de Muerte (Opcional)"
                                        value={deathDate}
                                        onChange={handleDeathDateChange}
                                        disabled={loading}
                                        slotProps={{
                                            textField: {
                                                sx: {
                                                    '& .MuiOutlinedInput-root': {
                                                        color: '#fff',
                                                        bgcolor: '#2d2d2d',
                                                        '& fieldset': {
                                                            borderColor: '#555 !important'
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: '#60a5fa !important'
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#60a5fa !important'
                                                        },
                                                        '&.Mui-error fieldset': {
                                                            borderColor: '#555 !important'
                                                        }
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        color: '#9ca3af',
                                                        '&.Mui-focused': {
                                                            color: '#60a5fa'
                                                        },
                                                        '&.Mui-error': {
                                                            color: '#9ca3af'
                                                        }
                                                    },
                                                    '& .MuiIconButton-root': {
                                                        color: '#60a5fa'
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </LocalizationProvider>

                                <TextField
                                    label="URL de la Foto"
                                    value={formData.foto || ''}
                                    onChange={handleInputChange('foto')}
                                    required
                                    fullWidth
                                    disabled={loading}
                                    placeholder="https://ejemplo.com/foto.jpg"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: '#fff',
                                            bgcolor: '#2d2d2d',
                                            '& fieldset': {
                                                borderColor: '#555'
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#60a5fa'
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#60a5fa'
                                            }
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: '#9ca3af',
                                            '&.Mui-focused': {
                                                color: '#60a5fa'
                                            }
                                        }
                                    }}
                                />

                                <TextField
                                    label="Acerca del Autor"
                                    value={formData.acerca_de || ''}
                                    onChange={handleInputChange('acerca_de')}
                                    required
                                    fullWidth
                                    multiline
                                    rows={4}
                                    disabled={loading}
                                    placeholder="Descripción biográfica del autor..."
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: '#fff',
                                            bgcolor: '#2d2d2d',
                                            '& fieldset': {
                                                borderColor: '#555'
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#60a5fa'
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#60a5fa'
                                            }
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: '#9ca3af',
                                            '&.Mui-focused': {
                                                color: '#60a5fa'
                                            }
                                        }
                                    }}
                                />
                            </Box>
                        </>
                    )}
                </DialogContent>
                
                <DialogActions sx={{ 
                    bgcolor: '#2d2d2d', 
                    borderTop: '1px solid #333',
                    px: 3,
                    py: 2
                }}>
                    <Button
                        onClick={handleClose}
                        disabled={loading || loadingData}
                        sx={{
                            color: '#9ca3af',
                            borderColor: '#555',
                            '&:hover': {
                                borderColor: '#60a5fa',
                                color: '#60a5fa',
                                bgcolor: 'rgba(96, 165, 250, 0.1)'
                            },
                            transition: 'all 0.2s ease'
                        }}
                        variant="outlined"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading || loadingData}
                        variant="contained"
                        sx={{
                            bgcolor: '#60a5fa',
                            color: '#1a1a1a',
                            fontWeight: 600,
                            '&:hover': {
                                bgcolor: '#3b82f6',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(96, 165, 250, 0.3)'
                            },
                            '&:disabled': {
                                bgcolor: '#374151',
                                color: '#6b7280'
                            },
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {loading ? (
                            <>
                                <CircularProgress size={20} sx={{ color: '#6b7280', mr: 1 }} />
                                Actualizando...
                            </>
                        ) : (
                            'Actualizar Autor'
                        )}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}