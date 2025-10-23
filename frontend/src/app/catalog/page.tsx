"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import { calculateAverageRating } from "@/lib/graphql";
import { useCartStore } from "@/store/cartStore";
import Grid from "@mui/material/Grid";
import { useSearchParams } from "next/navigation";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Link from "next/link";
import { FilterButton } from "@/components/FilterButton";
import type { Product as GqlProduct, Category as GqlCategory } from "@/lib/graphql";
import styles from "@/components/CatalogAnimations.module.css";
import StarRating from "@/components/StarRating";
import { useCachedData } from "@/hooks/useCachedData";
import PageSkeleton from "@/components/PageSkeleton";
import CircularProgress from "@mui/material/CircularProgress";

type Product = GqlProduct;
type Category = GqlCategory;

export default function Catalog() {
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<string>("ratings");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const addItem = useCartStore((s) => s.addItem);
    const storyTopRef = useRef<HTMLDivElement | null>(null);
    const [storyTopAnim, setStoryTopAnim] = useState(0);
    const searchParams = useSearchParams();
    
    // Use cached data
    const {
        products = [],
        categories = [],
        isLoading,
        hasError,
        refreshAll
    } = useCachedData();

    // Add catalog page class to body
    useEffect(() => {
        document.body.classList.add('catalog-page');
        return () => {
            document.body.classList.remove('catalog-page');
        };
    }, []);

    // Trigger top Our Story (under navbar) when visible
    useEffect(() => {
        const el = storyTopRef.current;
        if (!el) return;
        const obs = new IntersectionObserver((entries) => {
            const e = entries[0];
            if (e.isIntersecting) {
                setStoryTopAnim(1); // Set to 1 to trigger animation
                obs.disconnect(); // Disconnect after first trigger
            }
        }, { threshold: 0.2, rootMargin: "0px 0px -10% 0px" });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    // Preselect category from query string (?category=Name)
    useEffect(() => {
        const categoryName = searchParams.get("category");
        if (!categoryName || !categories || categories.length === 0) return;
        const match = categories.find((c) => c.name.toLowerCase() === categoryName.toLowerCase());
        if (match) setActiveCategoryId(match.documentId);
    }, [categories, searchParams]);

    const handleAddToCart = (product: Product) => {
        addItem({
            id: product.documentId,
            name: product.title,
            price: product.price,
            quantity: 1,
            imageUrl: product.images?.[0]?.url ? `${process.env.NEXT_PUBLIC_CMS_URL}${product.images[0].url}` : undefined,
        });
    };

    const filtered = (products || []).filter((p) => {
        const matchesCategory = !activeCategoryId || p.category?.documentId === activeCategoryId;
        const matchesSearch = !searchTerm || p.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const sortedProducts = [...filtered].sort((a, b) => {
        switch (sortBy) {
            case "price-low":
                return a.price - b.price;
            case "price-high":
                return b.price - a.price;
            case "newest":
                // For newest, we'll sort by documentId (assuming newer products have higher IDs)
                return b.documentId.localeCompare(a.documentId);
            case "ratings":
            default:
                // Sort by average rating (products with higher ratings first)
                const aRating = calculateAverageRating(a.reviews || []);
                const bRating = calculateAverageRating(b.reviews || []);
                return bRating - aRating;
        }
    });

    // Show loading state
        if (isLoading && (!products || products.length === 0)) {
            return <PageSkeleton variant="catalog" />;
        }

    // Show error state
    if (hasError && (!products || products.length === 0)) {
        return (
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '50vh',
                bgcolor: 'var(--background)',
                p: 3
            }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'error.main' }}>
                    Failed to load products
                </Typography>
                <Button variant="outlined" onClick={refreshAll}>
                    Try Again
                </Button>
            </Box>
        );
    }

    return (
        <Box className="catalog-background-gradient">
            <Box sx={{ 
                maxWidth: '100%', 
                mx: 'auto', 
                px: { xs: '1rem', md: '10%', lg: '15%' },
                py: '2rem',
                minHeight: 'calc(100vh - 10rem)',
                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif'
            }}>

                {/* Our Story intro (between navbar and product grid) */}
                {/* Our Story text block under navbar (animated) */}
                <Box sx={{ py: { xs: 5, md: 8 }, mb: { xs: 4, md: 6 }, bgcolor: 'white' }}>
                    <Box ref={storyTopRef} className="ourstory-enter hero-text-enter" data-anim={storyTopAnim}>
                        <Typography 
                            variant="h5" 
                            align="center" 
                            className="hipster-heading hero-line hero-line--1"
                            sx={{ 
                                fontWeight: 300, 
                                mb: 2,
                                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                letterSpacing: '-0.02em',
                                textTransform: 'lowercase',
                                fontSize: '2rem',
                                lineHeight: 0.9
                            }}
                        >
                            our story
                        </Typography>
                        <Typography 
                            variant="body1" 
                            className="hipster-heading hero-line hero-line--2" 
                            sx={{ 
                                textAlign: 'center', 
                                color: '#1a1a1a', 
                                maxWidth: 800, 
                                mx: 'auto', 
                                lineHeight: 1.7,
                                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                letterSpacing: '-0.02em',
                                textTransform: 'lowercase',
                                fontWeight: 300
                            }}
                        >
                            we meticulously select harvests from trusted farms and hand‑sort only the finest whole leaves. each lot is cupped and evaluated for aroma, body and sweetness to ensure exceptional clarity in your cup. our job is the careful sourcing and curation — so you can simply brew, savour and enjoy the best of tea.
                        </Typography>
                    </Box>
                </Box>

                <Grid container spacing={4}>
                    {/* Left Panel - Teas Introduction and Filters */}
                    <Grid size={{ xs: 12, md: 2.1 }}>
                        <Box sx={{ 
                            pr: { md: 3 },
                            border: '1px solid #2c2c2c',
                            borderRadius: 0,
                            p: '1.5rem',
                            bgcolor: '#ffffff'
                        }}>
                            {/* Teas Heading */}
                            <Typography 
                                variant="h2" 
                                className="hipster-heading"
                                sx={{ 
                                    fontSize: '3rem',
                                    fontWeight: 300,
                                    mb: 2,
                                    lineHeight: 0.9,
                                    fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                    letterSpacing: '-0.02em',
                                    textTransform: 'lowercase',
                                    color: '#1a1a1a'
                                }}
                            >
                                teas.
                            </Typography>
                            
                            {/* Description */}
                            <Typography 
                                variant="body1" 
                                className="hipster-heading"
                                sx={{ 
                                    fontSize: '1rem',
                                    mb: 4,
                                    lineHeight: 1.4,
                                    fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                    letterSpacing: '-0.02em',
                                    textTransform: 'lowercase',
                                    fontWeight: 300,
                                    color: '#1a1a1a'
                                }}
                            >
                                 guru tea offers the finest tea, blends and tisanes.
                            </Typography>

                            {/* Filter Buttons */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {/* All Teas Button */}
                                <FilterButton
                                    isActive={activeCategoryId === null}
                                    onClick={() => setActiveCategoryId(null)}
                                    imageUrl={undefined}
                                >
                                    All teas
                                </FilterButton>
                                
                                {/* Category Buttons */}
                                {(categories || []).map((category) => (
                                    <FilterButton
                                        key={category.documentId}
                                        isActive={activeCategoryId === category.documentId}
                                        onClick={() => setActiveCategoryId(category.documentId)}
                                        categoryName={category.name}
                                        imageUrl={Array.isArray(category.image) ? (category.image[0]?.url ? `${process.env.NEXT_PUBLIC_CMS_URL}${category.image[0].url}` : undefined) : (category.image?.url ? `${process.env.NEXT_PUBLIC_CMS_URL}${category.image.url}` : undefined)}
                                        imageAlt={Array.isArray(category.image) ? (category.image[0]?.alternativeText || category.name) : (category.image?.alternativeText || category.name)}
                                    >
                                        {category.name}
                                    </FilterButton>
                                ))}
                            </Box>

                            {/* Search under categories */}
                            <Box sx={{ width: '100%', mt: 3, mb: 2 }}>
                                <OutlinedInput
                                    placeholder="search by name"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Box component="svg" width={20} height={20} viewBox="0 0 24 24" fill="none" sx={{ color: '#1a1a1a' }}>
                                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                                            </Box>
                                        </InputAdornment>
                                    }
                                    sx={{ 
                                        width: '100%',
                                        fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                        letterSpacing: '-0.02em',
                                        textTransform: 'lowercase',
                                        fontWeight: 300,
                                        borderRadius: 0,
                                        border: '2px solid #2c2c2c',
                                        '& .MuiOutlinedInput-input': { 
                                            py: '0.9375rem',
                                            fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                            letterSpacing: '-0.02em',
                                            textTransform: 'lowercase',
                                            fontWeight: 300
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': { 
                                            border: 'none',
                                            borderColor: 'transparent'
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { 
                                            border: 'none',
                                            borderColor: 'transparent'
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
                                            border: 'none',
                                            borderColor: 'transparent'
                                        },
                                        '&.Mui-focused': {
                                            border: '2px solid #66bb6a',
                                            boxShadow: '2px 2px 0px #2c2c2c'
                                        },
                                        '& .MuiInputBase-input::placeholder': {
                                            fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                            letterSpacing: '-0.02em',
                                            textTransform: 'lowercase',
                                            fontWeight: 300,
                                            opacity: 0.7
                                        }
                                    }}
                                />
                            </Box>

                            {/* Sort under search */}
                            <Box sx={{ width: '100%', mb: 3 }}>
                                <FormControl sx={{ width: '100%' }}>
                                    <Select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        displayEmpty
                                        MenuProps={{ disableScrollLock: true }}
                                        renderValue={(selected) => {
                                            switch (selected) {
                                                case "ratings": return "sort by rating";
                                                case "price-low": return "sort by price";
                                                default: return "sort by rating";
                                            }
                                        }}
                                        sx={{ 
                                            fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                            letterSpacing: '-0.02em',
                                            textTransform: 'lowercase',
                                            fontWeight: 300,
                                            borderRadius: 0,
                                            border: '2px solid #2c2c2c',
                                            '& .MuiSelect-select': {
                                                textTransform: 'lowercase',
                                                fontWeight: 300,
                                                py: '0.9375rem',
                                                px: '1.25rem',
                                                fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                letterSpacing: '-0.02em'
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                border: 'none',
                                                borderColor: 'transparent'
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                border: 'none',
                                                borderColor: 'transparent'
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                border: 'none',
                                                borderColor: 'transparent'
                                            },
                                            '&.Mui-focused': {
                                                border: '2px solid #66bb6a',
                                                boxShadow: '2px 2px 0px #2c2c2c'
                                            },
                                            '&:hover': { 
                                                transform: 'translateY(-1px)', 
                                                transition: 'all 0.2s ease-in-out' 
                                            },
                                            '&:active': { transform: 'translateY(0)' }
                                        }}
                                    >
                                        <MenuItem value="ratings" sx={{ fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif', letterSpacing: '-0.02em', textTransform: 'lowercase', fontWeight: 300 }}>sort by rating</MenuItem>
                                        <MenuItem value="price-low" sx={{ fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif', letterSpacing: '-0.02em', textTransform: 'lowercase', fontWeight: 300 }}>sort by price</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                    </Grid>
                    
                    {/* Product Grid */}
                    <Grid size={{ xs: 12, md: 9.9 }}>
                        <Grid container spacing={3} sx={{ 
                            minHeight: { xs: '50vh', md: '60vh' },
                            alignItems: 'stretch'
                        }}>
                            {sortedProducts.map((p, idx) => (
                                <Grid key={p.documentId} size={{ xs: 12, sm: 6, md: 4, lg: 3 }} className={`${styles.card} ${styles.show} ${styles[`d${idx % 20}`]}`}>
                                    <Link href={`/catalog/${p.slug || p.documentId}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                                        <Box className="product-card">
                                            <Box className="product-card-content">
                                                {/* Header: title + price left, ADD button right */}
                                                <Box className="product-card-header">
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                                                        <Typography className="product-card-title">
                                                            {p.title}
                                                        </Typography>
                                                        <Typography className="product-card-price">
                                                            ${p.price.toFixed(2)}
                                                        </Typography>
                                                    </Box>
                                                    <Button 
                                                        className="product-card-add-button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleAddToCart(p);
                                                        }}
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
                                                            '&:hover': {
                                                                bgcolor: '#66bb6a',
                                                                color: 'white',
                                                                borderColor: '#66bb6a'
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
                                                </Box>

                                                {/* Rating and Description above image */}
                                                <Box className="product-card-rating-section">
                                                    <Box className="product-card-rating">
                                                        {(p.reviews?.length || 0) > 0 && (
                                                            <StarRating 
                                                                rating={Math.round(calculateAverageRating(p.reviews || []))}
                                                                reviewCount={p.reviews?.length || 0}
                                                                size="small"
                                                                filledColor="#2c2c2c"
                                                                emptyColor="#9e9e9e"
                                                            />
                                                        )}
                                                    </Box>
                                                </Box>

                                                {/* Product Image */}
                                                <Box className="product-card-image-container">
                                                    {p.images?.[0]?.url ? (
                                                        <CardMedia
                                                            component="img"
                                                            image={`${process.env.NEXT_PUBLIC_CMS_URL}${p.images[0].url}`}
                                                            alt={p.images?.[0]?.alternativeText || p.title}
                                                            loading="lazy"
                                                            decoding="async"
                                                            fetchPriority="low"
                                                            className="product-card-image"
                                                        />
                                                    ) : (
                                                        <Box sx={{ 
                                                            width: '100%', 
                                                            height: '100%', 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            justifyContent: 'center', 
                                                            color: '#3b4d3c',
                                                            bgcolor: 'transparent'
                                                        }}>
                                                            <Box component="svg" width={88} height={88} viewBox="0 0 64 64" fill="none">
                                                                <circle cx="32" cy="32" r="30" fill="#f5f9f5"/>
                                                                <g fill="currentColor">
                                                                    <path d="M10 24c0-1.657 1.343-3 3-3h28c1.657 0 3 1.343 3 3v8c0 7.732-6.268 14-14 14h-6C16.268 46 10 39.732 10 32v-8z"/>
                                                                    <path d="M44 26h4a6 6 0 0 1 0 12h-2.5a2 2 0 1 1 0-4H48a 2 2 0 0 0 0-4h-4v-4z"/>
                                                                    <path d="M12 50h40a2 2 0 1 1 0 4H12a2 2 0 1 1 0-4z"/>
                                                                    <path d="M24 10c1 2-2 4-2 6s3 4 2 6c-1-2-4-4-4-6s3-4 4-6zm10 0c1 2-2 4-2 6s3 4 2 6c-1-2-4-4-4-6s3-4 4-6z"/>
                                                                </g>
                                                            </Box>
                                                        </Box>
                                                    )}
                                                </Box>
                                                
                                                {/* Description Overlay */}
                                                <Box className="product-card-description-overlay">
                                                    <Typography className="product-card-description-text">
                                                        {p.description || "Learn more"}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Link>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

    
        
        </Box>
    );
}