'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import Navbar from "@/views/home/navbar";
import userManagementService, { User } from "@/services/userManagement/userManagement.service";
import AddUser from './addUser';
import EditUser from './editUser';
import DeleteUser from './deleteUser';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Avatar,
    Button,
    Box,
    Typography,
    Chip,
    TablePagination,
    CircularProgress,
    Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';

// Componente memoizado para la tabla de usuarios
const UsersTable = memo(({ 
    users, 
    loading, 
    error, 
    totalUsers, 
    page, 
    rowsPerPage, 
    onPageChange, 
    onRowsPerPageChange, 
    onEditUser, 
    onDeleteUser 
}: {
    users: User[];
    loading: boolean;
    error: string | null;
    totalUsers: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: unknown, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onEditUser: (user: User) => void;
    onDeleteUser: (user: User) => void;
}) => {
    const getRoleColor = (role: 'USER' | 'ADMIN'): 'error' | 'info' => {
        return role === 'ADMIN' ? 'error' : 'info';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress sx={{ color: 'white' }} />
            </Box>
        );
    }

    return (
        <>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <TableContainer 
                component={Paper} 
                sx={{ 
                    backgroundColor: '#1f2937',
                    paddingY: 2,
                    paddingX: 4,
                    '& .MuiTableCell-root': {
                        borderColor: '#374151'
                    }
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Usuario</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rol</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha de Actualización</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: '#374151' } }}>
                                <TableCell sx={{ color: 'white' }}>
                                    {page * rowsPerPage + index + 1}
                                </TableCell>
                                <TableCell sx={{ color: 'white' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ backgroundColor: '#374151' }}>
                                            <PersonIcon />
                                        </Avatar>
                                        <Typography sx={{ color: 'white' }}>{user.username}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ color: '#d1d5db' }}>
                                    {user.email}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.role}
                                        color={getRoleColor(user.role)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell sx={{ color: '#d1d5db' }}>
                                    {formatDate(user.updatedAt)}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => onEditUser(user)}
                                        sx={{ color: '#60a5fa', '&:hover': { color: '#3b82f6' } }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => onDeleteUser(user)}
                                        sx={{ color: '#ef4444', '&:hover': { color: '#dc2626' } }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={totalUsers}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                    labelRowsPerPage="Filas por página:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
                    sx={{
                        color: 'white',
                        '& .MuiTablePagination-selectIcon': {
                            color: 'white'
                        },
                        '& .MuiTablePagination-select': {
                            color: 'white'
                        },
                        '& .MuiTablePagination-displayedRows': {
                            color: 'white'
                        }
                    }}
                />
            </TableContainer>
        </>
    );
});

UsersTable.displayName = 'UsersTable';

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
        <div className="tw:bg-black tw:min-h-screen">
            <Navbar />
            <div className="tw:container tw:mx-auto tw:px-4 tw:py-8 tw:pt-36">
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 4 
                }}>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                        Gestión de Usuarios
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenAddUser}
                        sx={{
                            backgroundColor: '#2563eb',
                            '&:hover': { backgroundColor: '#1d4ed8' }
                        }}
                    >
                        Agregar Usuario
                    </Button>
                </Box>

                <UsersTable
                    users={userList}
                    loading={loading}
                    error={error}
                    totalUsers={totalUsers}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    onEditUser={handleOpenEditUser}
                    onDeleteUser={handleOpenDeleteUser}
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
            </div>
        </div>
    );
}