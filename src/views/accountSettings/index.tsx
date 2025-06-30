'use client';

import NavBar from "../home/navbar";
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from "@mui/material";

export default function AccountSettings() {
    const handleEditClick = () => {
        console.log('Editando correo electrónico...');
        // Aquí puedes agregar la lógica para editar
    };

    return (
        <div>
            <NavBar />
            <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:min-h-screen tw:w-full tw:py-8">
                <div className="tw:flex tw:flex-col tw:items-center tw:w-[900px] tw:max-w-[90%]">
                    <h1 className="tw:text-5xl tw:font-bold tw:mb-16 tw:text-white">Cuenta</h1>

                    <div className="tw:flex tw:flex-col tw:w-full tw:rounded-t-lg tw:relative tw:border-b-[0.5px] tw:border-[#e0e0e098] tw:cursor-pointer tw:group">
                        <div className="tw:absolute tw:w-full tw:h-full tw:bg-white tw:group-hover:opacity-7 tw:transition tw:duration-200 tw:opacity-5 tw:z-0 tw:rounded-t-lg tw:pointer-events-none"></div>
                        <div className="tw:flex tw:items-center tw:justify-between tw:w-full tw:pl-8 tw:pr-6">
                            <div className="tw:z-10 tw:pt-6 tw:flex tw:items-center">
                                <h2 className="tw:text-xl tw:font-bold tw:text-white">Correo Electrónico</h2>
                            </div>
                            <div className="tw:pt-6">
                                <IconButton
                                    onClick={handleEditClick}
                                    sx={{
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                        }
                                    }}
                                >
                                    <EditIcon sx={{ fontSize: '1.5rem', color: 'white' }} />
                                </IconButton>
                            </div>
                        </div>
                        <p className="tw:text-xl tw:font-normal tw:z-10 tw:px-8 tw:pb-6 tw:text-white tw:relative">user@gmail.com</p>
                    </div>

                    <div className="tw:flex tw:flex-col tw:w-full tw:rounded-t-lg tw:relative tw:border-b-[0.5px] tw:border-[#e0e0e098] tw:cursor-pointer tw:group">
                        <div className="tw:absolute tw:w-full tw:h-full tw:bg-white tw:group-hover:opacity-7 tw:transition tw:duration-200 tw:opacity-5 tw:z-0 tw:pointer-events-none"></div>
                        <div className="tw:flex tw:items-center tw:justify-between tw:w-full tw:pl-8 tw:pr-6">
                            <div className="tw:z-10 tw:pt-6 tw:flex tw:items-center">
                                <h2 className="tw:text-xl tw:font-bold tw:text-white">Contraseña</h2>
                            </div>
                            <div className="tw:pt-6">
                                <IconButton
                                    onClick={handleEditClick}
                                    sx={{
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                        }
                                    }}
                                >
                                    <EditIcon sx={{ fontSize: '1.5rem', color: 'white' }} />
                                </IconButton>
                            </div>
                        </div>
                        <p className="tw:text-xl tw:font-normal tw:z-10 tw:px-8 tw:pb-6 tw:text-white tw:relative">********</p>
                    </div>

                    <div className="tw:flex tw:flex-col tw:w-full tw:rounded-t-lg tw:relative tw:cursor-pointer tw:group">
                        <div className="tw:absolute tw:w-full tw:h-full tw:bg-white tw:group-hover:opacity-7 tw:transition tw:duration-200 tw:opacity-5 tw:z-0 tw:rounded-b-lg tw:pointer-events-none"></div>
                        <div className="tw:flex tw:items-center tw:justify-between tw:w-full tw:pl-8 tw:pr-6">
                            <div className="tw:z-10 tw:pt-6 tw:flex tw:items-center">
                                <h2 className="tw:text-xl tw:font-bold tw:text-white">Nombre del usuario</h2>
                            </div>
                            <div className="tw:pt-6">
                                <IconButton
                                    onClick={handleEditClick}
                                    sx={{
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                        }
                                    }}
                                >
                                    <EditIcon sx={{ fontSize: '1.5rem', color: 'white' }} />
                                </IconButton>
                            </div>
                        </div>
                        <p className="tw:text-xl tw:font-normal tw:z-10 tw:px-8 tw:pb-6 tw:text-white tw:relative">User</p>
                    </div>
                </div>
            </div>
        </div>
    );
}