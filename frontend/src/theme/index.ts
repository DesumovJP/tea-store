"use client";

import { createTheme } from '@mui/material/styles';

// Custom color palette
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
  },
  background: {
    default: '#ffffff',
    paper: '#ffffff',
  },
  border: {
    main: '#2c2c2c',
    light: '#e0e0e0',
  },
};

// Base font family (single source of truth)
export const baseFontFamily = 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif';

// Custom typography
const typography = {
  fontFamily: baseFontFamily,
  h1: {
    fontFamily: baseFontFamily,
    fontWeight: 400,
    color: colors.text.primary,
  },
  h2: {
    fontFamily: baseFontFamily,
    fontWeight: 400,
    color: colors.text.primary,
  },
  h3: {
    fontFamily: baseFontFamily,
    fontWeight: 500,
    color: colors.text.primary,
  },
  h4: {
    fontFamily: baseFontFamily,
    fontWeight: 500,
    color: colors.text.primary,
  },
  h5: {
    fontFamily: baseFontFamily,
    fontWeight: 500,
    color: colors.text.primary,
  },
  h6: {
    fontFamily: baseFontFamily,
    fontWeight: 500,
    color: colors.text.primary,
  },
  body1: {
    fontFamily: baseFontFamily,
    fontWeight: 400,
    color: colors.text.primary,
  },
  body2: {
    fontFamily: baseFontFamily,
    fontWeight: 400,
    color: colors.text.secondary,
  },
  button: {
    fontFamily: baseFontFamily,
    fontWeight: 500,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.03125rem',
  },
};

// Create the theme
export const theme = createTheme({
  palette: {
    primary: colors.primary,
    secondary: colors.secondary,
    text: colors.text,
    background: colors.background,
    divider: colors.border.light,
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
    // Button component overrides
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.125rem',
          fontFamily: typography.fontFamily,
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.03125rem',
        },
        outlined: {
          borderColor: colors.border.main,
          color: colors.text.primary,
          '&:hover': {
            backgroundColor: colors.primary.main,
            color: colors.primary.contrastText,
            borderColor: colors.primary.main,
          },
        },
        contained: {
          backgroundColor: colors.primary.main,
          color: colors.primary.contrastText,
          '&:hover': {
            backgroundColor: colors.primary.dark,
          },
        },
      },
    },
    // OutlinedInput component overrides
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '0.125rem',
          fontFamily: typography.fontFamily,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.border.main,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.border.main,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.border.main,
          },
        },
      },
    },
    // Select component overrides
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: '0.125rem',
          fontFamily: typography.fontFamily,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.border.main,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.border.main,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.border.main,
          },
        },
      },
    },
    // TextField component overrides
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '0.125rem',
            fontFamily: typography.fontFamily,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.border.main,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.border.main,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.border.main,
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
          borderRadius: '0.125rem',
        },
      },
    },
  },
});

// Export colors for direct use if needed
export { colors };
