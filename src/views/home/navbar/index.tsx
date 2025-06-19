'use client';

import Link from "next/link";
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Image from 'next/image';

export default function NavBar() {
    return (
        <div className="tw:h-20 tw:flex tw:justify-between tw:items-center tw:py-4 tw:px-16">
            <div>
                <Image 
                    src="/images/BookNetLogo.png"
                    width={150} 
                    height={100}
                    alt="logo" 
                    className="tw:rounded-full"
                />
            </div>
            <div className="tw:flex tw:gap-8">
                <Link href="/">Inicio</Link>
                <Link href="/">Series</Link>
                <Link href="/">Libros</Link>
                <Link href="/">Niños y Familia</Link>
            </div>
            <div className="tw:flex tw:items-center tw:gap-4">
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
    );
}