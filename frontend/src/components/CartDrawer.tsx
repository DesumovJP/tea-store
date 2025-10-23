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
            sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
                p: 2,
            }}
            BackdropProps={{
                sx: {
                    backdropFilter: 'blur(8px)',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease-in-out',
                }
            }}
        >
            <Fade in={open} timeout={300}>
                <Slide direction="left" in={open} timeout={400}>
                    <Box sx={{ 
                        width: { xs: '100%', sm: '40rem', md: '45rem' },
                        maxWidth: '100%',
                        background: '#ffffff',
                        borderRadius: '0.75rem',
                        boxShadow: '0 0.5rem 2rem rgba(0, 0, 0, 0.15)',
                        maxHeight: '95vh',
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        transform: 'translateX(0)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}>
                {/* Header */}
                <Box sx={{ 
                    p: 4, 
                    borderBottom: '0.0625rem solid', 
                    borderColor: '#e0e0e0',
                    bgcolor: '#ffffff',
                    boxShadow: '0 0.125rem 0.5rem rgba(0, 0, 0, 0.08)'
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography 
                            variant="h4" 
                            className="hipster-heading"
                            sx={{ 
                                fontWeight: 300, 
                                color: '#1a1a1a', 
                                fontSize: { xs: '1.5rem', sm: '1.75rem' },
                                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                letterSpacing: '-0.02em',
                                textTransform: 'lowercase'
                            }}
                        >
                            shopping cart ({totalItems} items)
                        </Typography>
                        <IconButton onClick={onClose} sx={{ color: '#2c2c2c', fontSize: '1.5rem' }}>
                            <CloseIcon sx={{ fontSize: '1.5rem' }} />
                        </IconButton>
                    </Box>
                    
                    {/* Free Shipping Progress */}
                    {totalPrice > 0 && (
                        <Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={progressValue} 
                                sx={{ 
                                    height: 6, 
                                    borderRadius: 3,
                                    backgroundColor: '#e0e0e0',
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: '#4caf50',
                                        borderRadius: 3,
                                    }
                                }} 
                            />
                            <Typography variant="body1" sx={{ 
                                mt: 1.5, 
                                color: totalPrice >= freeShippingThreshold ? '#66bb6a' : '#4a4a4a', 
                                fontSize: '0.875rem', 
                                fontWeight: 300,
                                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                letterSpacing: '-0.02em',
                                textTransform: 'lowercase'
                            }}>
                                {totalPrice >= freeShippingThreshold 
                                    ? "you are eligible for free shipping!" 
                                    : `add $${(freeShippingThreshold - totalPrice).toFixed(2)} more for free shipping`
                                }
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Cart Items */}
                <Box sx={{ flex: 1, overflowY: 'auto', p: 4 }}>
                    {items.length === 0 ? (
                        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Box sx={{ display: 'inline-flex', mb: 1.5, color: 'text.secondary' }}>
                                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 3h1.5l2.4 10.02c.11.47.53.8 1.01.8H17a1 1 0 0 0 .98-.8L19 7H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <circle cx="9" cy="20" r="1" stroke="currentColor" stroke-width="1.5"/>
                                        <circle cx="16" cy="20" r="1" stroke="currentColor" stroke-width="1.5"/>
                                    </svg>
                                </Box>
                                <Typography variant="h5" sx={{ 
                                    mb: 1, 
                                    color: '#4a4a4a', 
                                    fontSize: '1.25rem',
                                    fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                    letterSpacing: '-0.02em',
                                    textTransform: 'lowercase',
                                    fontWeight: 300
                                }}>
                                    your cart is empty
                                </Typography>
                                <Typography variant="body1" sx={{ 
                                    color: '#4a4a4a', 
                                    fontSize: '1rem',
                                    fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                    letterSpacing: '-0.02em',
                                    textTransform: 'lowercase',
                                    fontWeight: 300
                                }}>
                                    add some items to get started
                                </Typography>
                            </Box>
                        </Box>
                    ) : (
                        <Stack spacing={4}>
                            {items.map((item) => (
                                <Box key={item.id} sx={{ 
                                    p: 3,
                                    bgcolor: '#ffffff',
                                    borderRadius: '0.75rem',
                                    border: '1px solid #e0e0e0',
                                    boxShadow: '0 0.125rem 0.5rem rgba(0, 0, 0, 0.08)'
                                }}>
                                    <Grid container spacing={2} alignItems="center">
                                        {/* Product Image - 4 columns (35%) */}
                                        <Grid size={4}>
                                            <Box sx={{ 
                                                width: '100%', 
                                                height: '8rem', 
                                                borderRadius: '0.5rem', 
                                                overflow: "hidden",
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {item.imageUrl ? (
                                                    <CardMedia
                                                        component="img"
                                                        image={item.imageUrl}
                                                        alt={item.name}
                                                        sx={{ 
                                                            width: "100%", 
                                                            height: "100%", 
                                                            objectFit: "contain",
                                                            maxWidth: '100%',
                                                            maxHeight: '100%'
                                                        }}
                                                    />
                                                ) : (
                                                    <Box sx={{ 
                                                        width: "100%", 
                                                        height: "100%", 
                                                        display: "flex", 
                                                        alignItems: "center", 
                                                        justifyContent: "center", 
                                                        color: "text.secondary", 
                                                        fontSize: '0.75rem' 
                                                    }}>
                                                        No Image
                                                    </Box>
                                                )}
                                            </Box>
                                        </Grid>

                                        {/* Product Info - 5 columns (45%) */}
                                        <Grid size={5}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                {/* Product Name */}
                                                <Typography variant="h5" sx={{ 
                                                    fontWeight: 500, 
                                                    color: '#1a1a1a',
                                                    fontSize: '1.25rem',
                                                    lineHeight: 1.2,
                                                    mb: 1,
                                                    fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                    letterSpacing: '-0.02em',
                                                    textTransform: 'lowercase'
                                                }}>
                                                    {item.name}
                                                </Typography>
                                                
                                                {/* Category */}
                                                <Typography variant="body1" sx={{ 
                                                    color: '#4a4a4a',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 300,
                                                    mb: 1.5,
                                                    fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                    letterSpacing: '-0.02em',
                                                    textTransform: 'lowercase'
                                                }}>
                                                    {item.categoryName || 'premium quality'}
                                                </Typography>
                                                
                                                {/* Price */}
                                                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, mb: 1.5, flexWrap: 'wrap' }}>
                                                    <Typography variant="h5" sx={{ 
                                                        fontWeight: 500, 
                                                        color: '#1a1a1a',
                                                        fontSize: '1.5rem',
                                                        fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                        letterSpacing: '-0.02em'
                                                    }}>
                                                        ${item.price.toFixed(2)}
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ 
                                                        color: '#4a4a4a',
                                                        fontSize: '0.875rem',
                                                        fontWeight: 300,
                                                        fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                        letterSpacing: '-0.02em',
                                                        textTransform: 'lowercase'
                                                    }}>/ 100g × {item.quantity}</Typography>
                                                    {item.quantity > 1 && (
                                                        <Typography variant="body1" sx={{ 
                                                            color: '#1a1a1a',
                                                            fontSize: '0.875rem',
                                                            fontWeight: 500,
                                                            fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                            letterSpacing: '-0.02em'
                                                        }}>
                                                            = ${(item.price * item.quantity).toFixed(2)}
                                                        </Typography>
                                                    )}
                                                </Box>

                                                {/* Quantity Controls */}
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center',
                                                    border: '0.0625rem solid #2c2c2c',
                                                    borderRadius: 0,
                                                    width: 'fit-content'
                                                }}>
                                                    <IconButton 
                                                        size="medium" 
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        sx={{ 
                                                            border: 'none',
                                                            borderRight: '0.0625rem solid #2c2c2c',
                                                            borderRadius: 0,
                                                            width: '2.5rem',
                                                            height: '2.5rem',
                                                            color: '#4caf50',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(76, 175, 80, 0.1)',
                                                                color: '#2e7d32'
                                                            }
                                                        }}
                                                    >
                                                        <RemoveIcon sx={{ fontSize: '1rem' }} />
                                                    </IconButton>
                                                    <Box sx={{ 
                                                        px: '1.25rem',
                                                        py: '0.625rem',
                                                        minWidth: '3.75rem',
                                                        textAlign: 'center',
                                                        borderRight: '0.0625rem solid #2c2c2c',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        bgcolor: 'transparent'
                                                    }}>
                                                        <Typography variant="body1" sx={{ color: '#2c2c2c', fontWeight: 600, fontSize: '1rem' }}>
                                                            {item.quantity.toString().padStart(2, '0')}
                                                        </Typography>
                                                    </Box>
                                                    <IconButton 
                                                        size="medium" 
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        sx={{ 
                                                            border: 'none',
                                                            borderRadius: 0,
                                                            width: '2.5rem',
                                                            height: '2.5rem',
                                                            color: '#2c2c2c',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(44, 44, 44, 0.1)',
                                                                color: '#000000'
                                                            }
                                                        }}
                                                    >
                                                        <AddIcon sx={{ fontSize: '1rem' }} />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Grid>

                                        {/* Remove Button - 3 columns (25%) */}
                                        <Grid size={3}>
                                            <Box sx={{ 
                                                display: 'flex', 
                                                justifyContent: 'center', 
                                                alignItems: 'center',
                                                height: '100%'
                                            }}>
                                                <Button 
                                                    variant="text" 
                                                    size="medium" 
                                                    onClick={() => removeItem(item.id)}
                                                    sx={{
                                                        color: '#2c2c2c',
                                                        fontSize: '0.875rem',
                                                        textTransform: 'lowercase',
                                                        fontWeight: 300,
                                                        fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                        letterSpacing: '-0.02em',
                                                        borderRadius: 0,
                                                        border: '1px solid #2c2c2c',
                                                        px: 2,
                                                        py: 0.5,
                                                        '&:hover': {
                                                            color: '#d32f2f',
                                                            bgcolor: 'rgba(211, 47, 47, 0.05)',
                                                            borderColor: '#d32f2f'
                                                        },
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    remove
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
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
                        <Typography variant="body1" sx={{ 
                            mb: 2, 
                            color: '#4a4a4a', 
                            fontSize: '0.875rem',
                            fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                            letterSpacing: '-0.02em',
                            textTransform: 'lowercase',
                            fontWeight: 300
                        }}>
                            tax included. shipping calculated at checkout.
                        </Typography>

                        {/* Checkout Button */}
                        <Link href="/cart" style={{ textDecoration: 'none' }}>
                            <Button 
                                variant="contained" 
                                fullWidth 
                                size="large"
                                onClick={onClose}
                                className="cart-hipster-button"
                                startIcon={
                                    <Box component="svg" width={20} height={20} viewBox="0 0 24 24" fill="none">
                                        <circle cx="9" cy="21" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <circle cx="20" cy="21" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </Box>
                                }
                                sx={{ 
                                    backgroundColor: '#1a1a1a',
                                    color: '#ffffff',
                                    py: '1.25rem',
                                    fontWeight: 700,
                                    textTransform: 'lowercase',
                                    letterSpacing: '-0.02em',
                                    fontSize: '1rem',
                                    fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                    border: '2px solid #2c2c2c',
                                    borderRadius: 0,
                                    boxShadow: '3px 3px 0px #66bb6a',
                                    '&:hover': {
                                        backgroundColor: '#66bb6a',
                                        color: '#ffffff',
                                        transform: 'translateY(-1px) translateX(-1px)',
                                        boxShadow: '4px 4px 0px #1a1a1a'
                                    },
                                    '&:active': {
                                        transform: 'translateY(0) translateX(0)',
                                        boxShadow: '3px 3px 0px #66bb6a'
                                    }
                                }}
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
