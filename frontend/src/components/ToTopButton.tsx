"use client";

import { Button, Box } from "@mui/material";

export default function ToTopButton() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6, px: { xs: '1rem', md: '2.5rem' } }}>
            <Button
                onClick={scrollToTop}
                sx={{
                    bgcolor: '#f8f9fa',
                    color: '#1a1a1a',
                    borderRadius: 0,
                    border: '2px solid #2c2c2c',
                    boxShadow: '3px 3px 0px #66bb6a',
                    fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                    textTransform: 'uppercase',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    letterSpacing: '0.05em',
                    px: 4,
                    py: 1.5,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        bgcolor: '#66bb6a',
                        color: '#ffffff',
                        transform: 'translateY(-1px) translateX(-1px)',
                        boxShadow: '4px 4px 0px #1a1a1a',
                        borderColor: '#66bb6a',
                    }
                }}
            >
                to the top
            </Button>
        </Box>
    );
}
