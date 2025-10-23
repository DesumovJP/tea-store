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
        <Box sx={{ 
            bgcolor: '#ffffff',
            minHeight: '100vh',
            position: 'relative'
        }}>
            <Box sx={{ 
                maxWidth: '100%', 
                mx: 'auto', 
                px: { xs: '1.25rem', sm: '15%', md: '25%' }, 
                py: { xs: '1.875rem', md: '5rem' },
                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif'
            }}>
                    {/* Breadcrumb Navigation */}
                    <Box sx={{ 
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontSize: '0.875rem',
                        color: '#1a1a1a',
                        fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                        letterSpacing: '-0.02em',
                        textTransform: 'lowercase',
                        fontWeight: 300
                    }}>
                        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Typography variant="body2" sx={{ 
                                fontSize: '0.875rem', 
                                color: '#1a1a1a',
                                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                letterSpacing: '-0.02em',
                                textTransform: 'lowercase',
                                fontWeight: 300
                            }}>
                                home
                            </Typography>
                        </Link>
                        <ChevronRightIcon sx={{ fontSize: '1rem', color: '#9e9e9e' }} />
                        <Link href="/catalog" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Typography variant="body2" sx={{ 
                                fontSize: '0.875rem', 
                                color: '#1a1a1a',
                                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                letterSpacing: '-0.02em',
                                textTransform: 'lowercase',
                                fontWeight: 300
                            }}>
                                catalog
                            </Typography>
                        </Link>
                        <ChevronRightIcon sx={{ fontSize: '1rem', color: '#9e9e9e' }} />
                        {product?.category && (
                            <>
                                <Link href={`/catalog?category=${product.category.documentId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <Typography variant="body2" sx={{ 
                                        fontSize: '0.875rem', 
                                        color: '#1a1a1a',
                                        fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                        letterSpacing: '-0.02em',
                                        textTransform: 'lowercase',
                                        fontWeight: 300
                                    }}>
                                        {product.category.name}
                                    </Typography>
                                </Link>
                                <ChevronRightIcon sx={{ fontSize: '1rem', color: '#9e9e9e' }} />
                            </>
                        )}
                        <Typography variant="body2" sx={{ 
                            fontSize: '0.875rem', 
                            color: '#1a1a1a', 
                            fontWeight: 300,
                            fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                            letterSpacing: '-0.02em',
                            textTransform: 'lowercase'
                        }}>
                            {product?.title || 'product'}
                        </Typography>
                    </Box>

                    {/* Main Product Block - Clean */}
                <Box className="product-page-card" sx={{ 
                    border: '1px solid #e0e0e0',
                    borderRadius: 0,
                    p: { xs: '1.5rem', md: '2rem' },
                    bgcolor: '#ffffff',
                    boxShadow: '0 0.125rem 0.5rem rgba(0, 0, 0, 0.08)',
                    mb: 4
                }}>
                    <Grid container spacing={4} className="product-page-card-content" sx={{ height: 'auto' }}>
                        {/* Left Panel - Product Image */}
                        <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 1, md: 1 } }}>
                            <Box className="product-page-image-panel">
                                    {/* Main Image Container */}
                                    <Box className="product-card-image-container" sx={{ 
                                        width: '100%',
                                        height: { xs: '25rem', md: '35rem' },
                                        position: 'relative',
                                        overflow: 'hidden',
                                        borderRadius: '0.5rem',
                                        boxShadow: 'none !important',
                                        flex: 1,
                                        backgroundColor: '#ffffff !important',
                                        border: 'none !important'
                                    }}>
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
                                            sx={{ 
                                                height: '100%',
                                                width: '100%', 
                                                objectFit: 'contain',
                                                objectPosition: 'center',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                transition: 'opacity 0.3s ease'
                                            }}
                                        />
                                    </>
                                ) : (
                                    <Box sx={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        color: '#3b4d3c',
                                        bgcolor: 'grey.50',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0
                                    }}>
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
                                    <Box sx={{ 
                                        display: 'flex',
                                        gap: 1,
                                        justifyContent: 'center',
                                        flexWrap: 'wrap'
                                    }}>
                                    {sliderImages.map((img, idx) => (
                                        <Box
                                            key={`${img.url}-${idx}`}
                                            onClick={() => setCurrentImageIdx(idx)}
                                            onMouseDown={() => setCurrentImageIdx(idx)}
                                            onTouchStart={() => setCurrentImageIdx(idx)}
                                            className="product-card"
                                            sx={{
                                                width: { xs: '3.5rem', md: '4.5rem' },
                                                height: { xs: '3.5rem', md: '4.5rem' },
                                                border: '1px solid',
                                                borderColor: idx === currentImageIdx ? '#3b4d3c' : '#e0e0e0',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                '&:hover': {
                                                    transform: 'translateY(-0.25rem)',
                                                    boxShadow: '0 0.5rem 1.5625rem rgba(0, 0, 0, 0.15)',
                                                    borderColor: '#3b4d3c'
                                                }
                                            }}
                                        >
                                            <CardMedia
                                                component="img"
                                                image={img.url as string}
                                                alt={img.alt as string}
                                                loading="lazy"
                                                decoding="async"
                                                fetchPriority="low"
                                                className="product-card-image"
                                                sx={{
                                                    maxWidth: '100%',
                                                    maxHeight: '100%',
                                                    objectFit: 'contain'
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    </Grid>
                    
                            {/* Right Panel - Product Info */}
                            <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 2, md: 2 } }}>
                                <Box sx={{ 
                                    pl: { md: 4 },
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    gap: 2
                                }}>
                                    {/* Top Section - Header, Price, Description */}
                                    <Box sx={{ 
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2
                                    }}>
                                        {/* Header Section */}
                                        <Box sx={{ 
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 0.5
                                        }}>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    fontSize: '0.75rem',
                                    fontWeight: 300,
                                    textTransform: 'lowercase',
                                    letterSpacing: '-0.02em',
                                    color: '#1a1a1a',
                                    fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif'
                                }}
                            >
                                {product.category?.name || 'blends'}
                            </Typography>
                            
                            <Typography 
                                variant="h1" 
                                sx={{ 
                                    fontSize: { xs: '2rem', md: '2.5rem' },
                                    fontWeight: 300,
                                    fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                    letterSpacing: '-0.02em',
                                    textTransform: 'lowercase',
                                    lineHeight: 0.9,
                                    color: '#1a1a1a'
                                }}
                            >
                                {product.title}
                            </Typography>
                                        </Box>
                            
                            {/* Price - 3D Style */}
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'baseline', 
                                            gap: 1, 
                                            bgcolor: '#f8f9fa',
                                            p: '1rem 1.25rem',
                                            borderRadius: 0,
                                            border: '2px solid #2c2c2c',
                                            boxShadow: '2px 2px 0px #66bb6a'
                                        }}>
                                <Typography 
                                    variant="h3" 
                                    sx={{ 
                                        fontSize: { xs: '1.25rem', md: '1.5rem' },
                                        fontWeight: 300,
                                        color: '#1a1a1a',
                                        fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                        letterSpacing: '-0.02em'
                                    }}
                                >
                                    ${product.price.toFixed(2)}
                                </Typography>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    color: '#1a1a1a',
                                                    fontWeight: 300,
                                                    fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                    letterSpacing: '-0.02em',
                                                    textTransform: 'lowercase'
                                                }}
                                            >
                                                / 100g
                                            </Typography>
                            </Box>
                            
                                        {/* Description Section - Simple Gradient */}
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    fontSize: '0.875rem',
                                    lineHeight: 1.6,
                                    fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                    letterSpacing: '-0.02em',
                                    textTransform: 'lowercase',
                                    fontWeight: 300,
                                    color: '#4a4a4a'
                                }}
                            >
                                {product.description || "a proprietary blend of cripple creek whole-leaf ceylon, certified organic herbs, and spices. a chai-lover's dream."}
                            </Typography>
                                    </Box>
                                    
                                    {/* Bottom Section - Quantity and Actions */}
                                    <Box sx={{ 
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2
                                    }}>
                                {/* Quantity Selector - Clean */}
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 2
                                        }}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 0,
                                    bgcolor: '#ffffff'
                                }}>
                                    <IconButton 
                                        onClick={() => handleQuantityChange(-1)}
                                        sx={{ 
                                            borderRadius: 0,
                                            borderRight: '1px solid #e0e0e0',
                                            minWidth: '2.5rem',
                                            height: '2.5rem',
                                            color: '#1a1a1a',
                                            '&:hover': {
                                                bgcolor: '#f8f9fa'
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
                                        borderRight: '1px solid #e0e0e0'
                                    }}>
                                        <Typography sx={{ 
                                            fontSize: '0.875rem', 
                                            fontWeight: 500,
                                            fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                            color: '#1a1a1a'
                                        }}>
                                            {quantity.toString().padStart(2, '0')}
                                        </Typography>
                                    </Box>
                                    
                                    <IconButton 
                                        onClick={() => handleQuantityChange(1)}
                                        sx={{ 
                                            borderRadius: 0,
                                            minWidth: '2.5rem',
                                            height: '2.5rem',
                                            color: '#1a1a1a',
                                            '&:hover': {
                                                bgcolor: '#f8f9fa'
                                            }
                                        }}
                                    >
                                        <AddIcon sx={{ fontSize: '1rem' }} />
                                    </IconButton>
                                </Box>
                                
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        fontSize: '0.75rem',
                                                    color: '#6b7c6b',
                                                    fontWeight: 500
                                    }}
                                >
                                    Makes ~16 cups
                                </Typography>
                            </Box>
                            
                                        {/* Add to Cart Button - 3D Style */}
                                <Button
                                            className="product-card-add-button"
                                    onClick={handleAdd}
                                    sx={{
                                        fontSize: '0.875rem',
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        px: '2.5rem',
                                        py: '1.25rem',
                                        width: '100%',
                                        justifyContent: 'center',
                                        backgroundColor: '#1a1a1a',
                                        color: '#ffffff',
                                        border: '2px solid #2c2c2c',
                                        borderRadius: 0,
                                        boxShadow: '3px 3px 0px #66bb6a',
                                        fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                        '&:hover': {
                                            backgroundColor: '#66bb6a',
                                            color: '#ffffff',
                                            borderColor: '#66bb6a',
                                            transform: 'translateY(-1px) translateX(-1px)',
                                            boxShadow: '4px 4px 0px #1a1a1a'
                                        },
                                        '&:active': {
                                            transform: 'translateY(0) translateX(0)',
                                            boxShadow: '3px 3px 0px #66bb6a'
                                        }
                                    }}
                                        >
                                            + add to cart
                                        </Button>
                                        </Box>
                        </Box>
                    </Grid>
                </Grid>
                </Box>
                
                {/* Reviews Section - Clean */}
                <Box sx={{ 
                    mt: 6,
                    border: '1px solid #e0e0e0',
                    borderRadius: 0,
                    p: '1.5rem',
                    bgcolor: '#ffffff',
                    boxShadow: '0 0.125rem 0.5rem rgba(0, 0, 0, 0.08)'
                }}>
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
