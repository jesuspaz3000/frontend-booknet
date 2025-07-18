'use client';

import { useState } from 'react';
import Navbar from "@/views/home/navbar";
import { users } from "@/constants/users";
import AddUser from "./addUser";
import EditUser from "./editUser";
import DeleteUser from "./deleteUser";
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
    TablePagination
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';

interface User {
    id: number;
    name: string;
    image: string;
    calification: number;
    comment: string;
    date: string;
    email?: string;
    status?: 'active' | 'inactive' | 'suspended';
    role?: 'user' | 'admin';
}

interface UserFormData {
    name: string;
    email: string;
    image: string;
    role: 'user' | 'admin';
}

export default function UserManagement() {
    const [userList, setUserList] = useState<User[]>(
        users.map(user => ({
            ...user,
            email: `${user.name.toLowerCase().replace(' ', '.')}@booknet.com`,
            status: Math.random() > 0.2 ? 'active' : (Math.random() > 0.5 ? 'inactive' : 'suspended'),
            role: Math.random() > 0.8 ? 'admin' : 'user'
        })) as User[]
    );
    
    const [addUserOpen, setAddUserOpen] = useState(false);
    const [editUserOpen, setEditUserOpen] = useState(false);
    const [deleteUserOpen, setDeleteUserOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Funciones para manejar los modales
    const handleOpenAddUser = () => {
        setAddUserOpen(true);
    };

    const handleCloseAddUser = () => {
        setAddUserOpen(false);
    };

    const handleOpenEditUser = (user: User) => {
        setSelectedUser(user);
        setEditUserOpen(true);
    };

    const handleCloseEditUser = () => {
        setEditUserOpen(false);
        setSelectedUser(null);
    };

    const handleOpenDeleteUser = (user: User) => {
        setSelectedUser(user);
        setDeleteUserOpen(true);
    };

    const handleCloseDeleteUser = () => {
        setDeleteUserOpen(false);
        setSelectedUser(null);
    };

    // Funciones para manejar las acciones CRUD
    const handleAddUser = (userData: UserFormData) => {
        const newUser: User = {
            id: Math.max(...userList.map(u => u.id)) + 1,
            ...userData,
            calification: 0, // Valor por defecto
            comment: '', // Valor por defecto
            date: new Date().toISOString().split('T')[0]
        };
        setUserList([...userList, newUser]);
        handleCloseAddUser();
    };

    const handleUpdateUser = (userData: UserFormData) => {
        if (selectedUser) {
            setUserList(userList.map(user =>
                user.id === selectedUser.id
                    ? { ...user, ...userData, date: new Date().toISOString().split('T')[0] }
                    : user
            ));
            handleCloseEditUser();
        }
    };

    const handleDeleteUser = (userId: number) => {
        setUserList(userList.filter(user => user.id !== userId));
        handleCloseDeleteUser();
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Calcular datos paginados
    const paginatedUsers = userList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const getRoleColor = (role: string): 'error' | 'warning' | 'info' | 'default' => {
        switch (role) {
            case 'admin':
                return 'error';
            case 'user':
                return 'info';
            default:
                return 'default';
        }
    };

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
                            {paginatedUsers.map((user, index) => (
                                <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: '#374151' } }}>
                                    <TableCell sx={{ color: 'white' }}>
                                        {page * rowsPerPage + index + 1}
                                    </TableCell>
                                    <TableCell sx={{ color: 'white' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            {user.image ? (
                                                <Avatar src={user.image} alt={user.name} />
                                            ) : (
                                                <Avatar sx={{ backgroundColor: '#374151' }}>
                                                    <PersonIcon />
                                                </Avatar>
                                            )}
                                            <Typography sx={{ color: 'white' }}>{user.name}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ color: '#d1d5db' }}>
                                        {user.email}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.role}
                                            color={getRoleColor(user.role || 'user')}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell sx={{ color: '#d1d5db' }}>
                                        {user.date}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleOpenEditUser(user)}
                                            sx={{ color: '#60a5fa', '&:hover': { color: '#3b82f6' } }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleOpenDeleteUser(user)}
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
                        count={userList.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Filas por página:"
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                        sx={{
                            color: 'white',
                            '& .MuiTablePagination-toolbar': {
                                backgroundColor: '#1f2937',
                            },
                            '& .MuiTablePagination-selectLabel': {
                                color: 'white',
                            },
                            '& .MuiTablePagination-displayedRows': {
                                color: 'white',
                            },
                            '& .MuiTablePagination-select': {
                                color: 'white',
                            },
                            '& .MuiTablePagination-selectIcon': {
                                color: 'white',
                            },
                            '& .MuiIconButton-root': {
                                color: 'white',
                            },
                            '& .MuiTablePagination-actions': {
                                color: 'white',
                            },
                        }}
                    />
                </TableContainer>

                {/* Componentes de modales */}
                <AddUser
                    open={addUserOpen}
                    onClose={handleCloseAddUser}
                    onSave={handleAddUser}
                />

                <EditUser
                    open={editUserOpen}
                    user={selectedUser}
                    onClose={handleCloseEditUser}
                    onSave={handleUpdateUser}
                />

                <DeleteUser
                    open={deleteUserOpen}
                    user={selectedUser}
                    onClose={handleCloseDeleteUser}
                    onConfirm={handleDeleteUser}
                />
            </div>
        </div>
    );
}