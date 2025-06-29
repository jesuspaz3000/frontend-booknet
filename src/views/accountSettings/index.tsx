'use client';

import NavBar from "../home/navbar";
import EditIcon from '@mui/icons-material/Edit';

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

                    <div className="tw:flex tw:items-center tw:justify-between tw:w-full tw:rounded-t-lg tw:relative tw:border-b-[0.5px] tw:border-[#e0e0e098] tw:cursor-pointer tw:group">
                        <div className="tw:absolute tw:w-full tw:h-full tw:bg-white tw:group-hover:opacity-7 tw:transition tw:duration-200 tw:opacity-5 tw:z-0 tw:rounded-t-lg tw:pointer-events-none"></div>
                        <h2 className="tw:text-xl tw:font-bold tw:z-10 tw:px-8 tw:py-6 tw:text-white tw:relative">Correo Electrónico</h2>
                        <div 
                            onClick={handleEditClick}
                            className="tw:z-10 tw:relative tw:mr-6 tw:p-2 tw:cursor-pointer tw:hover:bg-black tw:hover:opacity-20 tw:rounded-full tw:transition tw:duration-200"
                        >
                            <EditIcon 
                                sx={{ 
                                    fontSize: '1.5rem', 
                                }} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}