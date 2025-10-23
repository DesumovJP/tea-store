"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import cartAnim from "@/components/CartShake.module.css";
import Badge from "@mui/material/Badge";
import Modal from "@mui/material/Modal";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Fade from "@mui/material/Fade";
import Slide from "@mui/material/Slide";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CartDrawer from "@/components/CartDrawer";
import { useCartStore } from "@/store/cartStore";
import AnnouncementBar from "@/components/AnnouncementBar";
import { useCartAnimation, setGlobalCartAnimationTrigger } from "@/hooks/useCartAnimation";

export default function Navbar() {
    const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [cartOpen, setCartOpen] = React.useState(false);
    const [menuHovered, setMenuHovered] = React.useState(false);
    const pathname = usePathname();
    const { isAnimating: cartAnimating, triggerAnimation } = useCartAnimation();

    const toggleDrawer = (open: boolean) => () => setDrawerOpen(open);
    
    // Відкриваємо меню при ховері
    React.useEffect(() => {
        if (menuHovered) {
            setDrawerOpen(true);
        }
    }, [menuHovered]);
    
    // Встановлюємо глобальний тригер при монтуванні компонента
    React.useEffect(() => {
        setGlobalCartAnimationTrigger(triggerAnimation);
        return () => setGlobalCartAnimationTrigger(null);
    }, [triggerAnimation]);
    
    const isHome = pathname === "/";
    // Навбар завжди непрозорий
    const isTransparent = false;
    // Колір елементів: чорний для андеграунд стилю
    const iconAndTextColor = "#000000";
    const cupColor = "#000000";

    const navLinks = [
        { label: "Catalog", href: "/catalog", image: "http://localhost:1337/uploads/catalog_d80f623ec6.png" },
        { label: "About Us", href: "/about", image: "http://localhost:1337/uploads/pexels_photo_6545361_c56e978b41.jpeg" },
    ];

    const cartItems = useCartStore((state) => state.items);
    const [justAdded, setJustAdded] = React.useState(false);

    React.useEffect(() => {
        if (cartItems.length === 0) return;
        setJustAdded(true);
        const t = setTimeout(() => setJustAdded(false), 520);
        return () => clearTimeout(t);
    }, [cartItems]);
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                position="fixed"
                elevation={isTransparent ? 0 : 4}
                sx={{
                    backgroundColor: isTransparent ? "transparent" : "#f8f8f8",
                    transition: "background-color 0.3s ease",
                    zIndex: (theme) => theme.zIndex.appBar,
                    overflow: 'hidden',
                    maxWidth: '100vw'
                }}
            >
                {/* Announcement bar: show/hide with scroll */}
                <Box
                    className="announcement-root"
                    sx={{
                        overflow: 'hidden',
                        height: trigger ? 0 : 36,
                        opacity: trigger ? 0 : 1,
                        transform: trigger ? 'translateY(-6px)' : 'translateY(0)',
                        transition: 'height 240ms ease, opacity 200ms ease, transform 220ms ease',
                        pointerEvents: trigger ? 'none' : 'auto',
                        display: 'block',
                    }}
                >
                    <AnnouncementBar />
                </Box>
                <Toolbar disableGutters>
                    <Container
                        maxWidth="lg"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            minHeight: { xs: '4rem', sm: '4.5rem' },
                            position: 'relative',
                            maxWidth: '100vw',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Ліва частина — бургер меню */}
                        <Button
                            onClick={toggleDrawer(true)}
                            onMouseEnter={() => setMenuHovered(true)}
                            onMouseLeave={() => setMenuHovered(false)}
                            sx={{ 
                                color: iconAndTextColor,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                textTransform: 'lowercase',
                                fontWeight: 400,
                                fontSize: '1.1rem',
                                fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                letterSpacing: '-0.01em',
                                padding: '12px 16px',
                                borderRadius: '4px',
                                '&:hover': { 
                                    opacity: 0.7,
                                    bgcolor: 'rgba(0, 0, 0, 0.05)'
                                }
                            }}
                        >
                            <Box component="svg" width={24} height={24} viewBox="0 0 24 24" fill="none" sx={{ color: iconAndTextColor }}>
                                <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </Box>
                            menu
                        </Button>

                        {/* Центр — логотип Guru Tea */}
                        <Link href="/" passHref style={{ textDecoration: 'none' }}>
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.75,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translate(-50%, -50%) scale(1.05)',
                                    }
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Box component="svg" width={40} height={40} viewBox="0 0 32 32" fill="none" sx={{ display: 'block' }}>
                                        {/* Чорна чашка */}
                                        <circle cx="16" cy="16" r="12" fill="#1a1a1a" stroke="#000000" strokeWidth="3"/>
                                        {/* Зелений чай всередині */}
                                        <circle cx="16" cy="16" r="8" fill="#81c784" stroke="#000000" strokeWidth="2"/>
                                        {/* Пар від чаю */}
                                        <path d="M12 8c0-1 1-2 2-2s2 1 2 2M16 8c0-1 1-2 2-2s2 1 2 2M20 8c0-1 1-2 2-2s2 1 2 2" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                                        {/* Ручка чашки */}
                                        <path d="M28 12c2 0 2 4 0 4s-2-4 0-4" stroke="#000000" strokeWidth="3" fill="none"/>
                                    </Box>
                                </Box>
                                <Typography
                                    component="div"
                                    sx={{
                                        fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                        fontWeight: 600,
                                        letterSpacing: '-0.02em',
                                        fontSize: { xs: '1.3rem', sm: '1.6rem' },
                                        background: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 50%, #1a1a1a 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        textDecoration: 'none',
                                        textTransform: 'lowercase',
                                        position: 'relative',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'linear-gradient(135deg, #66bb6a 0%, #4caf50 50%, #2e7d32 100%)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease',
                                        },
                                        '&:hover::before': {
                                            opacity: 1,
                                        }
                                    }}
                                >
                                    guru tea
                                </Typography>
                            </Box>
                        </Link>

                        {/* Права частина — корзина */}
                        <IconButton 
                            onClick={() => setCartOpen(true)} 
                            className={cartAnimating ? cartAnim.shake : ''}
                            sx={{ 
                                color: iconAndTextColor,
                                padding: '12px',
                                '&:hover': { 
                                    opacity: 0.7
                                }
                            }}
                        >
                            <Badge badgeContent={cartCount} color="error">
                                <Box component="svg" width={28} height={28} viewBox="0 0 24 24" fill="none" sx={{ color: iconAndTextColor }}>
                                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h6m-6 0a2 2 0 100 4 2 2 0 000-4zm6 0a2 2 0 100 4 2 2 0 000-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </Box>
                            </Badge>
                        </IconButton>
                    </Container>

                    {/* Modal меню */}
                    <Modal
                        open={drawerOpen}
                        onClose={toggleDrawer(false)}
                        closeAfterTransition
                        BackdropProps={{
                            sx: {
                                backdropFilter: 'blur(8px)',
                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            }
                        }}
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            p: 2,
                            overflow: 'hidden',
                            maxWidth: '100vw',
                            maxHeight: '100vh'
                        }}
                    >
                        <Fade in={drawerOpen} timeout={300}>
                            <Box
                                sx={{
                                    width: { xs: '95%', sm: '90%', md: '85%' },
                                    maxWidth: { xs: '100vw', sm: '800px', md: '1000px' },
                                    background: '#ffffff',
                                    borderRadius: '0.75rem',
                                    boxShadow: '0 0.5rem 2rem rgba(0, 0, 0, 0.15)',
                                    maxHeight: '85vh',
                                    minHeight: '70vh',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    mt: 2,
                                }}
                            >
                                <Slide direction="down" in={drawerOpen} timeout={300}>
                                    <Box>
                                        {/* Заголовок модалки */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                p: 4,
                                                borderBottom: '1px solid #e0e0e0',
                                                bgcolor: '#ffffff',
                                            }}
                                        >
                                            <Typography
                                                variant="h4"
                                                className="hipster-heading"
                                                sx={{
                                                    fontWeight: 300,
                                                    color: '#1a1a1a',
                                                    fontSize: { xs: '1.5rem', sm: '2rem' },
                                                    fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                    letterSpacing: '-0.02em',
                                                    textTransform: 'lowercase',
                                                    background: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 50%, #1a1a1a 100%)',
                                                    backgroundClip: 'text',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    position: 'relative',
                                                    '&::before': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        background: 'linear-gradient(135deg, #66bb6a 0%, #4caf50 50%, #2e7d32 100%)',
                                                        backgroundClip: 'text',
                                                        WebkitBackgroundClip: 'text',
                                                        WebkitTextFillColor: 'transparent',
                                                        opacity: 0,
                                                        transition: 'opacity 0.3s ease',
                                                    },
                                                    '&:hover::before': {
                                                        opacity: 1,
                                                    }
                                                }}
                                            >
                                                menu
                                            </Typography>
                                            <IconButton
                                                onClick={toggleDrawer(false)}
                                                sx={{
                                                    color: '#1a1a1a',
                                                    border: '2px solid #2c2c2c',
                                                    borderRadius: 0,
                                                    boxShadow: '2px 2px 0px #66bb6a',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': { 
                                                        bgcolor: '#66bb6a',
                                                        color: '#ffffff',
                                                        transform: 'translateY(-1px) translateX(-1px)',
                                                        boxShadow: '3px 3px 0px #1a1a1a'
                                                    }
                                                }}
                                            >
                                                <Box component="svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
                                                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </Box>
                                            </IconButton>
                                        </Box>

                                        {/* Навігаційні карточки */}
                                        <Box sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                                            <Box
                                                sx={{
                                                    display: 'grid',
                                                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                                                    gap: 4,
                                                    flex: 1,
                                                }}
                                            >
                                                {navLinks.map((item) => (
                                                    <Card
                                                        key={item.href}
                                                        component={Link}
                                                        href={item.href}
                                                        onClick={toggleDrawer(false)}
                                                        sx={{
                                                            height: '100%',
                                                            minHeight: '300px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            borderRadius: 0,
                                                            backgroundImage: `url(${item.image})`,
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                            backgroundRepeat: 'no-repeat',
                                                            border: '3px solid #2c2c2c',
                                                            cursor: 'pointer',
                                                            textDecoration: 'none',
                                                            transition: 'all 0.3s ease',
                                                            position: 'relative',
                                                            overflow: 'hidden',
                                                            boxShadow: '4px 4px 0px #66bb6a',
                                                            '&:hover': {
                                                                transform: 'scale(1.02)',
                                                                border: '3px solid #66bb6a',
                                                            }
                                                        }}
                                                    >
                                                        <CardContent 
                                                            sx={{ 
                                                                textAlign: 'center', 
                                                                p: 0,
                                                                position: 'relative',
                                                                zIndex: 2,
                                                                width: '100%',
                                                                height: '100%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="h5"
                                                                className="hipster-heading white-text-shadow"
                                                                sx={{
                                                                    fontWeight: 700,
                                                                    color: '#ffffff !important',
                                                                    fontSize: { xs: '1.5rem', sm: '2rem' },
                                                                    textDecoration: 'none',
                                                                    textShadow: '3px 3px 6px rgba(0, 0, 0, 0.9), 0 0 10px rgba(0, 0, 0, 0.5)',
                                                                    fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                                    letterSpacing: '-0.02em',
                                                                    textTransform: 'lowercase',
                                                                    px: 2,
                                                                    py: 1,
                                                                    '&:hover': {
                                                                        color: '#ffffff !important'
                                                                    }
                                                                }}
                                                            >
                                                                {item.label}
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </Box>
                                        </Box>

                                        {/* Footer секція з інформаційними параграфами */}
                                        <Box
                                            sx={{
                                                borderTop: '2px solid #2c2c2c',
                                                bgcolor: '#f8f9fa',
                                                p: 4,
                                                flex: '0 0 auto'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'grid',
                                                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                                                    gap: 3,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: 0,
                                                        cursor: 'pointer',
                                                        border: '1px solid #e0e0e0',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            bgcolor: '#f8f9fa',
                                                            borderColor: '#66bb6a',
                                                        }
                                                    }}
                                                >
                                                    <Typography
                                                        variant="h6"
                                                        className="hipster-heading"
                                                        sx={{
                                                            fontWeight: 600,
                                                            color: '#1a1a1a',
                                                            mb: 1,
                                                            fontSize: '1rem',
                                                            fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                            letterSpacing: '-0.02em',
                                                            textTransform: 'lowercase'
                                                        }}
                                                    >
                                                        доставка і оплата
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: '#4a4a4a',
                                                            lineHeight: 1.5,
                                                            fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                            letterSpacing: '-0.01em',
                                                            textTransform: 'lowercase'
                                                        }}
                                                    >
                                                        швидка доставка по всій україні. безпечна оплата карткою або готівкою.
                                                    </Typography>
                                                </Box>

                                                <Box
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: 0,
                                                        cursor: 'pointer',
                                                        border: '1px solid #e0e0e0',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            bgcolor: '#f8f9fa',
                                                            borderColor: '#66bb6a',
                                                        }
                                                    }}
                                                >
                                                    <Typography
                                                        variant="h6"
                                                        className="hipster-heading"
                                                        sx={{
                                                            fontWeight: 600,
                                                            color: '#1a1a1a',
                                                            mb: 1,
                                                            fontSize: '1rem',
                                                            fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                            letterSpacing: '-0.02em',
                                                            textTransform: 'lowercase'
                                                        }}
                                                    >
                                                        гарантії якості
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: '#4a4a4a',
                                                            lineHeight: 1.5,
                                                            fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                            letterSpacing: '-0.01em',
                                                            textTransform: 'lowercase'
                                                        }}
                                                    >
                                                        тільки оригінальний чай з сертифікатами якості від перевірених постачальників.
                                                    </Typography>
                                                </Box>

                                                <Box
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: 0,
                                                        cursor: 'pointer',
                                                        border: '1px solid #e0e0e0',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            bgcolor: '#f8f9fa',
                                                            borderColor: '#66bb6a',
                                                        }
                                                    }}
                                                >
                                                    <Typography
                                                        variant="h6"
                                                        className="hipster-heading"
                                                        sx={{
                                                            fontWeight: 600,
                                                            color: '#1a1a1a',
                                                            mb: 1,
                                                            fontSize: '1rem',
                                                            fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                            letterSpacing: '-0.02em',
                                                            textTransform: 'lowercase'
                                                        }}
                                                    >
                                                        контакти
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: '#4a4a4a',
                                                            lineHeight: 1.5,
                                                            fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                            letterSpacing: '-0.01em',
                                                            textTransform: 'lowercase'
                                                        }}
                                                    >
                                                        зв'яжіться з нами для консультації з вибору чаю або замовлення.
                                                    </Typography>
                                                </Box>

                                                <Box
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: 0,
                                                        cursor: 'pointer',
                                                        border: '1px solid #e0e0e0',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            bgcolor: '#f8f9fa',
                                                            borderColor: '#66bb6a',
                                                        }
                                                    }}
                                                >
                                                    <Typography
                                                        variant="h6"
                                                        className="hipster-heading"
                                                        sx={{
                                                            fontWeight: 600,
                                                            color: '#1a1a1a',
                                                            mb: 1,
                                                            fontSize: '1rem',
                                                            fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                            letterSpacing: '-0.02em',
                                                            textTransform: 'lowercase'
                                                        }}
                                                    >
                                                        повернення товару
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: '#4a4a4a',
                                                            lineHeight: 1.5,
                                                            fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                            letterSpacing: '-0.01em',
                                                            textTransform: 'lowercase'
                                                        }}
                                                    >
                                                        14 днів на повернення товару у разі невідповідності якості.
                                                    </Typography>
                                                </Box>

                                                <Box
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: 0,
                                                        cursor: 'pointer',
                                                        border: '1px solid #e0e0e0',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            bgcolor: '#f8f9fa',
                                                            borderColor: '#66bb6a',
                                                        }
                                                    }}
                                                >
                                                    <Typography
                                                        variant="h6"
                                                        className="hipster-heading"
                                                        sx={{
                                                            fontWeight: 600,
                                                            color: '#1a1a1a',
                                                            mb: 1,
                                                            fontSize: '1rem',
                                                            fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                            letterSpacing: '-0.02em',
                                                            textTransform: 'lowercase'
                                                        }}
                                                    >
                                                        програма лояльності
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: '#4a4a4a',
                                                            lineHeight: 1.5,
                                                            fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                            letterSpacing: '-0.01em',
                                                            textTransform: 'lowercase'
                                                        }}
                                                    >
                                                        накопичуйте бонуси за покупки та отримуйте знижки на наступні замовлення.
                                                    </Typography>
                                                </Box>

                                                <Box
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: 0,
                                                        cursor: 'pointer',
                                                        border: '1px solid #e0e0e0',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            bgcolor: '#f8f9fa',
                                                            borderColor: '#66bb6a',
                                                        }
                                                    }}
                                                >
                                                    <Typography
                                                        variant="h6"
                                                        className="hipster-heading"
                                                        sx={{
                                                            fontWeight: 600,
                                                            color: '#1a1a1a',
                                                            mb: 1,
                                                            fontSize: '1rem',
                                                            fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                            letterSpacing: '-0.02em',
                                                            textTransform: 'lowercase'
                                                        }}
                                                    >
                                                        чайні церемонії
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: '#4a4a4a',
                                                            lineHeight: 1.5,
                                                            fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                            letterSpacing: '-0.01em',
                                                            textTransform: 'lowercase'
                                                        }}
                                                    >
                                                        організовуємо чайні церемонії та майстер-класи з приготування чаю.
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>

                                        {/* Social Media Block */}
                                        <Box
                                            sx={{
                                                borderTop: '1px solid #e0e0e0',
                                                bgcolor: '#ffffff',
                                                p: 3,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: 2
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: '#1a1a1a',
                                                    fontSize: '1.1rem',
                                                    mb: 1
                                                }}
                                            >
                                                Слідкуйте за нами
                                            </Typography>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    gap: 3,
                                                    alignItems: 'center',
                                                    p: 2
                                                }}
                                            >
                                                {/* Instagram */}
                                                <Box
                                                    sx={{
                                                        p: 1.5,
                                                        m: 1,
                                                        borderRadius: '8px',
                                                        bgcolor: '#E4405F',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease',
                                                        border: '2px solid #1a1a1a',
                                                        boxShadow: '3px 3px 0px #1a1a1a',
                                                        '&:hover': {
                                                            transform: 'scale(1.05) translateY(-1px)',
                                                            boxShadow: '4px 4px 0px #1a1a1a',
                                                            '& svg': {
                                                                color: '#ffffff'
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <Box component="svg" width={24} height={24} viewBox="0 0 24 24" fill="none" sx={{ color: '#ffffff' }}>
                                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor"/>
                                                    </Box>
                                                </Box>

                                                {/* Facebook */}
                                                <Box
                                                    sx={{
                                                        p: 1.5,
                                                        m: 1,
                                                        borderRadius: '8px',
                                                        bgcolor: '#1877F2',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease',
                                                        border: '2px solid #1a1a1a',
                                                        boxShadow: '3px 3px 0px #1a1a1a',
                                                        '&:hover': {
                                                            transform: 'scale(1.05) translateY(-1px)',
                                                            boxShadow: '4px 4px 0px #1a1a1a',
                                                            '& svg': {
                                                                color: '#ffffff'
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <Box component="svg" width={24} height={24} viewBox="0 0 24 24" fill="none" sx={{ color: '#ffffff' }}>
                                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="currentColor"/>
                                                    </Box>
                                                </Box>

                                                {/* Telegram */}
                                                <Box
                                                    sx={{
                                                        p: 1.5,
                                                        m: 1,
                                                        borderRadius: '8px',
                                                        bgcolor: '#26A5E4',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease',
                                                        border: '2px solid #1a1a1a',
                                                        boxShadow: '3px 3px 0px #1a1a1a',
                                                        '&:hover': {
                                                            transform: 'scale(1.05) translateY(-1px)',
                                                            boxShadow: '4px 4px 0px #1a1a1a',
                                                            '& svg': {
                                                                color: '#ffffff'
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <Box component="svg" width={24} height={24} viewBox="0 0 24 24" fill="none" sx={{ color: '#ffffff' }}>
                                                        <path d="M19.633 2.897l-17.022 6.563c-1.162.452-1.155 1.08-.21 1.363l4.345 1.357 1.678 5.303c.221.61.112.85.764.85.502 0 .723-.23 1.002-.502l2.406-2.34 5.01 3.693c.922.51 1.585.246 1.82-.857l3.292-15.438c.337-1.35-.514-1.965-1.585-1.523zM8.29 13.253l8.308-5.224c.412-.25.79-.113.48.159l-6.716 6.073-.26 3.69-1.812-4.698z" fill="currentColor"/>
                                                    </Box>
                                                </Box>

                                                {/* YouTube */}
                                                <Box
                                                    sx={{
                                                        p: 1.5,
                                                        m: 1,
                                                        borderRadius: '8px',
                                                        bgcolor: '#FF0000',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease',
                                                        border: '2px solid #1a1a1a',
                                                        boxShadow: '3px 3px 0px #1a1a1a',
                                                        '&:hover': {
                                                            transform: 'scale(1.05) translateY(-1px)',
                                                            boxShadow: '4px 4px 0px #1a1a1a',
                                                            '& svg': {
                                                                color: '#ffffff'
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <Box component="svg" width={24} height={24} viewBox="0 0 24 24" fill="none" sx={{ color: '#ffffff' }}>
                                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="currentColor"/>
                                                    </Box>
                                                </Box>

                                                {/* TikTok */}
                                                <Box
                                                    sx={{
                                                        p: 1.5,
                                                        m: 1,
                                                        borderRadius: '8px',
                                                        bgcolor: '#000000',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease',
                                                        border: '2px solid #1a1a1a',
                                                        boxShadow: '3px 3px 0px #1a1a1a',
                                                        '&:hover': {
                                                            transform: 'scale(1.05) translateY(-1px)',
                                                            boxShadow: '4px 4px 0px #1a1a1a',
                                                            '& svg': {
                                                                color: '#ffffff'
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <Box component="svg" width={24} height={24} viewBox="0 0 24 24" fill="none" sx={{ color: '#ffffff' }}>
                                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="currentColor"/>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Slide>
                            </Box>
                        </Fade>
                    </Modal>
                </Toolbar>
            </AppBar>

            {/* Drawer корзини */}
            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        </Box>
    );
}
