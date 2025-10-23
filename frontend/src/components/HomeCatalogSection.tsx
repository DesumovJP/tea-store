"use client";

import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProductStore } from "@/store/productStore";
import { FilterButton } from "@/components/FilterButton";
import { calculateAverageRating, fetchProductBySlug, type Product as GqlProduct, type Category as GqlCategory } from "@/lib/graphql";
import { useCartStore } from "@/store/cartStore";
import StarRating from "@/components/StarRating";
import anim from "@/components/CatalogAnimations.module.css";
import { useCachedData } from "@/hooks/useCachedData";

type Product = GqlProduct;
type Category = GqlCategory;

interface HomeCatalogSectionProps {
    // Optional props for backward compatibility, but we'll use cached data
    products?: Product[];
    categories?: Category[];
}

export default function HomeCatalogSection({ products: propProducts, categories: propCategories }: HomeCatalogSectionProps) {
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<string>("ratings");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const addItem = useCartStore((s) => s.addItem);
    const router = useRouter();
    const setProductCache = useProductStore((s) => s.setBySlug);
    
    // Use cached data, fallback to props for backward compatibility
    const {
        products: cachedProducts = [],
        categories: cachedCategories = [],
        isLoading,
        hasError
    } = useCachedData();
    
    const products = (cachedProducts && cachedProducts.length > 0) ? cachedProducts : (propProducts || []);
    const categories = (cachedCategories && cachedCategories.length > 0) ? cachedCategories : (propCategories || []);

    // If Home passed an initial category via URL later, we can hydrate from it here
    useEffect(() => {
        // no-op placeholder for future URL syncing
    }, []);

    const filtered = useMemo(() => {
        return (products || []).filter((p) => {
            const matchesCategory = !activeCategoryId || p.category?.documentId === activeCategoryId;
            const matchesSearch = !searchTerm || p.title.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, activeCategoryId, searchTerm]);

    const sortedProducts = useMemo(() => {
        const copy = [...filtered];
        switch (sortBy) {
            case "price-low":
                return copy.sort((a, b) => a.price - b.price);
            case "price-high":
                return copy.sort((a, b) => b.price - a.price);
            case "newest":
                return copy.sort((a, b) => b.documentId.localeCompare(a.documentId));
            case "ratings":
            default:
                return copy.sort((a, b) => calculateAverageRating(b.reviews || []) - calculateAverageRating(a.reviews || []));
        }
    }, [filtered, sortBy]);

    const handleAddToCart = (product: Product) => {
        addItem({
            id: product.documentId,
            name: product.title,
            price: product.price,
            quantity: 1,
            imageUrl: product.images?.[0]?.url ? `${process.env.NEXT_PUBLIC_CMS_URL}${product.images[0].url}` : undefined,
        });
    };

    const preloadImages = (urls: Array<string | undefined>) => {
        const loaders = urls
            .filter((u): u is string => Boolean(u))
            .map((url) => new Promise<void>((resolve) => {
                const img = new Image();
                img.onload = () => resolve();
                img.onerror = () => resolve();
                img.src = url as string;
            }));
        // Timeout failsafe to not block forever
        const timeout = new Promise<void>((resolve) => setTimeout(resolve, 1500));
        return Promise.race([Promise.all(loaders).then(() => {}), timeout]);
    };

    const handleNavigateProduct = async (product: Product, event?: React.MouseEvent) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        const slug = product.slug || product.documentId;

        // 1) Fetch fresh product data to ensure product page has what it needs
        let fullProduct: Product | null = null;
        try {
            fullProduct = (await fetchProductBySlug(slug)) as unknown as Product | null;
        } catch {
            // ignore network errors; fall back to card product
        }
        const productForCache = fullProduct || product;

        // 2) Put into cache for instant first render
        try {
            if (productForCache?.slug) {
                setProductCache(productForCache.slug, productForCache);
            }
        } catch {}

        // 3) Preload primary images to avoid visible pop-in
        const urls = (productForCache.images || []).slice(0, 3).map((img) => img?.url ? `${process.env.NEXT_PUBLIC_CMS_URL}${img.url}` : undefined);
        await preloadImages(urls);

        // 4) Best-effort prefetch route assets
        try {
            router.prefetch?.(`/catalog/${slug}`);
        } catch {}

        // 5) Navigate only after data + key assets are ready
        router.push(`/catalog/${slug}`);
    };

    return (
        <Box sx={{ bgcolor: 'var(--background)' }}>
            <Box sx={{
                maxWidth: '100%',
                mx: 'auto',
                px: { xs: '1rem', md: '10%', lg: '15%' },
                py: '2rem',
            }}>
                {/* Top filter/search/sort bar */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                    {/* Categories as horizontal scrollable row */}
                    <Box sx={{
                        display: { xs: 'grid', md: 'flex' },
                        gridTemplateColumns: { xs: 'repeat(3, 1fr)', md: 'unset' },
                        gap: 1,
                        justifyContent: { md: 'center' },
                        overflowX: 'visible',
                        pb: 0.5,
                    }}>
                        <FilterButton isActive={activeCategoryId === null} onClick={() => setActiveCategoryId(null)} imageUrl={undefined}>
                            All teas
                        </FilterButton>
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

                    {/* Search + Sort row */}
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                        <Box sx={{ flex: { xs: '1 1 100%', md: '1 0 420px' } }}>
                            <OutlinedInput
                                placeholder="Search by name"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>}
                                sx={{ width: '100%', '& .MuiOutlinedInput-input': { py: '0.9375rem' } }}
                            />
                        </Box>
                        <FormControl sx={{ width: { xs: '100%', sm: 240 }, ml: 'auto' }}>
                            <Select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                displayEmpty
                                MenuProps={{ disableScrollLock: true }}
                                renderValue={(selected) => {
                                    switch (selected) {
                                        case 'ratings': return 'Sort by rating';
                                        case 'price-low': return 'Sort by price';
                                        case 'price-high': return 'Price: high to low';
                                        case 'newest': return 'Newest';
                                        default: return 'Sort by rating';
                                    }
                                }}
                                sx={{
                                    '& .MuiSelect-select': {
                                        textTransform: 'none',
                                        fontWeight: 400,
                                        py: '0.9375rem',
                                        px: '1.25rem',
                                    }
                                }}
                            >
                                <MenuItem value="ratings">Sort by rating</MenuItem>
                                <MenuItem value="price-low">Sort by price</MenuItem>
                                <MenuItem value="price-high">Price: high to low</MenuItem>
                                <MenuItem value="newest">Newest</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                {/* Grid */}
                <Grid container spacing={2} sx={{ minHeight: { xs: '50vh', md: '60vh' } }}>
                    {sortedProducts.map((p, idx) => (
                        <Grid key={p.documentId} size={{ xs: 6, sm: 4, md: 3, lg: 3 }} className={`${anim.card} ${anim.show} ${anim[`d${idx % 20}`]}`}>
                            <Link href={`/catalog/${p.slug || p.documentId}`} onClick={(e) => handleNavigateProduct(p, e)} style={{ textDecoration: 'none', display: 'block' }}>
                                <Box sx={{
                                    bgcolor: '#f5f9f5',
                                    p: 1.25,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 1,
                                    border: '0.0625rem solid transparent',
                                    boxShadow: '0 0.25rem 1rem rgba(0,0,0,0)',
                                    cursor: 'pointer',
                                    transform: 'translateY(0)',
                                    willChange: 'transform, box-shadow',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                                    '&:hover': {
                                        boxShadow: '0 0.5rem 1.5rem rgba(0,0,0,0.12)',
                                        transform: 'translateY(-2px)',
                                        borderColor: 'rgba(59,77,60,0.25)'
                                    }
                                }}>
                                    {/* Top Info */}
                                    <Box sx={{ mb: { xs: 0.75, sm: 0.5 }, mt: { xs: 0.25, sm: 0.25 } }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 0.25, minHeight: 30 }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                                <Typography variant="h6" sx={{ fontSize: { xs: '0.8rem', sm: '0.825rem' }, fontWeight: 600, lineHeight: 1.1, color: '#2c2c2c', letterSpacing: '0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {p.title}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#6f6f6f', fontSize: { xs: '0.725rem', sm: '0.75rem' }, mt: 0.25 }}>
                                                    ${p.price.toFixed(2)}
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(p); }}
                                                sx={{ minWidth: 56, maxWidth: 72, flexShrink: 0, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 2, borderColor: 'rgba(0,0,0,0.28)', color: '#2c2c2c', textTransform: 'none', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.08em', borderRadius: 1, bgcolor: 'transparent', transition: 'all 0.2s ease-in-out', '&:hover': { borderColor: '#3b4d3c', backgroundColor: '#3b4d3c', color: '#ffffff' } }}
                                            >
                                                + ADD
                                            </Button>
                                        </Box>
                                    </Box>

                                    {/* Image */}
                                    <Box sx={{ width: '100%', height: { xs: '10rem', sm: '12rem', md: '13rem' }, bgcolor: '#f5f9f5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', mb: 0.75 }}>
                                        {p.images?.[0]?.url ? (
                                            <CardMedia component="img" image={`${process.env.NEXT_PUBLIC_CMS_URL}${p.images[0].url}`} alt={p.images?.[0]?.alternativeText || p.title} loading="lazy" decoding="async" fetchPriority="low" sx={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                                        ) : (
                                            <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b4d3c', bgcolor: 'transparent' }}>
                                                <Box component="svg" width={88} height={88} viewBox="0 0 64 64" fill="none">
                                                    <circle cx="32" cy="32" r="30" fill="#f5f9f5"/>
                                                    <g fill="currentColor">
                                                        <path d="M10 24c0-1.657 1.343-3 3-3h28c1.657 0 3 1.343 3 3v8c0 7.732-6.268 14-14 14h-6C16.268 46 10 39.732 10 32v-8z"/>
                                                        <path d="M44 26h4a6 6 0 0 1 0 12h-2.5a2 2 0 1 1 0-4H48a2 2 0 0 0 0-4h-4v-4z"/>
                                                        <path d="M12 50h40a2 2 0 1 1 0 4H12a2 2 0 1 1 0-4z"/>
                                                        <path d="M24 10c1 2-2 4-2 6s3 4 2 6c-1-2-4-4-4-6s3-4 4-6zm10 0c1 2-2 4-2 6s3 4 2 6c-1-2-4-4-4-6s3-4 4-6z"/>
                                                    </g>
                                                </Box>
                                            </Box>
                                        )}
                                    </Box>

                                    {/* Bottom info */}
                                    <Box>
                                        <Box sx={{ minHeight: 18, mb: 0.25 }}>
                                            {(p.reviews?.length || 0) > 0 && (
                                                <StarRating rating={Math.round(calculateAverageRating(p.reviews || []))} reviewCount={p.reviews?.length || 0} size="small" filledColor="#2c2c2c" emptyColor="#9e9e9e" />
                                            )}
                                        </Box>
                                        <Typography variant="body2" sx={{ fontSize: { xs: '0.675rem', sm: '0.7rem' }, color: 'text.secondary', mb: 0.25, minHeight: '2.8em', lineHeight: 1.1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {p.shortDescription || '\u00A0'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Link>
                        </Grid>
                    ))}
                </Grid>

                
            </Box>
        </Box>
    );
}


