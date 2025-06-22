'use client';

import Link from "next/link";
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Image from 'next/image';

export default function NavBar() {
    return (
        <div className="tw:z-50 tw:fixed tw:w-full tw:h-20 tw:flex tw:justify-between tw:items-center tw:py-4">
            <div className="tw:absolute tw:z-10 tw:bg-black tw:opacity-50 tw:w-full tw:h-full"></div>
            <div className="tw:px-16 tw:flex tw:justify-between tw:items-center tw:w-full">
                <div className="tw:z-50">
                    <Image
                        src="/images/BookNetLogo.png"
                        width={150}
                        height={100}
                        alt="logo"
                        className="tw:rounded-full"
                    />
                </div>
                <div className="tw:flex tw:text-xl tw:font-bold tw:gap-10 tw:z-50">
                    <Link href="/">Inicio</Link>
                    <Link href="/">Series</Link>
                    <Link href="/">Libros</Link>
                    <Link href="/">Niños y Familia</Link>
                </div>
                <div className="tw:flex tw:items-center tw:gap-4 tw:z-50">
                    <IconButton sx={{ color: 'white' }}>
                        <SearchIcon />
                    </IconButton>
                    <Image
                        src="/images/perfil.jpeg"
                        width={50}
                        height={50}
                        alt="perfil"
                        className="tw:rounded-full"
                    />
                </div>
            </div>
        </div>
    );
}