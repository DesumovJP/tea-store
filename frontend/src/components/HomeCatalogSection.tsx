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
        <Box className="home-cat-root">
            <Box className="home-cat-container">
                {/* Top filter/search/sort bar */}
                <Box className="home-cat-toolbar">
                    {/* Categories as horizontal scrollable row */}
                    <Box className="home-cat-categories">
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
                    <Box style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <Box className="home-cat-search">
                            <OutlinedInput
                                placeholder="Search by name"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>}
                                className="home-cat-search-input home-cat-input-wide input input--light"
                            />
                        </Box>
                        <FormControl className="home-cat-sort">
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
                <Grid container spacing={2} className="home-cat-grid">
                    {sortedProducts.map((p, idx) => (
                        <Grid key={p.documentId} size={{ xs: 6, sm: 4, md: 3, lg: 3 }} className={`${anim.card} ${anim.show} ${anim[`d${idx % 20}`]}`}>
                            <Link href={`/catalog/${p.slug || p.documentId}`} onClick={(e) => handleNavigateProduct(p, e)} className="catalog-product-card-link">
                                <Box className="home-cat-card">
                                    {/* Top Info */}
                                    <Box>
                                        <Box className="home-cat-card-top">
                                            <Box style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                                <Typography variant="h6" className="home-cat-card-title">
                                                    {p.title}
                                                </Typography>
                                                <Typography variant="body2" className="home-cat-price">
                                                    ${p.price.toFixed(2)}
                                                </Typography>
                                            </Box>
                                            <Button
                                                className="btn btn--outline btn--sm"
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(p); }}
                                            >
                                                + ADD
                                            </Button>
                                        </Box>
                                    </Box>

                                    {/* Image */}
                                    <Box className="home-cat-img-box">
                                        {p.images?.[0]?.url ? (
                                            <CardMedia component="img" image={`${process.env.NEXT_PUBLIC_CMS_URL}${p.images[0].url}`} alt={p.images?.[0]?.alternativeText || p.title} loading="lazy" decoding="async" fetchPriority="low" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                                        ) : (
                                            <Box className="product-card-missing-image">
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
                                        <Box style={{ minHeight: 18, marginBottom: 4 }}>
                                            {(p.reviews?.length || 0) > 0 && (
                                                <StarRating rating={Math.round(calculateAverageRating(p.reviews || []))} reviewCount={p.reviews?.length || 0} size="small" filledColor="#2c2c2c" emptyColor="#9e9e9e" />
                                            )}
                                        </Box>
                                        <Typography variant="body2" className="home-cat-desc">
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


