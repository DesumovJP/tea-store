"use client";

import { Button, Typography, Box } from "@mui/material";
import CartIcon from "@/components/icons/CartIcon";
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
        <Button onClick={handleAddToCart} className="btn btn--outline btn--sm">
            <Typography style={{ color: 'inherit', fontSize: '0.75rem', fontWeight: 600 }}>
                +
            </Typography>
            <CartIcon size={20} />
        </Button>
    );
}
