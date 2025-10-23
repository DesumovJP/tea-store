"use client";

import { Box, Button, ButtonProps } from "@mui/material";
import { forwardRef } from "react";
import { alpha, useTheme } from "@mui/material/styles";

interface FilterButtonProps extends Omit<ButtonProps, 'variant'> {
    isActive?: boolean;
    children: React.ReactNode;
    categoryName?: string;
    imageUrl?: string;
    imageAlt?: string;
}

// Функція для отримання кольорів категорій (пастельні тони)
const getCategoryColors = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    
    if (name.includes('black')) {
        return {
            bg: '#fce4ec', // bright pink background
            hover: '#f8bbd9', // medium pink for hover
            text: '#c2185b' // deep pink text
        };
    }
    if (name.includes('green')) {
        return {
            bg: '#e8f5e8',
            hover: '#c8e6c9',
            text: '#2e7d32'
        };
    }
    if (name.includes('oolong')) {
        return {
            bg: '#fff8e1',
            hover: '#ffecb3',
            text: '#f57c00'
        };
    }
    if (name.includes('white')) {
        return {
            bg: '#f3e5f5',
            hover: '#e1bee7',
            text: '#7b1fa2'
        };
    }
    if (name.includes('pu-erh') || name.includes('pu erh')) {
        return {
            bg: '#e0f2f1',
            hover: '#b2dfdb',
            text: '#00695c'
        };
    }
    if (name.includes('bo hai')) {
        return {
            bg: '#e3f2fd',
            hover: '#bbdefb',
            text: '#1565c0'
        };
    }
    // Дефолтний колір для інших категорій
    return {
        bg: '#f1f8e9',
        hover: '#dcedc8',
        text: '#558b2f'
    };
};

export const FilterButton = forwardRef<HTMLButtonElement, FilterButtonProps>(
    ({ isActive = false, children, categoryName, imageUrl, imageAlt, sx, ...props }, ref) => {
        const colors = categoryName ? getCategoryColors(categoryName) : null;
        const theme = useTheme();
        
        return (
            <Button
                ref={ref}
                variant="outlined"
                {...props}
                className="filter-button"
                sx={{
                    width: '100%',
                    height: { xs: 56, md: 56 },
                    minHeight: { xs: 56, md: 56 },
                    maxHeight: { xs: 56, md: 56 },
                    color: isActive ? '#ffffff' : '#1a1a1a',
                    bgcolor: isActive ? '#1a1a1a' : '#ffffff',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 300,
                    py: 0,
                    px: 0,
                    justifyContent: 'flex-start',
                    alignItems: 'stretch',
                    borderColor: isActive ? '#66bb6a' : '#2c2c2c',
                    border: '2px solid',
                    borderRadius: 0,
                    boxShadow: isActive ? '3px 3px 0px #66bb6a' : '2px 2px 0px #2c2c2c',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                    letterSpacing: '-0.02em',
                    textTransform: 'lowercase',
                    '&:hover': {
                        transform: 'translateY(-1px) translateX(-1px)',
                        boxShadow: isActive ? '4px 4px 0px #66bb6a' : '3px 3px 0px #2c2c2c',
                        borderColor: '#66bb6a',
                        bgcolor: isActive ? '#66bb6a' : '#f8f9fa',
                        color: isActive ? '#ffffff' : '#1a1a1a',
                    },
                    '&:active': {
                        transform: 'translateY(0) translateX(0)',
                        boxShadow: isActive ? '3px 3px 0px #66bb6a' : '2px 2px 0px #2c2c2c',
                    },
                    ...sx,
                }}
            >
                {/* Text content - 70% width */}
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    width: '70%',
                    minWidth: '70%',
                    maxWidth: '70%',
                    flexShrink: 0,
                    flexGrow: 0,
                    flexBasis: '70%',
                    py: '0.75rem',
                    px: '1rem'
                }}>
                    <span style={{
                        display: 'inline-block',
                        textAlign: 'left',
                        fontWeight: 300,
                        fontSize: '0.875rem',
                        textTransform: 'lowercase',
                        letterSpacing: '-0.02em',
                        fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                    }}>
                        {children}
                    </span>
                </Box>
                
                {/* Image on the right - 30% width, fixed height */}
                {imageUrl && (
                    <Box sx={{ 
                        width: '30%',
                        minWidth: '30%',
                        maxWidth: '30%',
                        height: '100%',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                        flexShrink: 0,
                        flexGrow: 0,
                        flexBasis: '30%'
                    }}>
                        <Box 
                            component="img" 
                            src={imageUrl} 
                            alt={imageAlt || String(categoryName || 'Category')} 
                            loading="lazy" 
                            decoding="async" 
                            sx={{ 
                                width: '100%',
                                height: '100%',
                                maxHeight: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center',
                                display: 'block',
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                                flexShrink: 0
                            }} 
                        />
                    </Box>
                )}
            </Button>
        );
    }
);

FilterButton.displayName = 'FilterButton';
