import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#7c3aed',
            light: '#a78bfa',
            dark: '#5b21b6',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#06b6d4',
            light: '#22d3ee',
            dark: '#0891b2',
            contrastText: '#ffffff',
        },
        background: {
            default: '#fafafe',
            paper: '#ffffff',
        },
        text: {
            primary: '#1e1b4b',
            secondary: '#6366f1',
        },
        success: {
            main: '#22c55e',
            light: '#4ade80',
            dark: '#16a34a',
        },
        warning: {
            main: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
        },
        error: {
            main: '#ef4444',
            light: '#f87171',
            dark: '#dc2626',
        },
        grey: {
            50: '#fafafc',
            100: '#f3f4f8',
            200: '#e4e6ef',
            300: '#c8ccd8',
            400: '#9ca3b8',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
        },
    },
    typography: {
        fontFamily: '"Outfit", "Inter", "Roboto", sans-serif',
        h1: {
            fontWeight: 800,
            fontSize: '3.5rem',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontWeight: 700,
            fontSize: '2.5rem',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
        },
        h3: {
            fontWeight: 700,
            fontSize: '1.75rem',
            lineHeight: 1.3,
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
            lineHeight: 1.35,
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
            lineHeight: 1.4,
        },
        h6: {
            fontWeight: 600,
            fontSize: '1.1rem',
            lineHeight: 1.5,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.7,
        },
        body2: {
            fontSize: '0.9rem',
            lineHeight: 1.6,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
            letterSpacing: '0.01em',
        },
    },
    shape: {
        borderRadius: 16,
    },
    shadows: [
        'none',
        '0 1px 3px rgba(124, 58, 237, 0.08)',
        '0 4px 6px rgba(124, 58, 237, 0.1)',
        '0 6px 16px rgba(124, 58, 237, 0.12)',
        '0 10px 24px rgba(124, 58, 237, 0.15)',
        '0 16px 32px rgba(124, 58, 237, 0.18)',
        '0 20px 40px rgba(124, 58, 237, 0.22)',
        '0 24px 48px rgba(124, 58, 237, 0.25)',
        '0 28px 56px rgba(124, 58, 237, 0.28)',
        ...Array(16).fill('0 32px 64px rgba(124, 58, 237, 0.3)'),
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 14,
                    padding: '12px 28px',
                    fontSize: '1rem',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                },
                contained: {
                    background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #06b6d4 100%)',
                    boxShadow: '0 8px 24px rgba(124, 58, 237, 0.35)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #6d28d9 0%, #9333ea 50%, #0891b2 100%)',
                        boxShadow: '0 12px 32px rgba(124, 58, 237, 0.45)',
                        transform: 'translateY(-2px)',
                    },
                },
                outlined: {
                    borderWidth: 2,
                    '&:hover': {
                        borderWidth: 2,
                        backgroundColor: 'rgba(124, 58, 237, 0.05)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 24,
                    backdropFilter: 'blur(20px)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(124, 58, 237, 0.1)',
                    boxShadow: '0 8px 32px rgba(124, 58, 237, 0.1)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 48px rgba(124, 58, 237, 0.2)',
                        border: '1px solid rgba(124, 58, 237, 0.2)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    backdropFilter: 'blur(16px)',
                    background: 'rgba(255, 255, 255, 0.85)',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        transform: 'scale(1.05)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 14,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.1)',
                        },
                        '&.Mui-focused': {
                            boxShadow: '0 4px 16px rgba(124, 58, 237, 0.2)',
                        },
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backdropFilter: 'blur(24px)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderBottom: '1px solid rgba(124, 58, 237, 0.1)',
                },
            },
        },
    },
});

export default theme;
