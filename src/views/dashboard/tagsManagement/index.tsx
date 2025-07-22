'use client';

import { useState, useEffect, useCallback } from 'react';
import tagsManagementService, { Tag } from "@/services/dashboard/tagsManagement/tagsManagement.service";
import AddTag from './addTags';
import EditTag from './editTags';
import DeleteTag from './deleteTags';
import CommonTable, { TableColumn } from '@/components/commons/table';
import {
    IconButton,
    Button,
    Box,
    Typography,
    Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

// Definir las columnas de la tabla de tags
const getTagColumns = (
    page: number,
    rowsPerPage: number,
    onEditTag: (tag: Tag) => void,
    onDeleteTag: (tag: Tag) => void
): TableColumn<Tag>[] => {
    return [
        {
            id: 'index',
            label: 'ID',
            format: (_, __, index) => page * rowsPerPage + (index || 0) + 1
        },
        {
            id: 'nombre',
            label: 'Tag',
            format: (value) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LocalOfferIcon sx={{ 
                        color: '#60a5fa',
                        fontSize: '1.2rem'
                    }} />
                    <Typography sx={{ 
                        color: '#fff', 
                        fontWeight: 500,
                        fontSize: '0.875rem'
                    }}>
                        {String(value)}
                    </Typography>
                </Box>
            )
        },
        {
            id: 'categoria',
            label: 'Categoría',
            format: (value) => (
                <Chip
                    label={String(value)}
                    size="small"
                    sx={{
                        bgcolor: '#7c3aed',
                        color: '#fff',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        '&:hover': {
                            bgcolor: '#6d28d9'
                        }
                    }}
                />
            )
        },
        {
            id: 'actions',
            label: 'Acciones',
            format: (_, tag) => (
                <Box>
                    <IconButton
                        onClick={() => onEditTag(tag)}
                        sx={{
                            color: '#60a5fa',
                            '&:hover': {
                                bgcolor: 'rgba(96, 165, 250, 0.1)',
                                transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease'
                        }}
                        size="small"
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        onClick={() => onDeleteTag(tag)}
                        sx={{
                            color: '#ef4444',
                            '&:hover': {
                                bgcolor: 'rgba(239, 68, 68, 0.1)',
                                transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease'
                        }}
                        size="small"
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            )
        }
    ];
};

export default function TagsManagement() {
    const [tagList, setTagList] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalTags, setTotalTags] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Estados para modales
    const [openAddTag, setOpenAddTag] = useState(false);
    const [openEditTag, setOpenEditTag] = useState(false);
    const [openDeleteTag, setOpenDeleteTag] = useState(false);
    const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

    const loadTags = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await tagsManagementService.getTags({
                limit: rowsPerPage,
                offset: page * rowsPerPage
            });
            
            if (response.success && response.data) {
                setTagList(response.data.tags || []);
                setTotalTags(response.data.total || 0);
            } else {
                setError(response.message || 'Error al cargar tags');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error de conexión');
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage]);

    useEffect(() => {
        loadTags();
    }, [loadTags]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    };

    // Handlers para modales
    const handleOpenAddTag = () => setOpenAddTag(true);
    const handleCloseAddTag = () => setOpenAddTag(false);

    const handleOpenEditTag = (tag: Tag) => {
        setSelectedTag(tag);
        setOpenEditTag(true);
    };
    const handleCloseEditTag = () => {
        setSelectedTag(null);
        setOpenEditTag(false);
    };

    const handleOpenDeleteTag = (tag: Tag) => {
        setSelectedTag(tag);
        setOpenDeleteTag(true);
    };
    const handleCloseDeleteTag = () => {
        setSelectedTag(null);
        setOpenDeleteTag(false);
    };

    const handleTagAdded = () => {
        loadTags();
        handleCloseAddTag();
    };

    const handleTagUpdated = () => {
        loadTags();
        handleCloseEditTag();
    };

    const handleTagDeleted = () => {
        loadTags();
        handleCloseDeleteTag();
    };

    return (
        <Box sx={{ 
            p: { xs: 2, sm: 3, md: 4 }, 
            bgcolor: '#000', 
            minHeight: '100vh',
            height: '100%',
            color: '#fff'
        }}>
            {/* Header */}
            <Box sx={{ 
                mb: 4, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2
            }}>
                <Box>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            fontWeight: 'bold', 
                            color: '#fff', 
                            mb: 1,
                            fontSize: { xs: '1.5rem', sm: '2rem' }
                        }}
                    >
                        🏷️ Gestión de Tags
                    </Typography>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            color: '#9ca3af',
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                    >
                        Administra las etiquetas de libros del sistema
                    </Typography>
                </Box>
                
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAddTag}
                    sx={{
                        backgroundColor: '#7c3aed',
                        color: '#fff',
                        fontWeight: 600,
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        '&:hover': { 
                            backgroundColor: '#6d28d9',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
                        },
                        transition: 'all 0.2s ease'
                    }}
                >
                    Agregar Tag
                </Button>
            </Box>

            <CommonTable<Tag>
                columns={getTagColumns(page, rowsPerPage, handleOpenEditTag, handleOpenDeleteTag)}
                data={tagList}
                loading={loading}
                error={error}
                totalCount={totalTags}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                getRowKey={(tag) => tag.id}
            />

            {/* Modales */}
            <AddTag
                open={openAddTag}
                onClose={handleCloseAddTag}
                onTagAdded={handleTagAdded}
            />

            <EditTag
                open={openEditTag}
                tag={selectedTag}
                onClose={handleCloseEditTag}
                onTagUpdated={handleTagUpdated}
            />

            <DeleteTag
                open={openDeleteTag}
                tag={selectedTag}
                onClose={handleCloseDeleteTag}
                onTagDeleted={handleTagDeleted}
            />
        </Box>
    );
}