"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchProductBySlug, calculateAverageRating } from "@/lib/graphql";
import { useProductStore } from "@/store/productStore";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import imgAnim from "@/components/ProductImageAnim.module.css";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useCartStore } from "@/store/cartStore";
import { triggerGlobalCartAnimation } from "@/hooks/useCartAnimation";
// import StarRating from "@/components/StarRating";
import ReviewList from "@/components/ReviewList";
import AddReview from "@/components/AddReview";
import PageSkeleton from "@/components/PageSkeleton";
import { Review } from "@/types/review";

type Product = {
    documentId: string;
    slug: string;
    title: string;
    description?: string | null;
    price: number;
    images?: { url: string; alternativeText?: string }[];
    category?: { documentId: string; name: string } | null;
    reviews?: Review[];
};

export default function ProductPage() {
    const params = useParams<{ productId: string }>();
    // const router = useRouter();
    const addItem = useCartStore((s) => s.addItem);
    const getCached = useProductStore((s) => s.getBySlug);
    const setCached = useProductStore((s) => s.setBySlug);
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [refreshReviews, setRefreshReviews] = useState(0);
    const [isDescExpanded, setIsDescExpanded] = useState(false);
    const [currentImageIdx, setCurrentImageIdx] = useState(0);

    // Add product page class to body
    useEffect(() => {
        document.body.classList.add('product-page');
        return () => {
            document.body.classList.remove('product-page');
        };
    }, []);

    useEffect(() => {
        const slug = params?.productId as string;
        if (!slug) return;
        (async () => {
            // 1) Try cache first to avoid flicker
            const cached = getCached(slug) as unknown as Product | undefined;
            if (cached) {
                setProduct(cached);
            }
            // 2) Always fetch latest in background and update cache/state
            const data = await fetchProductBySlug(slug);
            if (data) {
                setCached(slug, data);
                setProduct(data as unknown as Product);
            }
        })();
    }, [params, refreshReviews, getCached, setCached]);

    if (!product) return <PageSkeleton variant="product" />;

    const toUrl = (url?: string) => (url ? `${process.env.NEXT_PUBLIC_CMS_URL}${url}` : undefined);
    const sliderImages = (product.images || [])
        .map(img => ({ url: toUrl(img.url), alt: img.alternativeText || product.title }))
        .slice(0, 4);

    const handleAdd = () => {
        if (product) {
            addItem({
                id: product.documentId,
                name: product.title,
                price: product.price,
                quantity: quantity,
                imageUrl: product.images?.[0]?.url ? `${process.env.NEXT_PUBLIC_CMS_URL}${product.images[0].url}` : undefined,
                categoryName: product.category?.name,
            });
            
            // Запускаємо анімацію кошика
            triggerGlobalCartAnimation();
        }
    };

    const handleQuantityChange = (delta: number) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    return (
        <Box className="product-page-root">
            <Box className="product-page-container">
                    {/* Breadcrumb Navigation */}
                    <Box className="product-breadcrumbs">
                        <Link href="/" className="link-unstyled">
                            <Typography variant="body2" className="breadcrumb-text">
                                home
                            </Typography>
                        </Link>
                        <ChevronRightIcon className="icon-chevron" />
                        <Link href="/catalog" className="link-unstyled">
                            <Typography variant="body2" className="breadcrumb-text">
                                catalog
                            </Typography>
                        </Link>
                        <ChevronRightIcon className="icon-chevron" />
                        {product?.category && (
                            <>
                                <Link href={`/catalog?category=${product.category.documentId}`} className="link-unstyled">
                                    <Typography variant="body2" className="breadcrumb-text">
                                        {product.category.name}
                                    </Typography>
                                </Link>
                                <ChevronRightIcon className="icon-chevron" />
                            </>
                        )}
                        <Typography variant="body2" className="breadcrumb-text">
                            {product?.title || 'product'}
                        </Typography>
                    </Box>

                    {/* Main Product Block - Clean */}
                <Box className="product-page-card product-page-card-padding">
                    <Grid container spacing={4} className="product-page-card-content">
                        {/* Left Panel - Product Image */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box className="product-page-image-panel">
                                    {/* Main Image Container */}
                                    <Box className="product-card-image-container product-image-main">
                                {sliderImages.length > 0 ? (
                                    <>
                                        {/* Current Slide */}
                                        <CardMedia
                                            key={currentImageIdx}
                                            component="img"
                                            image={sliderImages[currentImageIdx].url as string}
                                            alt={sliderImages[currentImageIdx].alt as string}
                                            loading="lazy"
                                            decoding="async"
                                            fetchPriority="low"
                                            className={`product-card-image ${imgAnim.imgEnter}`}
                                            style={{}}
                                            classes={{ root: 'product-image-absolute' as any }}
                                        />
                                    </>
                                ) : (
                                    <Box className="product-image-empty">
                                        <Box component="svg" width={120} height={120} viewBox="0 0 64 64" fill="none">
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

                                {/* Thumbnails Container - Only show if more than 1 image */}
                                {sliderImages.length > 1 && (
                                    <Box className="product-thumbs">
                                    {sliderImages.map((img, idx) => (
                                        <Box
                                            key={`${img.url}-${idx}`}
                                            onClick={() => setCurrentImageIdx(idx)}
                                            onMouseDown={() => setCurrentImageIdx(idx)}
                                            onTouchStart={() => setCurrentImageIdx(idx)}
                                            className={`product-thumb ${idx === currentImageIdx ? 'product-thumb--active' : ''}`}
                                        >
                                            <CardMedia
                                                component="img"
                                                image={img.url as string}
                                                alt={img.alt as string}
                                                loading="lazy"
                                                decoding="async"
                                                fetchPriority="low"
                                                className="product-card-image"
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    </Grid>
                    
                            {/* Right Panel - Product Info */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box className="product-info-panel">
                                    {/* Top Section - Header, Price, Description */}
                                    <Box className="product-header">
                                        {/* Header Section */}
                                        <Box className="product-header">
                            <Typography 
                                variant="body2" 
                                className="product-category"
                            >
                                {product.category?.name || 'blends'}
                            </Typography>
                            
                            <Typography 
                                variant="h1" 
                                className="hipster-heading product-title"
                            >
                                {product.title}
                            </Typography>
                                        </Box>
                            
                            {/* Price - 3D Style */}
                                        <Box className="product-price-box">
                                <Typography 
                                    variant="h3" 
                                    className="hipster-heading product-price"
                                >
                                    ${product.price.toFixed(2)}
                                </Typography>
                                            <Typography 
                                                variant="body2" 
                                                className="product-price-unit"
                                            >
                                                / 100g
                                            </Typography>
                            </Box>
                            
                                        {/* Description Section - Simple Gradient */}
                            <Typography 
                                variant="body1" 
                                className={`product-description ${isDescExpanded ? 'product-description--expanded' : 'product-description--clamp'}`}
                            >
                                {product.description || "hand‑picked whole leaves with a clean, naturally sweet finish. small‑batch roasted for clarity in the cup."}
                            </Typography>
                            {product.description && product.description.length > 280 && (
                                <Button className="product-description-toggle" onClick={() => setIsDescExpanded(v => !v)}>
                                    {isDescExpanded ? 'show less' : 'read more'}
                                </Button>
                            )}

                            {/* Highlights */}
                            <Box className="product-highlights">
                                <div className="product-highlight-item">
                                    <span className="product-highlight-icon" aria-hidden>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    </span>
                                    <span className="product-highlight-text">ethically sourced from small farms</span>
                                </div>
                                <div className="product-highlight-item">
                                    <span className="product-highlight-icon" aria-hidden>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 1l3 7h7l-5.5 4 2 7L12 16l-6.5 3 2-7L2 8h7l3-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    </span>
                                    <span className="product-highlight-text">fresh roast & packed for peak flavour</span>
                                </div>
                                <div className="product-highlight-item">
                                    <span className="product-highlight-icon" aria-hidden>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 12l2-2 4 4 10-10 2 2-12 12-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    </span>
                                    <span className="product-highlight-text">plastic‑free, recyclable packaging</span>
                                </div>
                                <div className="product-highlight-item">
                                    <span className="product-highlight-icon" aria-hidden>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    </span>
                                    <span className="product-highlight-text">30‑day satisfaction guarantee</span>
                                </div>
                            </Box>
                                    </Box>
                                    
                                    {/* Bottom Section - Quantity and Actions */}
                                    <Box className="product-actions">
                                {/* Quantity Selector - Clean */}
                                        <Box className="product-qty-row">
                                <Box className="product-qty-box">
                                    <IconButton 
                                        onClick={() => handleQuantityChange(-1)}
                                        className="product-qty-btn product-qty-btn--left"
                                    >
                                        <RemoveIcon fontSize="small" />
                                    </IconButton>
                                    
                                    <Box className="product-qty-count">
                                        <Typography className="product-qty-count-text">
                                            {quantity.toString().padStart(2, '0')}
                                        </Typography>
                                    </Box>
                                    
                                    <IconButton 
                                        onClick={() => handleQuantityChange(1)}
                                        className="product-qty-btn"
                                    >
                                        <AddIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                                
                                <Typography 
                                    variant="body2" 
                                    className="product-qty-hint"
                                >
                                    {`makes ~${quantity * 16} ${quantity * 16 === 1 ? 'cup' : 'cups'}`}
                                </Typography>
                            </Box>
                            
                                        {/* Add to Cart Button - 3D Style */}
                                <Button
                                            className="btn btn--dark btn--block product-card-add-button product-add-button-wide"
                                    onClick={handleAdd}
                                        >
                                            add to cart
                                        </Button>
                                        </Box>
                        </Box>
                    </Grid>
                </Grid>
                </Box>

                {/* Product marketing block */}
                <Box className="product-marketing">
                    <Box className="product-marketing-wrap">
                        <Typography variant="h5" className="product-marketing-title">why choose guru tea?</Typography>
                        <Box className="product-marketing-grid">
                            <Box className="product-marketing-card">
                                <Box className="product-marketing-icon" aria-hidden>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </Box>
                                <Typography className="product-marketing-head">free shipping over $50</Typography>
                                <Typography className="product-marketing-text">fast dispatch, tracked delivery on every order.</Typography>
                            </Box>
                            <Box className="product-marketing-card">
                                <Box className="product-marketing-icon" aria-hidden>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 1l3 7h7l-5.5 4 2 7L12 16l-6.5 3 2-7L2 8h7l3-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </Box>
                                <Typography className="product-marketing-head">4.8★ average rating</Typography>
                                <Typography className="product-marketing-text">trusted by tea lovers — reviews you can taste.</Typography>
                            </Box>
                            <Box className="product-marketing-card">
                                <Box className="product-marketing-icon" aria-hidden>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 12l2-2 4 4 10-10 2 2-12 12-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </Box>
                                <Typography className="product-marketing-head">ethically sourced</Typography>
                                <Typography className="product-marketing-text">we work directly with small farms at fair prices.</Typography>
                            </Box>
                            <Box className="product-marketing-card">
                                <Box className="product-marketing-icon" aria-hidden>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </Box>
                                <Typography className="product-marketing-head">30‑day taste guarantee</Typography>
                                <Typography className="product-marketing-text">not in love? we’ll make it right or refund you.</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                
                {/* Reviews Section - Clean */}
                <Box className="product-reviews-section">
                    <ReviewList 
                        reviews={product.reviews || []}
                        averageRating={calculateAverageRating(product.reviews || [])}
                        totalReviews={product.reviews?.length || 0}
                    />
                    
                    <AddReview 
                        productId={product.documentId}
                        onReviewAdded={() => setRefreshReviews(prev => prev + 1)}
                    />
                </Box>
            </Box>
        </Box>
    );
}
