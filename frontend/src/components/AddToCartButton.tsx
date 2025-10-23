"use client";

import { Button, Typography, Box } from "@mui/material";
import { useCartStore } from "@/store/cartStore";
import { triggerGlobalCartAnimation } from "@/hooks/useCartAnimation";

interface AddToCartButtonProps {
    product: {
        documentId: string;
        title: string;
        price?: number;
        images?: Array<{ url: string; alternativeText?: string }>;
    };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        addItem({
            id: product.documentId,
            name: product.title,
            price: product.price || 0,
            imageUrl: product.images?.[0]?.url || '',
            quantity: 1
        });
        
        // Запускаємо анімацію кошика
        triggerGlobalCartAnimation();
    };

    return (
        <Button
            onClick={handleAddToCart}
            sx={{
                minWidth: 'auto',
                width: 'auto',
                height: '40px',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                bgcolor: 'transparent',
                color: '#666666',
                borderColor: '#666666',
                border: '1px solid #666666',
                borderRadius: '4px',
                textTransform: 'none',
                fontSize: '12px',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                '&:hover': {
                    bgcolor: '#66bb6a',
                    color: 'white',
                    borderColor: '#66bb6a',
                    transform: 'translateY(-1px)',
                },
                '&:active': {
                    transform: 'translateY(0)',
                }
            }}
        >
            <Typography sx={{ color: 'inherit', fontSize: '12px', fontWeight: 600 }}>
                +
            </Typography>
            <Box component="svg" width={20} height={20} viewBox="0 0 24 24" fill="none" sx={{ color: 'inherit' }}>
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h6m-6 0a2 2 0 100 4 2 2 0 000-4zm6 0a2 2 0 100 4 2 2 0 000-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </Box>
        </Button>
    );
}
