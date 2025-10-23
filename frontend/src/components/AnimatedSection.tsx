"use client";

import { Box, Fade, Slide } from "@mui/material";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface AnimatedSectionProps {
    children: React.ReactNode;
    direction?: 'up' | 'down' | 'left' | 'right';
    delay?: number;
    threshold?: number;
}

export default function AnimatedSection({ 
    children, 
    direction = 'up', 
    delay = 0,
    threshold = 0.1 
}: AnimatedSectionProps) {
    const { ref, isVisible } = useScrollAnimation(threshold);

    return (
        <Box ref={ref}>
            <Fade in={isVisible} timeout={800 + delay}>
                <Slide 
                    direction={direction} 
                    in={isVisible} 
                    timeout={600 + delay}
                    easing="cubic-bezier(0.4, 0, 0.2, 1)"
                >
                    <Box>
                        {children}
                    </Box>
                </Slide>
            </Fade>
        </Box>
    );
}
