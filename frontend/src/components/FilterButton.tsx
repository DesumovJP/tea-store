"use client";

import { Box, Button, ButtonProps } from "@mui/material";
import { forwardRef } from "react";

interface FilterButtonProps extends Omit<ButtonProps, 'variant'> {
    isActive?: boolean;
    children: React.ReactNode;
    categoryName?: string;
    imageUrl?: string;
    imageAlt?: string;
}

// Reserved for future per-category palette if needed

export const FilterButton = forwardRef<HTMLButtonElement, FilterButtonProps>(
    ({ isActive = false, children, categoryName, imageUrl, imageAlt, sx, ...props }, ref) => {
        const classNames = ["btn", "btn--light", "btn--sm", "filter-button", isActive ? "filter-button--active" : ""].filter(Boolean).join(" ");

        return (
            <Button
                ref={ref}
                
                {...props}
                className={classNames}
            >
                {/* Text content - 70% width */}
                <Box className="filter-button-text-container">
                    <span className="filter-button-text">
                        {children}
                    </span>
                </Box>
                
                {/* Image on the right - 30% width, fixed height */}
                {imageUrl && (
                    <Box className="filter-button-image-container">
                        <Box 
                            component="img" 
                            src={imageUrl} 
                            alt={imageAlt || String(categoryName || 'Category')} 
                            loading="lazy" 
                            decoding="async" 
                            className="filter-button-image"
                        />
                    </Box>
                )}
            </Button>
        );
    }
);

FilterButton.displayName = 'FilterButton';
