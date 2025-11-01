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
                className="btn btn--light"
            >
                to the top
            </Button>
        </Box>
    );
}
