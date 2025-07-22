'use client';

import { useState, useEffect, useCallback } from 'react';
import userManagementService, { User } from "@/services/dashboard/userManagement/userManagement.service";
import AddUser from './addUser';
import EditUser from './editUser';
import DeleteUser from './deleteUser';
import CommonTable, { TableColumn } from '@/components/commons/table';
import {
    IconButton,
    Avatar,
    Button,
    Box,
    Typography,
    Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';

// Definir las columnas de la tabla de usuarios
const getUserColumns = (
    page: number,
    rowsPerPage: number,
    onEditUser: (user: User) => void,
    onDeleteUser: (user: User) => void
): TableColumn<User>[] => {
    const getRoleColor = (role: 'USER' | 'ADMIN'): 'error' | 'info' => {
        return role === 'ADMIN' ? 'error' : 'info';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES');
    };

    return [
        {
            id: 'index',
            label: 'ID',
            format: (_, __, index) => page * rowsPerPage + (index || 0) + 1
        },
        {
            id: 'username',
            label: 'Usuario',
            format: (value) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ 
                        backgroundColor: '#60a5fa',
                        color: '#1a1a1a',
                        width: 32,
                        height: 32
                    }}>
                        <PersonIcon sx={{ fontSize: '1rem' }} />
                    </Avatar>
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
            id: 'email',
            label: 'Email',
            format: (value) => (
                <Typography sx={{ 
                    color: '#9ca3af',
                    fontSize: '0.875rem'
                }}>
                    {String(value)}
                </Typography>
            )
        },
        {
            id: 'role',
            label: 'Rol',
            format: (value) => (
                <Chip
                    label={String(value)}
                    color={getRoleColor(value as 'USER' | 'ADMIN')}
                    size="small"
                    sx={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        ...(value === 'ADMIN' && {
                            bgcolor: '#7c2d12',
                            color: '#fed7aa'
                        }),
                        ...(value === 'USER' && {
                            bgcolor: '#1e3a8a',
                            color: '#bfdbfe'
                        })
                    }}
                />
            )
        },
        {
            id: 'updatedAt',
            label: 'Fecha de Actualización',
            format: (value) => (
                <Typography sx={{ 
                    color: '#9ca3af',
                    fontSize: '0.875rem'
                }}>
                    {formatDate(String(value))}
                </Typography>
            )
        },
        {
            id: 'actions',
            label: 'Acciones',
            format: (_, user) => (
                <Box>
                    <IconButton
                        onClick={() => onEditUser(user)}
                        sx={{ 
                            color: '#60a5fa', 
                            '&:hover': { 
                                color: '#3b82f6',
                                backgroundColor: 'rgba(96, 165, 250, 0.1)'
                            },
                            mr: 1
                        }}
                    >
                        <EditIcon sx={{ fontSize: '1.1rem' }} />
                    </IconButton>
                    <IconButton
                        onClick={() => onDeleteUser(user)}
                        sx={{ 
                            color: '#ef4444', 
                            '&:hover': { 
                                color: '#dc2626',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)'
                            }
                        }}
                    >
                        <DeleteIcon sx={{ fontSize: '1.1rem' }} />
                    </IconButton>
                </Box>
            )
        }
    ];
};

export default function UserManagement() {
    const [userList, setUserList] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalUsers, setTotalUsers] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    
    // Estados para los modales
    const [addUserOpen, setAddUserOpen] = useState(false);
    const [editUserOpen, setEditUserOpen] = useState(false);
    const [deleteUserOpen, setDeleteUserOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Cargar usuarios desde el servicio
    const loadUsers = useCallback(async (currentPage: number, currentRowsPerPage: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await userManagementService.getUsers({
                limit: currentRowsPerPage,
                offset: currentPage * currentRowsPerPage
            });
            setUserList(response.data.users);
            setTotalUsers(response.data.totalUsers);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error cargando usuarios');
        } finally {
            setLoading(false);
        }
    }, []);

    // Cargar usuarios al montar el componente
    useEffect(() => {
        loadUsers(page, rowsPerPage);
    }, [page, rowsPerPage, loadUsers]);

    // Funciones para manejar los modales
    const handleOpenAddUser = () => {
        setAddUserOpen(true);
    };

    const handleOpenEditUser = (user: User) => {
        setSelectedUserId(user.id.toString());
        setEditUserOpen(true);
    };

    const handleOpenDeleteUser = (user: User) => {
        setSelectedUser(user);
        setDeleteUserOpen(true);
    };

    // Callbacks para recargar la lista después de agregar/editar
    const handleUserAdded = () => {
        loadUsers(page, rowsPerPage);
    };

    const handleUserUpdated = () => {
        loadUsers(page, rowsPerPage);
    };

    const handleUserDeleted = () => {
        loadUsers(page, rowsPerPage);
    };

    // Handlers para cerrar modales
    const handleCloseAddUser = () => {
        setAddUserOpen(false);
    };

    const handleCloseEditUser = () => {
        setEditUserOpen(false);
        setSelectedUserId(null);
    };

    const handleCloseDeleteUser = () => {
        setDeleteUserOpen(false);
        setSelectedUser(null);
    };

    const handleChangePage = useCallback((event: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    }, []);

    return (
        <Box sx={{ 
            bgcolor: '#000', 
            minHeight: '100vh',
            p: { xs: 2, sm: 3, md: 4 },
            pt: { xs: 3, sm: 4, md: 5 }
        }}>
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: { xs: 3, sm: 4, md: 5 },
                mx: { xs: 1, sm: 2, md: 3 }
            }}>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        color: '#fff', 
                        fontWeight: 700,
                        fontSize: '1.875rem'
                    }}
                >
                    Gestión de Usuarios
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAddUser}
                    sx={{
                        backgroundColor: '#60a5fa',
                        color: '#1a1a1a',
                        fontWeight: 600,
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        '&:hover': { 
                            backgroundColor: '#3b82f6',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(96, 165, 250, 0.3)'
                        },
                        transition: 'all 0.2s ease'
                    }}
                >
                    Agregar Usuario
                </Button>
            </Box>

            <CommonTable<User>
                columns={getUserColumns(page, rowsPerPage, handleOpenEditUser, handleOpenDeleteUser)}
                data={userList}
                loading={loading}
                error={error}
                totalCount={totalUsers}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                getRowKey={(user) => user.id.toString()}
                emptyMessage="No hay usuarios disponibles"
            />

            {/* Modales para agregar, editar y eliminar usuarios */}
            <AddUser
                open={addUserOpen}
                onClose={handleCloseAddUser}
                onUserAdded={handleUserAdded}
            />
            
            <EditUser
                open={editUserOpen}
                userId={selectedUserId}
                onClose={handleCloseEditUser}
                onUserUpdated={handleUserUpdated}
            />
            
            <DeleteUser
                open={deleteUserOpen}
                user={selectedUser}
                onClose={handleCloseDeleteUser}
                onUserDeleted={handleUserDeleted}
            />
        </Box>
    );
}