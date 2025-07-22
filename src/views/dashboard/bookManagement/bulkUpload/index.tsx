'use client';

import { useState, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Alert,
    CircularProgress,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Chip,
    IconButton
} from '@mui/material';
import {
    CloudUpload as CloudUploadIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import bookManagementService, { BulkUploadResponse } from '@/services/dashboard/bookManagement/bookManagement.service';

interface BulkUploadProps {
    open: boolean;
    onClose: () => void;
    onUploadComplete: () => void;
}

export default function BulkUpload({ open, onClose, onUploadComplete }: BulkUploadProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploadResult, setUploadResult] = useState<BulkUploadResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): string | null => {
        if (!file.type.includes('json') && !file.name.endsWith('.json')) {
            return 'El archivo debe ser de tipo JSON';
        }
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return 'El archivo es demasiado grande. Tamaño máximo: 10MB';
        }
        return null;
    };

    const processFile = (file: File) => {
        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            return;
        }
        setSelectedFile(file);
        setError(null);
        setUploadResult(null);
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(false);

        const files = event.dataTransfer.files;
        if (files.length > 0) {
            processFile(files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Por favor selecciona un archivo JSON');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await bookManagementService.uploadBooksFile(selectedFile);
            
            if (response.success) {
                // Extraer información del mensaje para crear un resultado compatible
                const message = response.message || '';
                const match = message.match(/(\d+) de (\d+)/);
                
                const successfulBooks = match ? parseInt(match[1]) : 0;
                const totalBooks = match ? parseInt(match[2]) : 0;
                const failedBooks = totalBooks - successfulBooks;
                
                // Crear un objeto compatible con BulkUploadResponse
                const uploadResult: BulkUploadResponse = {
                    message: response.message,
                    processedBooks: totalBooks,
                    successfulBooks: successfulBooks,
                    failedBooks: failedBooks,
                    errors: failedBooks > 0 ? [{ error: `${failedBooks} libros no pudieron ser procesados` }] : undefined
                };
                
                setUploadResult(uploadResult);
                onUploadComplete();
            } else {
                setError(response.message || 'Error al procesar el archivo');
            }
        } catch (err: unknown) {
            let errorMessage = 'Error desconocido';
            
            // Verificar si es un error de axios con código y mensaje
            if (err && typeof err === 'object' && 'code' in err && 'message' in err) {
                const axiosError = err as { code: string; message: string; response?: { data?: { message?: string } } };
                
                // Verificar si es un error de timeout
                if (axiosError.code === 'ECONNABORTED' || axiosError.message?.includes('timeout')) {
                    errorMessage = 'La carga está tomando más tiempo del esperado. El archivo se está procesando en segundo plano. Por favor, verifica los resultados en unos minutos o intenta nuevamente.';
                } else if (axiosError.response?.data?.message) {
                    // Error del backend
                    errorMessage = axiosError.response.data.message;
                } else {
                    errorMessage = axiosError.message;
                }
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            console.error('Error en carga masiva:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        setError(null);
        setUploadResult(null);
        setLoading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onClose();
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
                bgcolor: '#2a2a2a', 
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Typography variant="h6" component="div">
                    Carga Masiva de Libros
                </Typography>
                <IconButton onClick={handleClose} sx={{ color: '#fff' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ bgcolor: '#1a1a1a', p: 3 }}>
                {!uploadResult && (
                    <>
                        <Typography variant="body2" sx={{ mb: 2, color: '#ccc' }}>
                            Selecciona o arrastra un archivo JSON con los datos de los libros para cargar masivamente.
                        </Typography>

                        <Box
                            sx={{
                                border: `2px dashed ${isDragOver ? '#ef4444' : '#555'}`,
                                borderRadius: 2,
                                p: 4,
                                textAlign: 'center',
                                bgcolor: isDragOver ? '#1f0f0f' : '#0f0f0f',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    borderColor: isDragOver ? '#ef4444' : '#777',
                                    bgcolor: isDragOver ? '#1f0f0f' : '#1f1f1f'
                                }
                            }}
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".json"
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                            />
                            
                            <CloudUploadIcon sx={{ fontSize: 48, color: '#666', mb: 2 }} />
                            
                            {selectedFile ? (
                                <Box>
                                    <Typography variant="body1" sx={{ mb: 1, color: '#fff' }}>
                                        {selectedFile.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#ccc' }}>
                                        {formatFileSize(selectedFile.size)}
                                    </Typography>
                                </Box>
                            ) : (
                                <Box>
                                    <Typography variant="body1" sx={{ mb: 1, color: '#ccc' }}>
                                        {isDragOver 
                                            ? 'Suelta el archivo aquí' 
                                            : 'Haz clic para seleccionar o arrastra un archivo JSON'
                                        }
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#888' }}>
                                        {isDragOver ? 'Archivo JSON' : 'Máximo 10MB'}
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        {error && (
                            <Alert 
                                severity="error" 
                                sx={{ 
                                    mt: 2,
                                    bgcolor: '#2d1b1b',
                                    color: '#ffcdd2',
                                    '& .MuiAlert-icon': { color: '#f44336' }
                                }}
                            >
                                {error}
                            </Alert>
                        )}

                        {loading && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1, color: '#ccc' }}>
                                    Procesando archivo... Este proceso puede tomar varios minutos dependiendo del tamaño del archivo.
                                </Typography>
                                <Typography variant="caption" sx={{ mb: 2, color: '#999', display: 'block' }}>
                                    Por favor, mantén esta ventana abierta hasta que se complete la operación.
                                </Typography>
                                <LinearProgress 
                                    sx={{
                                        bgcolor: '#333',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: '#4caf50'
                                        }
                                    }}
                                />
                            </Box>
                        )}
                    </>
                )}

                {uploadResult && (
                    <Box>
                        <Alert 
                            severity={uploadResult.failedBooks > 0 ? "warning" : "success"}
                            icon={uploadResult.failedBooks > 0 ? <ErrorIcon /> : <CheckCircleIcon />}
                            sx={{ 
                                mb: 3,
                                bgcolor: uploadResult.failedBooks > 0 ? '#2d2416' : '#1b2d1b',
                                color: uploadResult.failedBooks > 0 ? '#fff3cd' : '#d4edda',
                                '& .MuiAlert-icon': { 
                                    color: uploadResult.failedBooks > 0 ? '#ffc107' : '#4caf50' 
                                }
                            }}
                        >
                            {uploadResult.message}
                        </Alert>

                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                            <Chip 
                                label={`Total: ${uploadResult.processedBooks}`}
                                sx={{ bgcolor: '#333', color: '#fff' }}
                            />
                            <Chip 
                                label={`Exitosos: ${uploadResult.successfulBooks}`}
                                sx={{ bgcolor: '#2e7d32', color: '#fff' }}
                            />
                            {uploadResult.failedBooks > 0 && (
                                <Chip 
                                    label={`Fallidos: ${uploadResult.failedBooks}`}
                                    sx={{ bgcolor: '#d32f2f', color: '#fff' }}
                                />
                            )}
                        </Box>

                        {uploadResult.errors && uploadResult.errors.length > 0 && (
                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 2, color: '#fff' }}>
                                    Errores encontrados:
                                </Typography>
                                <List sx={{ maxHeight: 200, overflow: 'auto', bgcolor: '#0f0f0f', borderRadius: 1 }}>
                                    {uploadResult.errors.map((error, index) => (
                                        <ListItem key={index} sx={{ py: 1 }}>
                                            <ListItemText
                                                primary={error.bookTitle || `Línea ${error.line || 'desconocida'}`}
                                                secondary={error.error}
                                                primaryTypographyProps={{ color: '#fff', fontSize: '0.9rem' }}
                                                secondaryTypographyProps={{ color: '#ccc', fontSize: '0.8rem' }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ bgcolor: '#2a2a2a', p: 2 }}>
                {!uploadResult ? (
                    <>
                        <Button 
                            onClick={handleClose}
                            sx={{ 
                                color: '#ccc',
                                '&:hover': { bgcolor: '#333' }
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={!selectedFile || loading}
                            variant="contained"
                            startIcon={loading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                            sx={{
                                bgcolor: '#ef4444',
                                color: '#fff',
                                '&:hover': { bgcolor: '#dc2626' },
                                '&:disabled': { bgcolor: '#555', color: '#999' }
                            }}
                        >
                            {loading ? 'Procesando...' : 'Subir Archivo'}
                        </Button>
                    </>
                ) : (
                    <Button
                        onClick={handleClose}
                        variant="contained"
                        sx={{
                            bgcolor: '#ef4444',
                            color: '#fff',
                            '&:hover': { bgcolor: '#dc2626' }
                        }}
                    >
                        Cerrar
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
