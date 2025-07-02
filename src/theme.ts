// src/theme.ts
'use client'; // Necesario si usas `createTheme` en el cliente

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Un azul típico de Material-UI
    },
    secondary: {
      main: '#dc004e', // Un rojo/rosa para el secundario
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif', // Asegúrate de que coincida con tu fuente
  },
  // Puedes añadir más configuraciones aquí (spacing, components, etc.)
});

export default theme;