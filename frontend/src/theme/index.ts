"use client";

import { createTheme } from '@mui/material/styles';

// Custom color palette - single source of truth for all colors
const colors = {
  primary: {
    main: '#2c2c2c',
    light: '#4a4a4a',
    dark: '#1a1a1a',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#ffffff',
    light: '#f5f9f5',
    dark: '#f0f0f0',
    contrastText: '#2c2c2c',
  },
  text: {
    primary: '#2c2c2c',
    secondary: '#4a4a4a',
    disabled: '#999999',
    dark: '#1a1a1a',
    gray: '#666666',
  },
  background: {
    default: '#ffffff',
    paper: '#ffffff',
    light: '#f8f8f8',
    lighter: '#f8f9fa',
    green: '#f8fff8',
  },
  border: {
    main: '#2c2c2c',
    light: '#e0e0e0',
  },
  brand: {
    green: '#66bb6a',
    greenLight: '#4caf50',
    greenDark: '#2e7d32',
  },
  error: {
    main: '#f44336',
  },
};

// Base font family (single source of truth)
export const baseFontFamily = 'var(--app-font, "Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif)';
export const headingFontFamily = 'var(--heading-font, "Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif)';

// Common spacing values
const spacing = {
  pagePadding: { xs: '1rem', md: '10%', lg: '15%' },
};

// Common letter spacing
const letterSpacing = {
  tight: '-0.02em',
  normal: '-0.01em',
};

// Custom typography (no forced lowercase)
const typography = {
  fontFamily: baseFontFamily,
  h1: {
    fontFamily: headingFontFamily,
    fontWeight: 700,
    color: colors.text.dark,
    letterSpacing: '-0.02em',
    textTransform: 'none' as const,
    lineHeight: 1.2,
  },
  h2: {
    fontFamily: headingFontFamily,
    fontWeight: 700,
    color: colors.text.dark,
    letterSpacing: '-0.02em',
    textTransform: 'none' as const,
    lineHeight: 1.2,
  },
  h3: {
    fontFamily: headingFontFamily,
    fontWeight: 600,
    color: colors.text.dark,
    letterSpacing: '-0.01em',
    textTransform: 'none' as const,
    lineHeight: 1.3,
  },
  h4: {
    fontFamily: headingFontFamily,
    fontWeight: 600,
    color: colors.text.dark,
    letterSpacing: '-0.01em',
    textTransform: 'none' as const,
    lineHeight: 1.3,
  },
  h5: {
    fontFamily: headingFontFamily,
    fontWeight: 600,
    color: colors.text.dark,
    letterSpacing: '-0.01em',
    textTransform: 'none' as const,
    lineHeight: 1.4,
  },
  h6: {
    fontFamily: headingFontFamily,
    fontWeight: 600,
    color: colors.text.dark,
    letterSpacing: '-0.01em',
    textTransform: 'none' as const,
    lineHeight: 1.4,
  },
  body1: {
    fontFamily: baseFontFamily,
    fontWeight: 300,
    color: colors.text.dark,
    letterSpacing: letterSpacing.tight,
    textTransform: 'none' as const,
    lineHeight: 1.7,
  },
  body2: {
    fontFamily: baseFontFamily,
    fontWeight: 300,
    color: colors.text.secondary,
    letterSpacing: letterSpacing.normal,
    textTransform: 'none' as const,
    lineHeight: 1.5,
  },
  button: {
    fontFamily: baseFontFamily,
    fontWeight: 300,
    textTransform: 'none' as const,
    letterSpacing: letterSpacing.tight,
  },
};

// Extend MUI theme to include custom colors
declare module '@mui/material/styles' {
  interface Palette {
    border: {
      main: string;
      light: string;
    };
    brand: {
      green: string;
      greenLight: string;
      greenDark: string;
    };
  }
  interface PaletteOptions {
    border?: {
      main?: string;
      light?: string;
    };
    brand?: {
      green?: string;
      greenLight?: string;
      greenDark?: string;
    };
  }
}

