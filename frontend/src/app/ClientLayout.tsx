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
            <Box className="client-layout-root">
                <Navbar />
                <Box component="main" className="client-layout-main">
                    {children}
                </Box>
                <LazyPromoStrip isCartPage={isCartPage} />
                <LazyFooter />
            </Box>
            <FeedbackChat />
        </ThemeProvider>
    );
}

