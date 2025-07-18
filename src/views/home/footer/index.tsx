import YouTubeIcon from '@mui/icons-material/YouTube';
import { IconButton } from '@mui/material';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="tw:flex tw:justify-between tw:items-center tw:px-16 tw:mb-2">
        <div className='tw:flex tw:items-center tw:justify-center'>
          <IconButton>
            <YouTubeIcon sx={{ color: 'white' }}/>
          </IconButton>
          <IconButton>
            <XIcon sx={{ color: 'white', fontSize: 'medium' }}/>
          </IconButton>
          <IconButton>
            <FacebookIcon sx={{ color: 'white' }}/>
          </IconButton>
          <IconButton>
            <InstagramIcon sx={{ color: 'white' }}/>
          </IconButton>
        </div>
        <div className='tw:flex tw:items-center tw:justify-center tw:gap-4'>
          <Link href="/">Accesibilidad</Link>
          <Link href="/">Política de privacidad</Link>
          <Link href="/">Términos y condiciones</Link>
          <Link href="/">Información</Link>
          <Link href="/">Ayuda</Link>
        </div>
      </div>
      <div className="tw:pl-16">
        <p>© 2025 Yisus Lab. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}