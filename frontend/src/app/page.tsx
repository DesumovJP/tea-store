import { Box, Typography, Grid, Button } from "@mui/material";
import Link from "next/link";
import { fetchBlockImgs, fetchLatestReviews, fetchProducts } from "@/lib/graphql";
import CategoryCarousel from "@/components/CategoryCarousel";
import AboutBanner from "@/components/AboutBanner";
import HappyCustomers from "@/components/HappyCustomers";
import MarketingIntro from "@/components/MarketingIntro";
import TeaProcess from "@/components/TeaProcess";
import StarRating from "@/components/StarRating";
import AddToCartButton from "@/components/AddToCartButton";
import ToTopButton from "@/components/ToTopButton";
import AnimatedSection from "@/components/AnimatedSection";
import { calculateAverageRating } from "@/lib/graphql";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
    title: "guru tea - home",
};

export default async function Home() {
    // Only fetch data that's not cached (blockImgs and reviews)
    let blockImgs: import("@/lib/graphql").BlockImg[] = [];
    let topReviews: import("@/lib/graphql").Review[] = [];
    let allProducts: import("@/lib/graphql").Product[] = [];
    try {
        [blockImgs, topReviews, allProducts] = await Promise.all([
            fetchBlockImgs(),
            fetchLatestReviews(6),
            fetchProducts(),
        ]);
    } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to empty arrays if fetch fails
        blockImgs = [];
        topReviews = [];
        allProducts = [];
    }

    // Get top 4 products with most reviews
    const topProducts = allProducts
        .filter(product => product.reviews && product.reviews.length > 0)
        .sort((a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0))
        .slice(0, 4);

    // Categories will be handled by the cached data in HomeCatalogSection

    // Build hero slides from fetched files; sort to stabilize order
    const slogans = [
        { headline: "Welcome to Guru Tea", ctaHref: "/catalog", ctaLabel: "Explore Collection", paragraphs: [
            "Discover the finest selection of premium teas from around the world."
        ] },
        { headline: "Tea is the Elixir of life.", ctaHref: "/catalog", ctaLabel: "Shop now", paragraphs: [
            "Hand‑picked whole leaves sourced from family gardens across the highlands."
        ] },
        { headline: "Discover premium blends", ctaHref: "/catalog", ctaLabel: "Shop now", paragraphs: [
            "Signature blends crafted by our tea masters for balance, depth and sweetness."
        ] },
        { headline: "From garden to cup", ctaHref: "/catalog", ctaLabel: "Shop now", paragraphs: [
            "We trace each lot back to its origin and pay growers fairly."
        ] },
    ];
    const heroSlidesFetched = (blockImgs || [])
        .filter((b) => [1,2,3].includes(Number(b.ImgId)))
        .sort((a, b) => Number(a.ImgId) - Number(b.ImgId))
        .map((b, idx) => ({
            src: `${process.env.NEXT_PUBLIC_CMS_URL}${b.image?.url ?? ''}`,
            alt: b.image?.alternativeText ?? `Hero ${b.ImgId}`,
            headline: slogans[idx]?.headline ?? "Discover premium blends",
            paragraphs: slogans[idx]?.paragraphs,
            ctaHref: slogans[idx]?.ctaHref ?? "/catalog",
            ctaLabel: slogans[idx]?.ctaLabel ?? "Shop now",
        }));
    const heroSlidesFallback = [
        `/uploads/2148786604_5634526dc5.jpg`,
        `/uploads/Y_Ai_YO_7_2776caa723.gif`,
        `/uploads/pexels_photo_6545418_3b96b69050.jpeg`,
        `/uploads/2148124111_307a9dba0f.jpg`,
    ].map((path, idx) => ({
        src: `${process.env.NEXT_PUBLIC_CMS_URL}${path}`,
        alt: `Hero ${idx+1}`,
        headline: slogans[idx]?.headline ?? "Discover premium blends",
        paragraphs: slogans[idx]?.paragraphs,
        ctaHref: slogans[idx]?.ctaHref ?? "/catalog",
        ctaLabel: slogans[idx]?.ctaLabel ?? "Shop now",
    }));

    const heroSlides = heroSlidesFallback;

    // About image (ImgId = 6) with hashed fallback
    const aboutBlock = (blockImgs || []).find((b) => Number(b.ImgId) === 6);
    const aboutImgUrl = `http://localhost:1337/uploads/giphy_a278bd7a8c.gif`;
    console.log('About image URL:', aboutImgUrl);
    // const isAboutFromStrapi = Boolean(aboutBlock?.image?.url);

    // Category image override (ImgId = 8) for all categories
    const categoryImgBlock = (blockImgs || []).find((b) => Number(b.ImgId) === 8);
    const categoryImgUrlOverride = categoryImgBlock?.image?.url
        ? `${process.env.NEXT_PUBLIC_CMS_URL}${categoryImgBlock.image.url}`
        : undefined;
    const categoryImgAltOverride = categoryImgBlock?.image?.alternativeText ?? undefined;

    // Removed FeatureTriplet section from Home

    return (
        <Box sx={{ bgcolor: "white" }}>
            {/* Hero Grid */}
            <Box sx={{ mt: { xs: "2rem", sm: "3rem" }, px: { xs: '1rem', md: '10%', lg: '15%' }, maxWidth: '100vw', overflow: 'hidden' }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: { xs: 2, md: 3 },
                        maxWidth: '100%'
                    }}
                >
                    {/* Full width hero image */}
                    <Box
                        component={Link}
                        href={heroSlides[0]?.ctaHref || "/catalog"}
                        sx={{
                            position: "relative",
                            height: "50vh",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textDecoration: "none",
                            overflow: "hidden",
                            cursor: "pointer",
                            borderRadius: 2,
                            border: "1px solid #e0e0e0",
                            boxShadow: "0 0.125rem 0.5rem rgba(0, 0, 0, 0.08)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                boxShadow: "0 0.5rem 1.5625rem rgba(76, 175, 80, 0.2)",
                                borderColor: "#66bb6a",
                                "& img": {
                                    filter: "brightness(1) blur(0px) saturate(1)",
                                    transform: "scale(1.05)",
                                },
                            },
                        }}
                    >
                        <Box
                            component="img"
                            src={heroSlides[0]?.src}
                            alt={heroSlides[0]?.alt}
                            sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                filter: "brightness(0.7) blur(1px) saturate(0.6)",
                                transition: "all 0.3s ease",
                            }}
                        />
                        <Box
                            sx={{
                                position: "absolute",
                                inset: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2), rgba(0,0,0,0.4))",
                                textAlign: "center",
                                px: 3,
                            }}
                        >
                            <Box>
                                {heroSlides[0]?.headline && (
                                    <Typography
                                        variant="h4"
                                        className="hipster-heading white-text-shadow"
                                        sx={{
                                            color: "#ffffff !important",
                                            fontWeight: 300,
                                            fontSize: { xs: "1.5rem", md: "2rem", lg: "2.5rem" },
                                            mb: 2,
                                            textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                                            fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                            letterSpacing: '-0.02em',
                                            textTransform: 'lowercase',
                                            lineHeight: 0.9
                                        }}
                                    >
                                        {heroSlides[0].headline}
                                    </Typography>
                                )}
                                {heroSlides[0]?.paragraphs && heroSlides[0].paragraphs.length > 0 && (
                                    <Typography
                                        variant="body1"
                                        className="hipster-heading white-text-shadow"
                                        sx={{
                                            color: "#ffffff !important",
                                            fontSize: { xs: "1rem", md: "1.125rem" },
                                            mb: 2,
                                            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                                            maxWidth: "90%",
                                            mx: "auto",
                                            fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                            letterSpacing: '-0.02em',
                                            textTransform: 'lowercase',
                                            fontWeight: 300
                                        }}
                                    >
                                        {heroSlides[0].paragraphs[0]}
                                    </Typography>
                                )}
                                {heroSlides[0]?.ctaLabel && (
                                    <Typography
                                        variant="button"
                                        className="hipster-heading white-text-shadow"
                                        sx={{
                                            color: "#ffffff !important",
                                            fontSize: "1rem",
                                            fontWeight: 300,
                                            textDecoration: "underline",
                                            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                                            fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                            letterSpacing: '-0.02em',
                                            textTransform: 'lowercase'
                                        }}
                                    >
                                        {heroSlides[0].ctaLabel}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Box>

                    {/* Two 50% width images below */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                            gap: { xs: 2, md: 3 },
                            height: "30vh",
                        }}
                    >
                        {heroSlides.slice(1, 3).map((slide, index) => (
                            <Box
                                key={index + 1}
                            component={Link}
                            href={slide.ctaHref || "/catalog"}
                            sx={{
                                position: "relative",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                textDecoration: "none",
                                overflow: "hidden",
                                cursor: "pointer",
                                borderRadius: 2,
                                border: "1px solid #e0e0e0",
                                boxShadow: "0 0.125rem 0.5rem rgba(0, 0, 0, 0.08)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    boxShadow: "0 0.5rem 1.5625rem rgba(76, 175, 80, 0.2)",
                                    borderColor: "#66bb6a",
                                        "& img": {
                                            filter: "brightness(1) blur(0px) saturate(1)",
                                            transform: "scale(1.05)",
                                        },
                                },
                            }}
                        >
                            <Box
                                component="img"
                                src={slide.src}
                                alt={slide.alt}
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                        filter: "brightness(0.7) blur(1px) saturate(0.6)",
                                        transition: "all 0.3s ease",
                                        animationPlayState: "paused",
                                        "&:hover": {
                                            animationPlayState: "running",
                                            animationDuration: "3s"
                                        }
                                }}
                            />
                            <Box
                                sx={{
                                    position: "absolute",
                                    inset: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2), rgba(0,0,0,0.4))",
                                    textAlign: "center",
                                    px: 3,
                                }}
                            >
                                <Box>
                                    {slide.headline && (
                                        <Typography
                                            variant="h4"
                                            className="hipster-heading white-text-shadow"
                                            sx={{
                                                color: "#ffffff !important",
                                                fontWeight: 300,
                                                fontSize: { xs: "1.25rem", md: "1.5rem", lg: "1.75rem" },
                                                mb: 2,
                                                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                letterSpacing: '-0.02em',
                                                textTransform: 'lowercase',
                                                lineHeight: 0.9
                                            }}
                                        >
                                            {slide.headline}
                                        </Typography>
                                    )}
                                    {slide.paragraphs && slide.paragraphs.length > 0 && (
                                        <Typography
                                            variant="body1"
                                            className="hipster-heading white-text-shadow"
                                            sx={{
                                                color: "#ffffff !important",
                                                fontSize: { xs: "0.875rem", md: "1rem" },
                                                mb: 2,
                                                maxWidth: "90%",
                                                mx: "auto",
                                                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                letterSpacing: '-0.02em',
                                                textTransform: 'lowercase',
                                                fontWeight: 300
                                            }}
                                        >
                                            {slide.paragraphs[0]}
                                        </Typography>
                                    )}
                                    {slide.ctaLabel && (
                                        <Typography
                                            variant="button"
                                            className="hipster-heading white-text-shadow"
                                            sx={{
                                                color: "#ffffff !important",
                                                fontSize: "0.875rem",
                                                fontWeight: 300,
                                                textDecoration: "underline",
                                                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                letterSpacing: '-0.02em',
                                                textTransform: 'lowercase'
                                            }}
                                        >
                                            {slide.ctaLabel}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    ))}
                    </Box>
                </Box>
            </Box>


            {/* Our Premium Tea carousel — temporarily disabled */}
            {/**
            <CategoryCarousel
                items={categories.map((c) => ({
                    name: c.name,
                    href: `/catalog?category=${encodeURIComponent(c.name)}`,
                    image: categoryImgUrlOverride || c.imageUrl,
                    alt: categoryImgAltOverride || c.alt,
                }))}
            />
            **/}

            {/* Marketing intro under Premium Tea */}
            <AnimatedSection direction="up" delay={0}>
                <MarketingIntro title="Teas." subtitle="Guru Tea offers the finest tea, blends and tisanes." />
            </AnimatedSection>

            {/* Top 4 Products with Most Reviews */}
            <Box sx={{ px: { xs: '1rem', md: '10%', lg: '15%' }, py: 4 }}>
                <Grid container spacing={3} sx={{ maxWidth: '1200px', mx: 'auto' }}>
                    {topProducts.map((product, index) => {
                        if (!product || !product.title) return null;
                        
                        return (
                            <Grid key={product.documentId} size={{ xs: 6, sm: 6, md: 3, lg: 3 }}>
                                <AnimatedSection direction="up" delay={200 + (index * 150)}>
                                <Link href={`/catalog/${product.slug || product.documentId}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                                    <Box className="product-card">
                                        <Box className="product-card-content">
                                            {/* Header: title + price + add to cart */}
                                            <Box className="product-card-header">
                                                <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                                                    <Typography className="product-card-title">
                                                        {product.title}
                                                    </Typography>
                                                    <Typography className="product-card-price">
                                                        ${product.price ? product.price.toFixed(2) : '0.00'}
                                                    </Typography>
                                                </Box>
                                                <AddToCartButton product={{
                                                    documentId: product.documentId,
                                                    title: product.title,
                                                    price: product.price,
                                                    images: product.images?.map(img => ({
                                                        url: img.url,
                                                        alternativeText: img.alternativeText || undefined
                                                    }))
                                                }} />
                                            </Box>

                                            {/* Rating and Description above image */}
                                            <Box className="product-card-rating-section">
                                                <Box className="product-card-rating">
                                                    {(product.reviews?.length || 0) > 0 && (
                                                        <StarRating 
                                                            rating={Math.round(calculateAverageRating(product.reviews || []))}
                                                            reviewCount={product.reviews?.length || 0}
                                                            size="small"
                                                            filledColor="#2c2c2c"
                                                            emptyColor="#9e9e9e"
                                                        />
                                                    )}
                                                </Box>
                                            </Box>

                                            {/* Product Image */}
                                            <Box className="product-card-image-container">
                                            {product.images?.[0]?.url ? (
                                                <Box
                                                    component="img"
                                                    src={`${process.env.NEXT_PUBLIC_CMS_URL}${product.images[0].url}`}
                                                    alt={product.images[0]?.alternativeText || product.title}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="product-card-image"
                                                />
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

                                            
                                            {/* Description Overlay */}
                                            <Box className="product-card-description-overlay">
                                                <Typography className="product-card-description-text">
                                                    {product.description || "Learn more"}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Link>
                                </AnimatedSection>
                            </Grid>
                        );
                    })}
                </Grid>
                
                {/* To Catalog Button */}
                <AnimatedSection direction="up" delay={800}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Link href="/catalog" style={{ textDecoration: 'none' }}>
                        <Button
                            sx={{
                                bgcolor: '#1a1a1a',
                                color: '#ffffff',
                                borderRadius: 0,
                                border: '2px solid #2c2c2c',
                                boxShadow: '3px 3px 0px #66bb6a',
                                fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                textTransform: 'uppercase',
                                fontWeight: 800,
                                fontSize: '0.9rem',
                                letterSpacing: '0.05em',
                                px: 4,
                                py: 1.5,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: '#66bb6a',
                                    transform: 'translateY(-1px) translateX(-1px)',
                                    boxShadow: '4px 4px 0px #1a1a1a',
                                    borderColor: '#66bb6a',
                                }
                            }}
                        >
                            to catalog
                        </Button>
                        </Link>
                    </Box>
                </AnimatedSection>
                </Box>

            {/* Our Happy Customers */}
            <AnimatedSection direction="up" delay={400}>
                <HappyCustomers subtitle="Guru Tea offers the finest tea, blends and tisanes." reviews={topReviews.map(r => ({
                    documentId: r.documentId,
                    rating: r.rating,
                    comment: r.comment ?? undefined,
                    authorName: r.authorName || "Anonymous",
                    createdAt: r.createdAt,
                    product: r.product ?? null,
                }))} />
            </AnimatedSection>

            {/* Tea Process Section */}
            <AnimatedSection direction="up" delay={600}>
                <TeaProcess />
            </AnimatedSection>

            {/* About banner with right overlay */}
            <AnimatedSection direction="up" delay={800}>
                <AboutBanner imageSrc={aboutImgUrl} />
            </AnimatedSection>

            {/* To the top button */}
            <ToTopButton />

            {/* Feature triplet removed */}
        </Box>
    );
}
