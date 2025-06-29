'use client';

import { useState } from 'react';
import { MouseEvent } from 'react';
import NavBar from "../home/navbar";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { MenuItem, FormControl, ToggleButton, ToggleButtonGroup, Checkbox, Button } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import Slider from '@mui/material/Slider';
import Link from 'next/link';

export default function Configurations() {
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [title, setTitle] = useState<string>('');
    const [font, setFont] = useState<string>('');
    const [view, setView] = useState<string>('list');
    const [theme, setTheme] = useState<string>('light');

    const handleSectionClick = (section: string) => {
        setActiveSection(activeSection === section ? null : section);
    };

    const handleChangeTitle = (event: SelectChangeEvent) => {
        setTitle(event.target.value);
    };

    const handleChangeFont = (event: SelectChangeEvent) => {
        setFont(event.target.value);
    };

    const handleChangeView = (event: MouseEvent<HTMLElement>, newAlignment: string) => {
        setView(newAlignment);
    };

    const handleChangeTheme = (event: MouseEvent<HTMLElement>, newAlignment: string) => {
        setTheme(newAlignment);
    };

    const fontSizeBoxShadow = '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

    const FontSizeSlider = styled(Slider)(({ theme }) => ({
        color: '#007bff',
        height: 5,
        padding: '15px 0',
        '& .MuiSlider-thumb': {
            height: 20,
            width: 20,
            backgroundColor: '#fff',
            boxShadow: '0 0 2px 0px rgba(0, 0, 0, 0.1)',
            '&:focus, &:hover, &.Mui-active': {
                boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.1)',
                // Reset on touch devices, it doesn't add specificity
                '@media (hover: none)': {
                    boxShadow: fontSizeBoxShadow,
                },
            },
            '&:before': {
                boxShadow: '0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)',
            },
        },
        '& .MuiSlider-valueLabel': {
            fontSize: 12,
            fontWeight: 'normal',
            top: -6,
            backgroundColor: 'unset',
            color: '#fff',
            '&::before': {
                display: 'none',
            },
            '& *': {
                background: 'transparent',
                color: '#fff',
            },
        },
        '& .MuiSlider-track': {
            border: 'none',
            height: 5,
        },
        '& .MuiSlider-rail': {
            opacity: 0.5,
            boxShadow: 'inset 0px 0px 4px -2px #000',
            backgroundColor: '#d0d0d0',
        },
        ...theme.applyStyles('dark', {
            color: '#0a84ff',
        }),
    }));

    const lineSpacingBoxShadow = '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

    const LineSpacingSlider = styled(Slider)(({ theme }) => ({
        color: '#007bff',
        height: 5,
        padding: '15px 0',
        '& .MuiSlider-thumb': {
            height: 20,
            width: 20,
            backgroundColor: '#fff',
            boxShadow: '0 0 2px 0px rgba(0, 0, 0, 0.1)',
            '&:focus, &:hover, &.Mui-active': {
                boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.1)',
                // Reset on touch devices, it doesn't add specificity
                '@media (hover: none)': {
                    boxShadow: lineSpacingBoxShadow,
                },
            },
            '&:before': {
                boxShadow: '0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)',
            },
        },
        '& .MuiSlider-valueLabel': {
            fontSize: 12,
            fontWeight: 'normal',
            top: -6,
            backgroundColor: 'unset',
            color: '#fff',
            '&::before': {
                display: 'none',
            },
            '& *': {
                background: 'transparent',
                color: '#fff',
            },
        },
        '& .MuiSlider-track': {
            border: 'none',
            height: 5,
        },
        '& .MuiSlider-rail': {
            opacity: 0.5,
            boxShadow: 'inset 0px 0px 4px -2px #000',
            backgroundColor: '#d0d0d0',
        },
        ...theme.applyStyles('dark', {
            color: '#0a84ff',
        }),
    }));

    return (
        <div>
            <NavBar />
            <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:min-h-screen tw:w-full tw:py-8">
                <div className="tw:flex tw:flex-col tw:items-center tw:w-[900px] tw:max-w-[90%]">
                    <h1 className="tw:text-5xl tw:font-bold tw:mb-16 tw:text-white">Ajustes</h1>

                    {/* Sección Biblioteca */}
                    <div className="tw:w-full">
                        <div onClick={() => handleSectionClick('biblioteca')}
                            className="tw:flex tw:items-center tw:justify-between tw:w-full tw:rounded-t-lg tw:relative tw:border-b-[0.5px] tw:border-[#e0e0e098] tw:cursor-pointer">
                            <div className="tw:absolute tw:w-full tw:h-full tw:bg-white tw:hover:opacity-7 tw:transition tw:duration-200 tw:opacity-5 tw:z-0 tw:rounded-t-lg"></div>
                            <h2 className="tw:text-xl tw:font-bold tw:z-10 tw:px-8 tw:py-6 tw:text-white">Biblioteca</h2>
                            <ArrowForwardIosIcon
                                sx={{
                                    fontSize: '1.5rem',
                                    marginRight: '1.5rem',
                                    color: 'white',
                                    transform: activeSection === 'biblioteca' ? 'rotate(90deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s ease'
                                }}
                            />
                        </div>

                        <div className={`tw:w-full tw:border-b-[0.5px] tw:border-[#e0e0e098] tw:transition-all tw:duration-300 tw:ease-in-out tw:overflow-hidden ${activeSection === 'biblioteca' ? 'tw:max-h-96 tw:opacity-100' : 'tw:max-h-0 tw:opacity-0'
                            }`}>
                            <div className="tw:relative">
                                <div className="tw:absolute tw:w-full tw:h-full tw:bg-white tw:opacity-3 tw:z-0"></div>
                                <div className="tw:space-y-4 tw:p-6">
                                    <div className="tw:flex tw:items-center tw:justify-between">
                                        <span className="tw:text-lg">Ordenar por</span>
                                        <FormControl
                                            sx={{
                                                width: '140px',
                                                backgroundColor: 'white',
                                                borderRadius: '5px',
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '5px',
                                                    '& fieldset': {
                                                        borderColor: 'transparent',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'transparent',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: 'transparent',
                                                    },
                                                }
                                            }}>
                                            <Select
                                                value={title}
                                                onChange={handleChangeTitle}
                                                displayEmpty
                                                renderValue={(selected) => (
                                                    <span style={{ opacity: selected ? 1 : 0.5 }}>
                                                        {selected || 'Ordenar por'}
                                                    </span>
                                                )}
                                                sx={{
                                                    color: 'black',
                                                    fontWeight: '600',
                                                }}
                                            >
                                                <MenuItem value="" disabled>Ordenar por</MenuItem>
                                                <MenuItem value="Título">Título</MenuItem>
                                                <MenuItem value="Autor">Autor</MenuItem>
                                                <MenuItem value="Fecha">Fecha</MenuItem>
                                                <MenuItem value="Ultimo leído">Ultimo leído</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="tw:flex tw:items-center tw:justify-between">
                                        <span className="tw:text-lg">Vista</span>
                                        <div className="tw:flex tw:space-x-2">
                                            <ToggleButtonGroup
                                                value={view}
                                                exclusive
                                                onChange={handleChangeView}
                                                sx={{
                                                    backgroundColor: '#111111', // fondo oscuro consistente
                                                    borderRadius: '8px',
                                                    padding: '4px',
                                                    gap: '4px',
                                                    '& .MuiToggleButtonGroup-grouped': {
                                                        border: 'none',
                                                        color: 'white',
                                                        borderRadius: '6px',
                                                        textTransform: 'none',
                                                        fontWeight: '500',
                                                        transition: 'all 0.2s ease',
                                                        '&.Mui-selected': {
                                                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                                            color: 'white',
                                                        },
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                        },
                                                    },
                                                }}
                                            >
                                                <ToggleButton value="list">Lista</ToggleButton>
                                                <ToggleButton value="grid">Cuadrícula</ToggleButton>
                                            </ToggleButtonGroup>

                                        </div>
                                    </div>
                                    <div className="tw:flex tw:items-center tw:justify-between">
                                        <span className="tw:text-lg">Mostrar progreso</span>
                                        <Checkbox defaultChecked color='default' sx={{ color: 'white' }} />
                                    </div>
                                    <div className="tw:flex tw:items-center tw:justify-between">
                                        <span className="tw:text-lg">Sincronización automática</span>
                                        <Checkbox defaultChecked color='default' sx={{ color: 'white' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección Tipografía */}
                    <div className="tw:w-full">
                        <div onClick={() => handleSectionClick('tipografia')}
                            className="tw:flex tw:items-center tw:justify-between tw:w-full tw:relative tw:border-b-[0.5px] tw:border-[#e0e0e098] tw:cursor-pointer">
                            <div className="tw:absolute tw:w-full tw:h-full tw:bg-white tw:hover:opacity-7 tw:transition tw:duration-200 tw:opacity-5 tw:z-0"></div>
                            <h2 className="tw:text-xl tw:font-bold tw:z-10 tw:px-8 tw:py-6 tw:text-white">Tipografía</h2>
                            <ArrowForwardIosIcon
                                sx={{
                                    fontSize: '1.5rem',
                                    marginRight: '1.5rem',
                                    color: 'white',
                                    transform: activeSection === 'tipografia' ? 'rotate(90deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s ease'
                                }}
                            />
                        </div>

                        <div className={`tw:w-full tw:border-b-[0.5px] tw:border-[#e0e0e098] tw:transition-all tw:duration-300 tw:ease-in-out tw:overflow-hidden ${activeSection === 'tipografia' ? 'tw:max-h-[500px] tw:opacity-100' : 'tw:max-h-0 tw:opacity-0'
                            }`}>
                            <div className="tw:relative">
                                <div className="tw:absolute tw:w-full tw:h-full tw:bg-white tw:opacity-3 tw:z-0"></div>
                                <div className="tw:space-y-6 tw:p-6">
                                    <div>
                                        <label className="tw:block tw:text-white tw:text-lg tw:mb-2">Fuente</label>
                                        <FormControl
                                            sx={{
                                                width: '100%',
                                                backgroundColor: 'white',
                                                borderRadius: '5px',
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '5px',
                                                    '& fieldset': {
                                                        borderColor: 'transparent',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'transparent',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: 'transparent',
                                                    },
                                                }
                                            }}
                                        >
                                            <Select
                                                value={font}
                                                onChange={handleChangeFont}
                                                displayEmpty
                                                renderValue={(selected) => (
                                                    <span style={{ opacity: selected ? 1 : 0.5 }}>
                                                        {selected || 'Seleccionar fuente'}
                                                    </span>
                                                )}
                                                sx={{
                                                    color: 'black',
                                                    fontWeight: '600',
                                                }}
                                            >
                                                <MenuItem value="" disabled>Seleccionar fuente</MenuItem>
                                                <MenuItem value="Arial">Arial</MenuItem>
                                                <MenuItem value="Times New Roman">Times New Roman</MenuItem>
                                                <MenuItem value="Georgia">Georgia</MenuItem>
                                                <MenuItem value="Roboto">Roboto</MenuItem>
                                                <MenuItem value="Open Sans">Open Sans</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div>
                                        <FontSizeSlider aria-label="ios slider" defaultValue={14} valueLabelDisplay="on" />
                                        <div className="tw:flex tw:justify-between tw:w-full">
                                            <span>0</span>
                                            <span>100</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="tw:block tw:text-white tw:text-lg tw:mb-8">Espaciado entre líneas</label>
                                        <LineSpacingSlider aria-label="ios slider" defaultValue={1.5} min={1.0} max={2.0} step={0.1} valueLabelDisplay="on" />
                                        <div className="tw:flex tw:justify-between tw:text-sm tw:text-gray-400 tw:mt-1">
                                            <span>1.0</span>
                                            <span>2.0</span>
                                        </div>
                                    </div>
                                    <div className="tw:flex tw:items-center tw:justify-between">
                                        <span className="tw:text-white tw:text-lg">Tema</span>
                                        <div className="tw:flex tw:space-x-2">
                                            <ToggleButtonGroup
                                                color="primary"
                                                value={theme}
                                                exclusive
                                                onChange={handleChangeTheme}
                                                aria-label="text alignment"
                                                sx={{
                                                    backgroundColor: '#111111', // fondo oscuro consistente
                                                    borderRadius: '8px',
                                                    padding: '4px',
                                                    gap: '4px',
                                                    '& .MuiToggleButtonGroup-grouped': {
                                                        border: 'none',
                                                        color: 'white',
                                                        borderRadius: '6px',
                                                        textTransform: 'none',
                                                        fontWeight: '500',
                                                        transition: 'all 0.2s ease',
                                                        '&.Mui-selected': {
                                                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                                            color: 'white',
                                                        },
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                        },
                                                    },
                                                }}
                                            >
                                                <ToggleButton value="light">Claro</ToggleButton>
                                                <ToggleButton value="dark">Oscuro</ToggleButton>
                                            </ToggleButtonGroup>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección Información */}
                    <div className="tw:w-full">
                        <div onClick={() => handleSectionClick('informacion')}
                            className="tw:flex tw:items-center tw:justify-between tw:w-full tw:rounded-b-lg tw:relative tw:cursor-pointer">
                            <div className={`tw:absolute tw:w-full tw:h-full tw:bg-white tw:hover:opacity-7 tw:transition tw:duration-200 tw:opacity-5 tw:z-0 ${activeSection === 'informacion' ? '' : 'tw:rounded-b-lg'}`}></div>
                            <h2 className="tw:text-xl tw:font-bold tw:z-10 tw:px-8 tw:py-6 tw:text-white">Información</h2>
                            <ArrowForwardIosIcon
                                sx={{
                                    fontSize: '1.5rem',
                                    marginRight: '1.5rem',
                                    color: 'white',
                                    transform: activeSection === 'informacion' ? 'rotate(90deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s ease'
                                }}
                            />
                        </div>

                        <div className={`tw:w-full tw:rounded-b-lg tw:transition-all tw:duration-300 tw:ease-in-out tw:overflow-hidden ${activeSection === 'informacion' ? 'tw:max-h-[800px] tw:opacity-100' : 'tw:max-h-0 tw:opacity-0'
                            }`}>
                            <div className="tw:relative">
                                {/* Mantengo el fondo original pero con pointer-events: none para que no bloquee los clics */}
                                <div className="tw:absolute tw:w-full tw:h-full tw:bg-white tw:opacity-3 tw:z-0 tw:pointer-events-none"></div>
                                <div className="tw:space-y-4 tw:p-6">
                                    <div className="tw:border-b tw:border-gray-700 tw:pb-4">
                                        <h3 className="tw:text-white tw:text-lg tw:font-semibold tw:mb-2">Versión de la aplicación</h3>
                                        <p className="tw:text-gray-400">v2.1.0</p>
                                    </div>
                                    <div className="tw:border-b tw:border-gray-700 tw:pb-4">
                                        <h3 className="tw:text-white tw:text-lg tw:font-semibold tw:mb-2">Libros descargados</h3>
                                        <p className="tw:text-gray-400">127 libros (2.3 GB)</p>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            sx={{
                                                mt: 2,
                                                textTransform: 'none',
                                                fontWeight: '500',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    backgroundColor: 'error',
                                                    opacity: 0.8,
                                                },
                                            }}
                                        >
                                            Limpiar caché
                                        </Button>
                                    </div>
                                    <div className="tw:border-b tw:border-gray-700 tw:pb-4">
                                        <h3 className="tw:text-white tw:text-lg tw:font-semibold tw:mb-2">Soporte</h3>
                                        {/* CAMBIO PRINCIPAL: Se mejoró el contenedor de enlaces y se añadieron estilos específicos */}
                                        <div className="tw:flex tw:flex-col tw:gap-2 tw:relative tw:z-10">
                                            <Link
                                                href="/help"
                                                className="tw:text-gray-400 hover:tw:text-white tw:cursor-pointer tw:transition-colors tw:duration-200 tw:block tw:py-1 tw:pointer-events-auto"
                                                style={{ pointerEvents: 'auto' }}
                                            >
                                                Centro de ayuda
                                            </Link>
                                            <Link
                                                href="/report"
                                                className="tw:text-gray-400 hover:tw:text-white tw:cursor-pointer tw:transition-colors tw:duration-200 tw:block tw:py-1 tw:pointer-events-auto"
                                                style={{ pointerEvents: 'auto' }}
                                            >
                                                Reportar un problema
                                            </Link>
                                            <Link
                                                href="/terms"
                                                className="tw:text-gray-400 hover:tw:text-white tw:cursor-pointer tw:transition-colors tw:duration-200 tw:block tw:py-1 tw:pointer-events-auto"
                                                style={{ pointerEvents: 'auto' }}
                                            >
                                                Términos de servicio
                                            </Link>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="tw:text-white tw:text-lg tw:font-semibold tw:mb-2">Cuenta</h3>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            sx={{
                                                mt: 2,
                                                textTransform: 'none',
                                                fontWeight: '500',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    backgroundColor: 'error',
                                                    opacity: 0.8,
                                                },
                                            }}
                                        >
                                            Cerrar sesión
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}