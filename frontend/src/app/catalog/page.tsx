"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import { calculateAverageRating } from "@/lib/graphql";
import { useCartStore } from "@/store/cartStore";
import Grid from "@mui/material/Grid";
import { useSearchParams } from "next/navigation";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Link from "next/link";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import type { Product as GqlProduct, Category as GqlCategory } from "@/lib/graphql";
import styles from "@/components/CatalogAnimations.module.css";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { useCachedData } from "@/hooks/useCachedData";
import PageSkeleton from "@/components/PageSkeleton";
import ProductCard from "@/components/ProductCard";

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
            <Box className="catalog-error-container">
                <Typography variant="h6" className="catalog-error-title">
                    Failed to load products
                </Typography>
                <Button className="btn btn--dark" onClick={refreshAll}>
                    Try Again
                </Button>
            </Box>
        );
    }

    return (
        <Box className="catalog-background-gradient">
            <Box className="catalog-page-container">

                {/* Our Story intro (between navbar and product grid) */}
                {/* Our Story text block under navbar (animated) */}
                <Box className="catalog-story-section">
                    <Box ref={storyTopRef} className="ourstory-enter" data-anim={storyTopAnim}>
                        <Typography 
                            variant="h2"
                            align="center" 
                            className="catalog-story-title"
                        >
                            our story
                        </Typography>
                        <Typography 
                            variant="body1" 
                            className="catalog-story-text"
                        >
                            we meticulously select harvests from trusted farms and hand‑sort only the finest whole leaves. each lot is cupped and evaluated for aroma, body and sweetness to ensure exceptional clarity in your cup. our job is the careful sourcing and curation — so you can simply brew, savour and enjoy the best of tea.
                        </Typography>
                    </Box>
                </Box>

                <Box className="catalog-outer-grid">
                    {/* Left Panel - Teas Introduction and Filters */}
                    <Box className="catalog-left">
                        <Box className="catalog-filter-panel">
                            {/* Teas Heading */}
                            <Typography 
                                variant="h2" 
                                className="catalog-teas-title"
                            >
                                all teas.
                            </Typography>
                            
                            {/* Description */}
                            <Typography 
                                variant="body1" 
                                className="catalog-teas-desc"
                            >
                                 hand‑picked whole leaves. small‑batch roasted. ethically sourced.
                            </Typography>

                            {/* Minimal checkbox filter */}
                            <Box className="catalog-filter-checkboxes">
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Checkbox size="small" checked={activeCategoryId === null} onChange={() => setActiveCategoryId(null)} />}
                                        label="all teas"
                                        className="catalog-filter-checkbox"
                                    />
                                    {(categories || []).map((category) => (
                                        <FormControlLabel
                                            key={category.documentId}
                                            control={<Checkbox size="small" checked={activeCategoryId === category.documentId} onChange={() => setActiveCategoryId(category.documentId)} />}
                                            label={category.name.toLowerCase()}
                                            className="catalog-filter-checkbox"
                                        />
                                    ))}
                                </FormGroup>
                            </Box>

                            {/* Search under categories */}
                            <Box className="catalog-search-container">
                                <OutlinedInput
                                    placeholder="search teas by name"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="catalog-input catalog-search-input input input--light"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Box component="svg" width={20} height={20} viewBox="0 0 24 24" fill="none" className="catalog-search-icon">
                                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                                            </Box>
                                        </InputAdornment>
                                    }
                                />
                            </Box>

                            {/* Sort under search */}
                            <Box className="catalog-sort-container">
                                <FormControl className="catalog-sort-form">
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
                                    >
                                        <MenuItem value="ratings">sort by rating</MenuItem>
                                        <MenuItem value="price-low">sort by price</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                    </Box>
                    
                    {/* Product Grid */}
                    <Box className="catalog-center">
                        <Grid container spacing={3} className="catalog-product-grid">
                            {sortedProducts.map((p, idx) => (
                                <Grid key={p.documentId} size={{ xs: 12, sm: 6, md: 4, lg: 3 }} className={`${styles.card} ${styles.show} ${styles[`d${idx % 20}`]}`}>
                                    <ProductCard product={p} variant="catalog" onAddToCart={() => handleAddToCart(p)} />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                    {/* Right spacer */}
                    <Box className="catalog-right" />
                </Box>
            </Box>

    
        
        </Box>
    );
}