'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Person as PersonIcon,
    Category as CategoryIcon,
    LocalOffer as TagIcon,
    MenuBook as BookIcon,
    Home as HomeIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';

const drawerWidth = 280;

interface DashboardLayoutProps {
    children: React.ReactNode;
}

interface MenuItem {
    text: string;
    icon: React.ReactNode;
    path: string;
    description: string;
    color: string;
}

const menuItems: MenuItem[] = [
    {
        text: 'Dashboard',
        icon: <DashboardIcon />,
        path: '/dashboard',
        description: 'Vista general del sistema',
        color: '#2196f3'
    },
    {
        text: 'Usuarios',
        icon: <PeopleIcon />,
        path: '/dashboard/userManagement',
        description: 'Gestión de usuarios',
        color: '#1976d2'
    },
    {
        text: 'Autores',
        icon: <PersonIcon />,
        path: '/dashboard/authorManagement',
        description: 'Gestión de autores',
        color: '#388e3c'
    },
    {
        text: 'Géneros',
        icon: <CategoryIcon />,
        path: '/dashboard/genresManagement',
        description: 'Géneros literarios',
        color: '#f57c00'
    },
    {
        text: 'Tags',
        icon: <TagIcon />,
        path: '/dashboard/tagsManagement',
        description: 'Etiquetas de libros',
        color: '#7b1fa2'
    },
    {
        text: 'Libros',
        icon: <BookIcon />,
        path: '/dashboard/bookManagement',
        description: 'Catálogo de libros',
        color: '#d32f2f'
    }
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };



    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const handleGoHome = () => {
        router.push('/home');
    };

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header del Sidebar */}
            <Box
                sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #333 0%, #444 100%)',
                    color: 'white'
                }}
            >
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Panel de Administración
                </Typography>
            </Box>

            <Divider />

            {/* Información del Usuario */}
            <Box sx={{ p: 2, bgcolor: '#2a2a2a' }}>
                <Typography variant="body2" sx={{ color: '#ccc', mb: 0.5 }}>
                    Conectado como:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium', color: '#fff' }}>
                    {user?.username || 'Admin'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#888' }}>
                    {user?.email || 'admin@booknet.com'}
                </Typography>
            </Box>

            <Divider />

            {/* Menú de Navegación */}
            <List sx={{ flexGrow: 1, py: 1 }}>
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                component="a"
                                href={item.path}
                                selected={pathname === item.path}
                                sx={{
                                    borderRadius: 2,
                                    mb: 0.5,
                                    color: '#fff',
                                    '&.Mui-selected': {
                                        bgcolor: `${item.color}20`,
                                        color: item.color,
                                        '&:hover': {
                                            bgcolor: `${item.color}30`,
                                        },
                                    },
                                    '&:hover': {
                                        bgcolor: '#2a2a2a',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40, color: '#fff' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    secondary={item.description}
                                    secondaryTypographyProps={{
                                        fontSize: '0.75rem',
                                        color: '#ccc'
                                    }}
                                    primaryTypographyProps={{
                                        color: isActive ? item.color : '#fff'
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Divider />

            {/* Acciones del Footer */}
            <Box sx={{ p: 1 }}>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={handleGoHome}
                        sx={{
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': { backgroundColor: '#f5f5f5', color: '#000' }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <HomeIcon sx={{ color: '#666' }} />
                        </ListItemIcon>
                        <ListItemText
                            primary="Ir al Inicio"
                            primaryTypographyProps={{ fontSize: '0.9rem' }}
                        />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            borderRadius: 2,
                            '&:hover': { backgroundColor: '#ffebee' },
                            '& .MuiListItemIcon-root': { color: '#d32f2f' },
                            '& .MuiListItemText-primary': { color: '#d32f2f' }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Cerrar Sesión"
                            primaryTypographyProps={{ fontSize: '0.9rem' }}
                        />
                    </ListItemButton>
                </ListItem>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fafafa' }}>
            {/* AppBar para móviles */}
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    display: { md: 'none' },
                    bgcolor: '#1976d2'
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        BookNet Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Sidebar Navigation */}
            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
            >
                {/* Drawer para móviles */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { 
                            boxSizing: 'border-box', 
                            width: drawerWidth,
                            bgcolor: '#1a1a1a',
                            color: '#fff',
                            borderRight: '1px solid #333'
                        },
                    }}
                >
                    {drawer}
                </Drawer>

                {/* Drawer permanente para desktop */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { 
                            boxSizing: 'border-box', 
                            width: drawerWidth,
                            bgcolor: '#1a1a1a',
                            color: '#fff',
                            borderRight: '1px solid #333'
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Contenido Principal */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    mt: { xs: '64px', md: 0 },
                    minHeight: '100vh',
                    bgcolor: '#fafafa'
                }}
            >
                {children}
            </Box>
        </Box>
    );
}