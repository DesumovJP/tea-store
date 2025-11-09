"use client";

import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Slide from "@mui/material/Slide";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import CardMedia from "@mui/material/CardMedia";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import CartItemCard from "@/components/CartItemCard";

export default function CartDrawer({
                                       open,
                                       onClose,
                                   }: {
    open: boolean;
    onClose: () => void;
}) {
    const { items, removeItem, updateQuantity } = useCartStore();
    
    const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const freeShippingThreshold = 100; // $100 for free shipping
    const progressValue = Math.min((totalPrice / freeShippingThreshold) * 100, 100);

    return (
        <Modal
            open={open}
            onClose={onClose}
            disableScrollLock
            closeAfterTransition
            className="cart-modal"
            BackdropProps={{}}
        >
            <Fade in={open} timeout={300}>
                <Slide direction="left" in={open} timeout={400}>
                    <Box className="cart-panel">
                {/* Header */}
                <Box className="cart-header">
                    <Box className="cart-header-bar">
                        <Typography 
                            variant="h5" 
                            className="hipster-heading cart-title"
                        >
                            shopping cart ({totalItems} items)
                        </Typography>
                        <IconButton onClick={onClose} className="cart-close">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    
                    {/* Free Shipping Progress */}
                    {totalPrice > 0 && (
                        <Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={progressValue} 
                                className="cart-progress"
                            />
                            <Typography variant="body1" className={`cart-progress-text ${totalPrice >= freeShippingThreshold ? 'cart-progress-text--ok' : 'cart-progress-text--more'}`}>
                                {totalPrice >= freeShippingThreshold 
                                    ? "you are eligible for free shipping!" 
                                    : `add $${(freeShippingThreshold - totalPrice).toFixed(2)} more for free shipping`
                                }
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Cart Items */}
                <Box className="cart-body">
                    {items.length === 0 ? (
                        <Typography variant="body1" sx={{ color: '#4a4a4a', fontWeight: 300 }}>your cart is empty</Typography>
                    ) : (
                        <Stack spacing={2} sx={{ pr: 1 }} className="custom-scrollbar">
                            {items.map((item) => (
                                <CartItemCard key={item.id} item={item} onRemove={removeItem} onUpdateQty={updateQuantity} />
                            ))}
                        </Stack>
                    )}
                </Box>

                {/* Footer */}
                {items.length > 0 && (
                    <Box sx={{ 
                        p: 4, 
                        borderTop: '0.0625rem solid', 
                        borderColor: '#e0e0e0',
                        bgcolor: '#ffffff',
                        boxShadow: '0 -0.125rem 0.5rem rgba(0, 0, 0, 0.08)'
                    }}>
                        {/* Subtotal */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h5" sx={{ 
                                fontWeight: 300, 
                                color: '#1a1a1a', 
                                fontSize: '1.5rem',
                                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                letterSpacing: '-0.02em',
                                textTransform: 'lowercase'
                            }}>
                                subtotal:
                            </Typography>
                            <Typography variant="h5" sx={{ 
                                fontWeight: 500, 
                                color: '#1a1a1a', 
                                fontSize: '1.5rem',
                                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                letterSpacing: '-0.02em'
                            }}>
                                ${totalPrice.toFixed(2)}
                            </Typography>
                        </Box>

                        {/* Shipping Info */}
                        <Typography variant="body1" className="cart-item-category" style={{ marginBottom: 8 }}>
                            tax included. shipping calculated at checkout.
                        </Typography>

                        {/* Checkout Button */}
                        <Link href="/cart" className="link-unstyled">
                            <Button 
                                variant="contained" 
                                fullWidth 
                                size="large"
                                onClick={onClose}
                                className="btn btn--dark cart-checkout-button"
                                startIcon={
                                    <Box component="svg" width={20} height={20} viewBox="0 0 24 24" fill="none">
                                        <circle cx="9" cy="21" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <circle cx="20" cy="21" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </Box>
                                }
                            >
                                check out
                            </Button>
                        </Link>
                    </Box>
                )}
                    </Box>
                </Slide>
            </Fade>
        </Modal>
    );
}
