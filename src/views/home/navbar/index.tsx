'use client';

import { useState } from 'react';
import Link from "next/link";
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Image from 'next/image';
import { Box, Button, Collapse } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export default function NavBar() {
    const [expanded, setExpanded] = useState(false);
    const [searchExpanded, setSearchExpanded] = useState(false);
    const [isMenuLocked, setIsMenuLocked] = useState(false);

    const handleMouseEnter = () => {
        if (!isMenuLocked) {
            setExpanded(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isMenuLocked) {
            setExpanded(false);
        }
    };

    const handleMenuItemClick = () => {
        setExpanded(false);
        setIsMenuLocked(false);
    };

    const handleUserButtonClick = () => {
        setExpanded(!expanded);
        setIsMenuLocked(!expanded);
    };

    const handleSearchClick = () => {
        setSearchExpanded(!searchExpanded);
    };

    const handleSearchClose = () => {
        setSearchExpanded(false);
    };

    // Manejar tecla Escape para cerrar búsqueda
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
            handleSearchClose();
        }
    };

    return (
        <div className="tw:z-50 tw:fixed tw:w-full tw:h-20 tw:flex tw:justify-between tw:items-center tw:py-4">
            <div className="tw:absolute tw:z-10 tw:bg-black tw:opacity-50 tw:w-full tw:h-full"></div>
            <div className="tw:px-16 tw:flex tw:justify-between tw:items-center tw:w-full">
                <div className="tw:z-50 tw:cursor-pointer">
                    <Link href="/">
                        <Image
                            src="/images/BookNetLogo.png"
                            width={150}
                            height={150}
                            alt="logo"
                            className="tw:rounded-full tw:w-auto tw:h-[50px]"
                        />
                    </Link>
                </div>
                <div className="tw:flex tw:text-xl tw:font-bold tw:gap-10 tw:z-50">
                    <Link href="/home">Inicio</Link>
                    <Link href="/home">Series</Link>
                    <Link href="/home">Libros</Link>
                    <Link href="/home">Niños y Familia</Link>
                </div>
                <div className="tw:flex tw:items-center tw:gap-6 tw:z-50">
                    <IconButton sx={{ color: 'white' }} onClick={handleSearchClick}>
                        <SearchIcon sx={{ fontSize: '2rem' }} />
                    </IconButton>

                    <Box
                        sx={{ position: 'relative' }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        {/* Botón usuario con posición fija */}
                        <Button
                            onClick={handleUserButtonClick}
                            sx={{
                                position: 'relative',
                                zIndex: 60,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                padding: '8px 12px',
                                borderRadius: '4px',
                                backgroundColor: expanded ? 'rgba(0,0,0,0.8)' : 'transparent',
                                color: 'white',
                                transition: 'all 0.3s ease',
                                width: '55px', // Ancho fijo para no desplazar otros elementos
                                height: '55px',
                                minWidth: '48px',
                                justifyContent: 'center',
                                '&:hover': {
                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                }
                            }}
                        >
                            <Image
                                src="/images/perfil.jpeg"
                                width={40}
                                height={40}
                                alt='perfil'
                                className='tw:rounded-full'
                            />
                        </Button>

                        {/* Versión expandida que aparece por encima */}
                        {expanded && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    zIndex: 55,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    padding: '8px 12px',
                                    borderRadius: '4px',
                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                    color: 'white',
                                    minWidth: '250px',
                                    height: '48px',
                                    justifyContent: 'flex-start',
                                    backdropFilter: 'blur(10px)',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                    animation: 'slideIn 0.3s ease-out',
                                    '@keyframes slideIn': {
                                        from: {
                                            width: '48px',
                                            opacity: 0.7,
                                        },
                                        to: {
                                            width: '250px',
                                            opacity: 1,
                                        }
                                    }
                                }}
                            >
                                <Image
                                    src="/images/perfil.jpeg"
                                    width={32}
                                    height={32}
                                    alt='perfil'
                                    className='tw:rounded-full'
                                />
                                <span style={{ fontSize: '14px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                                    User
                                </span>
                                <ExpandLessIcon sx={{ marginLeft: 'auto' }} />
                            </Box>
                        )}

                        {/* Menú desplegable */}
                        <Collapse in={expanded} timeout={200}>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    backgroundColor: 'rgba(0,0,0,0.9)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '4px',
                                    minWidth: '250px',
                                    padding: '12px 0',
                                    marginTop: '4px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                                    zIndex: 54,
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: '-4px',
                                        right: '0',
                                        width: '100%',
                                        height: '4px',
                                        backgroundColor: 'transparent',
                                    }
                                }}
                            >
                                <Box sx={{ padding: '0 8px' }}>
                                    <Box
                                        sx={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                                        onClick={handleMenuItemClick}
                                    >
                                        <Link
                                            style={{ color: 'white', fontSize: '20px', textDecoration: 'none', display: 'block', width: '100%' }}
                                            href="/userManagement"
                                        >
                                            Gestionar Usuarios
                                        </Link>
                                    </Box>
                                    <Box
                                        sx={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                                        onClick={handleMenuItemClick}
                                    >
                                        <Link
                                            style={{ color: 'white', fontSize: '20px', textDecoration: 'none', display: 'block', width: '100%' }}
                                            href="/configurations"
                                        >
                                            Ajustes
                                        </Link>
                                    </Box>
                                    <Box
                                        sx={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                                        onClick={handleMenuItemClick}
                                    >
                                        <Link
                                            style={{ color: 'white', fontSize: '20px', textDecoration: 'none', display: 'block', width: '100%' }}
                                            href="/accountSettings"
                                        >
                                            Cuenta
                                        </Link>
                                    </Box>

                                    <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '12px', paddingTop: '12px' }}>
                                        <Box
                                            sx={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                                            onClick={handleMenuItemClick}
                                        >
                                            <span style={{ color: 'white', fontSize: '20px' }}>Cerrar sesión</span>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Collapse>
                    </Box>
                </div>
            </div>

            {/* Desplegable de búsqueda con animación sincronizada */}
            <Collapse in={searchExpanded} timeout={150}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        padding: '20px 0',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                        zIndex: 40,
                        overflow: 'hidden',
                    }}
                    onKeyDown={handleKeyDown}
                >
                    <div
                        className="tw:px-16 tw:flex tw:items-center tw:gap-4"
                        style={{
                            opacity: searchExpanded ? 1 : 0,
                            transform: searchExpanded ? 'translateY(0)' : 'translateY(-10px)',
                            transition: 'opacity 0.15s ease, transform 0.15s ease',
                        }}
                    >
                        <Box sx={{ flex: 1, position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Buscar series, libros, documentales..."
                                autoFocus
                                onKeyDown={handleKeyDown}
                                style={{
                                    width: '100%',
                                    padding: '12px 20px',
                                    fontSize: '18px',
                                    backgroundColor: 'transparent',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    outline: 'none',
                                    transition: 'border-color 0.2s ease',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'rgba(255,255,255,0.6)';
                                }}
                            />
                        </Box>
                        <IconButton
                            sx={{
                                color: 'white',
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                minWidth: '40px',
                                transition: 'all 0.15s ease',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    transform: 'scale(1.05)'
                                }
                            }}
                            onClick={handleSearchClose}
                        >
                            <Box sx={{ fontSize: '20px', lineHeight: 1 }}>✕</Box>
                        </IconButton>
                    </div>
                </Box>
            </Collapse>
        </div>
    );
}