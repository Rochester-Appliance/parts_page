import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // Rochester Appliance blue
            light: '#42a5f5',
            dark: '#1565c0',
        },
        secondary: {
            main: '#f57c00',
            light: '#ffb74d',
            dark: '#ef6c00',
        },
        background: {
            default: '#f5f7fa',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 600,
        },
        h3: {
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                        transform: 'translateY(-2px)',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 8,
                },
            },
        },
    },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </React.StrictMode>
);

// In development, disable strict CSP to allow eval
if (process.env.NODE_ENV === 'development') {
    // Remove any existing CSP meta tags that might be too restrictive
    const cspMetas = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
    cspMetas.forEach(meta => {
        meta.setAttribute('content', "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; style-src * 'unsafe-inline';");
    });
} 