// Create the theme
export const theme = createTheme({
  palette: {
    primary: colors.primary,
    secondary: colors.secondary,
    text: colors.text,
    background: colors.background,
    divider: colors.border.light,
    error: colors.error,
    border: colors.border,
    brand: colors.brand,
  },
  typography,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--cat-black': '#efebe9',
          '--cat-green': '#c8e6c9',
          '--cat-white': '#f5f9f5',
          '--cat-oolong': '#f3e5ab',
          '--cat-puerh': '#d7ccc8',
          '--cat-herbal': '#d7e8c8',
        },
      },
    },
    // Button component overrides - hipster style
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          fontFamily: typography.fontFamily,
          fontWeight: 300,
          textTransform: 'none',
          letterSpacing: letterSpacing.tight,
          transition: 'all 0.3s ease',
        },
        outlined: {
          borderColor: colors.border.main,
          borderWidth: '2px',
          color: colors.text.dark,
          '&:hover': {
            backgroundColor: colors.brand.green,
            color: colors.primary.contrastText,
            borderColor: colors.brand.green,
            transform: 'translateY(-1px) translateX(-1px)',
          },
        },
        contained: {
          backgroundColor: colors.primary.dark,
          color: colors.primary.contrastText,
          border: `2px solid ${colors.border.main}`,
          boxShadow: '3px 3px 0px #66bb6a',
          '&:hover': {
            backgroundColor: colors.brand.green,
            transform: 'translateY(-1px) translateX(-1px)',
            boxShadow: '4px 4px 0px #1a1a1a',
            borderColor: colors.brand.green,
          },
        },
        text: {
          color: colors.text.dark,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            opacity: 0.7,
          },
        },
      },
    },
    // OutlinedInput component overrides - hipster catalog style
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          fontFamily: typography.fontFamily,
          letterSpacing: letterSpacing.tight,
          textTransform: 'none',
          fontWeight: 300,
          '& .MuiOutlinedInput-input': {
            py: '0.9375rem',
            fontFamily: typography.fontFamily,
            letterSpacing: letterSpacing.tight,
            textTransform: 'none',
            fontWeight: 300,
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: '1px solid #e0e0e0',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3b4d3c',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3b4d3c',
            boxShadow: '0 0 0 2px rgba(59,77,60,0.12)',
          },
        },
      },
      variants: [],
    },
    // Select component overrides
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          fontFamily: typography.fontFamily,
          letterSpacing: letterSpacing.tight,
          textTransform: 'none',
          fontWeight: 300,
          border: '2px solid #2c2c2c',
          '& .MuiSelect-select': {
            textTransform: 'none',
            fontWeight: 300,
            py: '0.9375rem',
            px: '1.25rem',
            fontFamily: typography.fontFamily,
            letterSpacing: letterSpacing.tight,
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
            borderColor: 'transparent',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            border: 'none',
            borderColor: 'transparent',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 'none',
            borderColor: 'transparent',
          },
          '&.Mui-focused': {
            border: '2px solid #66bb6a',
            boxShadow: '2px 2px 0px #2c2c2c',
          },
          '&:hover': {
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease-in-out',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
      },
    },
    // MenuItem component overrides
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: typography.fontFamily,
          letterSpacing: letterSpacing.tight,
          textTransform: 'none',
          fontWeight: 300,
        },
      },
    },
    // TextField component overrides
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            fontFamily: typography.fontFamily,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e0e0e0',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#3b4d3c',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#3b4d3c',
              boxShadow: '0 0 0 2px rgba(59,77,60,0.12)',
            },
          },
        },
      },
    },
    // Card component overrides
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.paper,
          borderRadius: 0,
          border: '1px solid #e0e0e0',
          boxShadow: '0 0.125rem 0.5rem rgba(0, 0, 0, 0.08)',
        },
      },
    },
    // AppBar component overrides
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.light,
          boxShadow: 'none',
          transition: 'background-color 0.3s ease',
        },
      },
    },
    // IconButton component overrides
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: colors.text.dark,
          '&:hover': {
            opacity: 0.7,
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    // Typography component overrides - ensure hipster style
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.hipster-heading': {
            fontFamily: typography.fontFamily,
            letterSpacing: letterSpacing.tight,
            textTransform: 'none',
            fontWeight: 300,
          },
        },
      },
    },
    // Modal component overrides
    // IMPORTANT: Do not force alignment/position here, it breaks Drawer anchor
    MuiModal: {
      styleOverrides: {
        root: {
          maxWidth: '100vw',
          maxHeight: '100vh',
        },
      },
    },
    // FormControl component overrides
    MuiFormControl: {
      styleOverrides: {
        root: {
          width: '100%',
        },
      },
    },
    // Container component overrides
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: '100vw',
          overflow: 'hidden',
        },
      },
    },
  },
});

// Export colors for direct use if needed
export { colors };
