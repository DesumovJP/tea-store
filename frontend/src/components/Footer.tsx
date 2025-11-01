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
                    © 2025
                    <Box component="span" style={{ display: 'inline-flex', alignItems: 'center', color: '#1a1a1a' }}>
                        <Box component="svg" width={16} height={16} viewBox="0 0 64 64" fill="none">
                            <g fill="currentColor">
                                <path d="M10 24c0-1.657 1.343-3 3-3h28c1.657 0 3 1.343 3 3v8c0 7.732-6.268 14-14 14h-6C16.268 46 10 39.732 10 32v-8z"/>
                                <path d="M44 26h4a6 6 0 0 1 0 12h-2.5a2 2 0 1 1 0-4H48a2 2 0 0 0 0-4h-4v-4z"/>
                                <path d="M12 50h40a2 2 0 1 1 0 4H12a2 2 0 1 1 0-4z"/>
                                <path d="M24 10c1 2-2 4-2 6s3 4 2 6c-1-2-4-4-4-6s3-4 4-6zm10 0c1 2-2 4-2 6s3 4 2 6c-1-2-4-4-4-6s3-4 4-6z"/>
                            </g>
                        </Box>
                    </Box>
                    guru tea by <a href="https://t.me/desumov" target="_blank" rel="noopener noreferrer" className="footer-link">desumov</a>
                </Typography>
            </Box>
        </Box>
    );
}
