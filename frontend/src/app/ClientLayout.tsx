"use client";

import Navbar from "@/components/Navbar";
import LazyFooter from "@/components/LazyFooter";
import LazyPromoStrip from "@/components/LazyPromoStrip";
import FeedbackChat from "@/components/FeedbackChat";
import ThemeProvider from "@/theme/ThemeProvider";
import Box from "@mui/material/Box";
import { usePathname } from "next/navigation";
import { usePageLoading } from "@/hooks/usePageLoading";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isCartPage = pathname === '/cart';
    
    // Simple page loading state management
    usePageLoading();
    
    return (
        <ThemeProvider>
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                minHeight: '100vh',
                maxWidth: '100vw',
                overflow: 'hidden'
            }}>
                <Navbar />
                <Box component="main" sx={{ 
                    flex: '1 0 auto',
                    pt: { xs: '3.5rem', sm: '4rem' },
                    maxWidth: '100%',
                    overflow: 'hidden'
                }}>
                    {children}
                </Box>
                <LazyPromoStrip isCartPage={isCartPage} />
                <LazyFooter />
            </Box>
            <FeedbackChat />
        </ThemeProvider>
    );
}

