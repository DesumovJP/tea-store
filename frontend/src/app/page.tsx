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
import { calculateAverageRating } from "@/lib/graphql";
import HomeProductCard from "@/components/HomeProductCard";

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
        { headline: "brew better tea, effortlessly.", ctaHref: "/catalog", ctaLabel: "explore favorites", paragraphs: [
            "hand‑picked whole leaves. small batches. fresh roast & fast dispatch."
        ] },
        { headline: "ethically sourced. honestly priced.", ctaHref: "/catalog", ctaLabel: "browse collection", paragraphs: [
            "we partner with small farms and pay fairly for every harvest."
        ] },
        { headline: "taste the difference in every cup.", ctaHref: "/catalog", ctaLabel: "discover blends", paragraphs: [
            "signature blends for balance, clarity and a naturally sweet finish."
        ] },
        { headline: "join 500+ happy tea lovers.", ctaHref: "/catalog", ctaLabel: "start sipping", paragraphs: [
            "4.8★ average rating • free shipping over $50 • 30‑day satisfaction."
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
        <Box className="home-root">
            {/* Hero Grid */}
            <Box className="home-hero-wrap">
                <Box className="home-hero-stack">
                    {/* Hero split 60/40 */}
                    <Box className="home-hero-split">
                        {/* Left 60% - image */}
                        <Box component={Link} href={heroSlides[0]?.ctaHref || "/catalog"} className="home-hero-left">
                            <Box
                                component="img"
                                src={heroSlides[0]?.src}
                                alt={heroSlides[0]?.alt}
                                className="home-hero-img"
                            />
                            <Box className="home-hero-overlay">
                                <Box>
                                    {heroSlides[0]?.headline && (
                                        <Typography
                                            variant="h4"
                                            className="hipster-heading white-text-shadow home-hero-headline"
                                        >
                                            {heroSlides[0].headline}
                                        </Typography>
                                    )}
                                    {heroSlides[0]?.paragraphs && heroSlides[0].paragraphs.length > 0 && (
                                        <Typography
                                            variant="body1"
                                            className="hipster-heading white-text-shadow home-hero-paragraph"
                                        >
                                            {heroSlides[0].paragraphs[0]}
                                        </Typography>
                                    )}
                                    {heroSlides[0]?.ctaLabel && (
                                        <Typography
                                            variant="button"
                                            className="hipster-heading white-text-shadow home-hero-cta"
                                        >
                                            {heroSlides[0].ctaLabel}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                        {/* Right 40% - two text blocks */}
                        <Box className="home-hero-right">
                            <Box component={Link} href={heroSlides[2]?.ctaHref || "/catalog"} className="home-hero-right-block">
                                <Box component="img" src={heroSlides[2]?.src} alt={heroSlides[2]?.alt} className="home-hero-img" />
                                <Box className="home-hero-overlay">
                                    <Box>
                                        {heroSlides[2]?.headline && (
                                            <Typography variant="h4" className="hipster-heading white-text-shadow home-hero-right-title">
                                                {heroSlides[2].headline}
                                            </Typography>
                                        )}
                                        {heroSlides[2]?.paragraphs && heroSlides[2].paragraphs.length > 0 && (
                                            <Typography variant="body1" className="hipster-heading white-text-shadow home-hero-paragraph">
                                                {heroSlides[2].paragraphs[0]}
                                            </Typography>
                                        )}
                                        {heroSlides[2]?.ctaLabel && (
                                            <Typography variant="button" className="hipster-heading white-text-shadow home-hero-cta">
                                                {heroSlides[2].ctaLabel}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                            <Box component={Link} href={heroSlides[1]?.ctaHref || "/catalog"} className="home-hero-right-block">
                                <Box component="img" src={heroSlides[1]?.src} alt={heroSlides[1]?.alt} className="home-hero-img" />
                                <Box className="home-hero-overlay">
                                    <Box>
                                        {heroSlides[1]?.headline && (
                                            <Typography variant="h4" className="hipster-heading white-text-shadow home-hero-right-title">
                                                {heroSlides[1].headline}
                                            </Typography>
                                        )}
                                        {heroSlides[1]?.paragraphs && heroSlides[1].paragraphs.length > 0 && (
                                            <Typography variant="body1" className="hipster-heading white-text-shadow home-hero-paragraph">
                                                {heroSlides[1].paragraphs[0]}
                                            </Typography>
                                        )}
                                        {heroSlides[1]?.ctaLabel && (
                                            <Typography variant="button" className="hipster-heading white-text-shadow home-hero-cta">
                                                {heroSlides[1].ctaLabel}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
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
            <MarketingIntro title="Best‑sellers." subtitle="hand‑picked. small‑batch. ethically sourced." />

            {/* Trust bar under hero */}
            <Box className="home-trust">
                    <ul className="home-trust-list">
                        <li className="home-trust-item">
                            <span className="home-trust-icon" aria-hidden>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </span>
                            free shipping $50+
                        </li>
                        <li className="home-trust-item">
                            <span className="home-trust-icon" aria-hidden>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 1l3 7h7l-5.5 4 2 7L12 16l-6.5 3 2-7L2 8h7l3-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </span>
                            4.8 average rating
                        </li>
                        <li className="home-trust-item">
                            <span className="home-trust-icon" aria-hidden>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 12l2-2 4 4 10-10 2 2-12 12-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </span>
                            ethically sourced
                        </li>
                        <li className="home-trust-item">
                            <span className="home-trust-icon" aria-hidden>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </span>
                            30‑day satisfaction
                        </li>
                    </ul>
                </Box>

            {/* Top 4 Products with Most Reviews */}
            <Box className="home-products-section">
                <Grid container spacing={3} className="container-1200 catalog-product-grid">
                    {topProducts.map((product, index) => {
                        if (!product || !product.title) return null;
                        
                        return (
                            <Grid key={product.documentId} size={{ xs: 6, sm: 6, md: 3, lg: 3 }}>
                                <HomeProductCard product={product} />
                            </Grid>
                        );
                    })}
                </Grid>
                
                </Box>

            {/* Our Happy Customers */}
            <HappyCustomers subtitle="Guru Tea offers the finest tea, blends and tisanes." reviews={topReviews.map(r => ({
                    documentId: r.documentId,
                    rating: r.rating,
                    comment: r.comment ?? undefined,
                    authorName: r.authorName || "Anonymous",
                    createdAt: r.createdAt,
                    product: r.product ?? null,
                }))} />

            {/* Tea Process Section */}
            <TeaProcess />

            {/* About banner with right overlay */}
            <AboutBanner imageSrc={aboutImgUrl} />

            {/* To the top button */}
            <ToTopButton />

            {/* Feature triplet removed */}
        </Box>
    );
}
