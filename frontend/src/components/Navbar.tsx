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
import CartIcon from "@/components/icons/CartIcon";
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
        <Box>
            <AppBar
                position="fixed"
                elevation={4}
                className="navbar-appbar"
            >
                {/* Announcement bar: show/hide with scroll */}
                <Box
                    className={`announcement-root announcement-toggle ${trigger ? 'announcement-toggle--hidden' : ''}`}
                >
                    <AnnouncementBar />
                </Box>
                <Toolbar disableGutters>
                    <Container maxWidth="lg" className="navbar-container">
                        {/* Ліва частина — бургер меню */}
                        <IconButton
                            onClick={toggleDrawer(true)}
                            onMouseEnter={() => setMenuHovered(true)}
                            onMouseLeave={() => setMenuHovered(false)}
                            className="navbar-menu-btn"
                            aria-label="open menu"
                            title="menu"
                        >
                            <Box component="svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
                                <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </Box>
                        </IconButton>

                        {/* Центр — мінімалістичний текстовий логотип */}
                        <Link href="/" passHref className="navbar-logo-link">
                            <Box className="navbar-logo">
                                <Typography component="div" className="navbar-logo-title">
                                    <span className="navbar-logo-word">guru</span>
                                    <span className="navbar-logo-accent">tea</span>
                                </Typography>
                            </Box>
                        </Link>

                        {/* Права частина — корзина */}
                        <IconButton 
                            onClick={() => setCartOpen(true)} 
                            className={cartAnimating ? cartAnim.shake : ''}
                            className="navbar-cart-btn"
                        >
                            <Badge badgeContent={cartCount} color="error">
                                <CartIcon size={28} />
                            </Badge>
                        </IconButton>
                    </Container>

                    {/* Modal меню */}
                    <Modal
                        open={drawerOpen}
                        onClose={toggleDrawer(false)}
                        closeAfterTransition
                        BackdropProps={{}}
                        className="navbar-modal"
                    >
                        <Fade in={drawerOpen} timeout={300}>
                            <Box className="navbar-modal-panel">
                                <Slide direction="down" in={drawerOpen} timeout={300}>
                                    <Box>
                                        {/* Заголовок модалки */}
                                        <Box className="navbar-modal-header">
                                            <Typography
                                                variant="h4"
                                                className="hipster-heading navbar-modal-title"
                                            >
                                                menu
                                            </Typography>
                                            <IconButton
                                                onClick={toggleDrawer(false)}
                                                className="navbar-modal-close"
                                            >
                                                <Box component="svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
                                                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </Box>
                                            </IconButton>
                                        </Box>

                                        {/* Навігаційні карточки */}
                                        <Box className="navbar-modal-body">
                                            <Box className="navbar-cards-grid">
                                                {navLinks.map((item) => (
                                                    <Card
                                                        key={item.href}
                                                        component={Link}
                                                        href={item.href}
                                                        onClick={toggleDrawer(false)}
                                                        className="navbar-card"
                                                    >
                                                        <Box component="img" src={item.image} alt="" className="navbar-card-bg" />
                                                        <CardContent className="navbar-card-content">
                                                            <Typography
                                                                variant="h5"
                                                                className="hipster-heading white-text-shadow navbar-card-title"
                                                            >
                                                                {item.label}
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </Box>
                                        </Box>

                                        {/* Footer секція з інформаційними параграфами */}
                                        <Box className="navbar-info-section">
                                            <Box className="navbar-info-grid">
                                                <Box className="navbar-info-card">
                                                    <Typography
                                                        variant="h6"
                                                        className="hipster-heading navbar-info-heading"
                                                    >
                                                        доставка і оплата
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        className="navbar-info-body"
                                                    >
                                                        швидка доставка по всій україні. безпечна оплата карткою або готівкою.
                                                    </Typography>
                                                </Box>

                                                <Box className="navbar-info-card">
                                                    <Typography
                                                        variant="h6"
                                                        className="hipster-heading navbar-info-heading"
                                                    >
                                                        гарантії якості
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        className="navbar-info-body"
                                                    >
                                                        тільки оригінальний чай з сертифікатами якості від перевірених постачальників.
                                                    </Typography>
                                                </Box>

                                                <Box className="navbar-info-card">
                                                    <Typography
                                                        variant="h6"
                                                        className="hipster-heading navbar-info-heading"
                                                    >
                                                        контакти
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        className="navbar-info-body"
                                                    >
                                                        зв'яжіться з нами для консультації з вибору чаю або замовлення.
                                                    </Typography>
                                                </Box>

                                                <Box className="navbar-info-card">
                                                    <Typography
                                                        variant="h6"
                                                        className="hipster-heading navbar-info-heading"
                                                    >
                                                        повернення товару
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        className="navbar-info-body"
                                                    >
                                                        14 днів на повернення товару у разі невідповідності якості.
                                                    </Typography>
                                                </Box>

                                                <Box className="navbar-info-card">
                                                    <Typography
                                                        variant="h6"
                                                        className="hipster-heading navbar-info-heading"
                                                    >
                                                        програма лояльності
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        className="navbar-info-body"
                                                    >
                                                        накопичуйте бонуси за покупки та отримуйте знижки на наступні замовлення.
                                                    </Typography>
                                                </Box>

                                                <Box className="navbar-info-card">
                                                    <Typography
                                                        variant="h6"
                                                        className="hipster-heading navbar-info-heading"
                                                    >
                                                        чайні церемонії
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        className="navbar-info-body"
                                                    >
                                                        організовуємо чайні церемонії та майстер-класи з приготування чаю.
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>

                                        {/* Social Media Block */}
                                        <Box className="navbar-social">
                                            <Typography
                                                variant="h6"
                                                className="navbar-social-title"
                                            >
                                                Слідкуйте за нами
                                            </Typography>
                                            <Box className="navbar-social-icons">
                                                {/* Instagram */}
                                                <Box className="navbar-social-icon navbar-social--instagram">
                                                    <Box component="svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
                                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor"/>
                                                    </Box>
                                                </Box>

                                                {/* Facebook */}
                                                <Box className="navbar-social-icon navbar-social--facebook">
                                                    <Box component="svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
                                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="currentColor"/>
                                                    </Box>
                                                </Box>

                                                {/* Telegram */}
                                                <Box className="navbar-social-icon navbar-social--telegram">
                                                    <Box component="svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
                                                        <path d="M19.633 2.897l-17.022 6.563c-1.162.452-1.155 1.08-.21 1.363l4.345 1.357 1.678 5.303c.221.61.112.85.764.85.502 0 .723-.23 1.002-.502l2.406-2.34 5.01 3.693c.922.51 1.585.246 1.82-.857l3.292-15.438c.337-1.35-.514-1.965-1.585-1.523zM8.29 13.253l8.308-5.224c.412-.25.79-.113.48.159l-6.716 6.073-.26 3.69-1.812-4.698z" fill="currentColor"/>
                                                    </Box>
                                                </Box>

                                                {/* YouTube */}
                                                <Box className="navbar-social-icon navbar-social--youtube">
                                                    <Box component="svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
                                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="currentColor"/>
                                                    </Box>
                                                </Box>

                                                {/* TikTok */}
                                                <Box className="navbar-social-icon navbar-social--tiktok">
                                                    <Box component="svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
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
