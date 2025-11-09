"use client";

import { Box, Typography } from "@mui/material";

export default function Footer() {
    return (
        <Box className="footer">
            <Box className="footer-container">
                <Typography 
                    variant="body2" 
                    className="footer-text"
                >
                    ©GuruTea by Webbie
                </Typography>
            </Box>
        </Box>
    );
}
