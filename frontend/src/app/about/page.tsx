"use client";

import { Box, Typography, Container } from "@mui/material";
import FeatureTriplet from "@/components/FeatureTriplet";

export default function About() {
    return (
        <Box sx={{ 
            bgcolor: '#ffffff',
            fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif'
        }}>
            <Container maxWidth={false} sx={{ py: '2rem', px: { xs: '1rem', md: '10%', lg: '15%' } }}>
                <Typography 
                    variant="h2" 
                    className="hipster-heading"
                    sx={{ 
                        mb: 4, 
                        textAlign: 'center', 
                        mt: { xs: 2, md: 4 },
                        fontWeight: 300,
                        color: '#1a1a1a',
                        fontSize: { xs: '2.5rem', md: '3rem' },
                        fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                        letterSpacing: '-0.02em',
                        textTransform: 'lowercase',
                        lineHeight: 0.9
                    }}
                >
                    about guru tea
                </Typography>
                <Typography variant="body1" sx={{ 
                    mb: 3, 
                    lineHeight: 1.7,
                    color: '#4a4a4a',
                    fontSize: '1rem',
                    fontWeight: 300,
                    fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                    letterSpacing: '-0.02em',
                    textTransform: 'lowercase'
                }}>
                    guru tea is a premium tea company dedicated to sourcing and providing 
                    the highest quality tea, herbs, and spices from around the world. 
                    we believe in the power of exceptional tea to bring people together 
                    and create moments of peace and mindfulness in our busy lives.
                </Typography>
                <Typography variant="body1" sx={{ 
                    mb: 3, 
                    lineHeight: 1.7,
                    color: '#4a4a4a',
                    fontSize: '1rem',
                    fontWeight: 300,
                    fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                    letterSpacing: '-0.02em',
                    textTransform: 'lowercase'
                }}>
                    our carefully curated selection includes traditional teas from renowned 
                    tea gardens, as well as unique blends that reflect our commitment to 
                    quality and innovation. each product is selected for its exceptional 
                    taste, aroma, and health benefits.
                </Typography>
                <Typography variant="body1" sx={{ 
                    lineHeight: 1.7,
                    color: '#4a4a4a',
                    fontSize: '1rem',
                    fontWeight: 300,
                    fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                    letterSpacing: '-0.02em',
                    textTransform: 'lowercase'
                }}>
                    whether you&apos;re a tea connoisseur or just beginning your tea journey, 
                    we&apos;re here to help you discover the perfect cup that suits your taste 
                    and lifestyle.
                </Typography>
            </Container>

            {/* About feature block similar to Our Tea Garden */}
            <FeatureTriplet
                title="Craft & Origin"
                items={[
                    {
                        image: `${process.env.NEXT_PUBLIC_CMS_URL}/uploads/2149483936_72bab6b54d.jpg`,
                        title: "Sourcing with care",
                        text: "We partner with small farms and cooperatives, ensuring traceability and fair pay for every harvest.",
                    },
                    {
                        image: `${process.env.NEXT_PUBLIC_CMS_URL}/uploads/2149483934_7d8aabeeb9.jpg`,
                        title: "Masterful crafting",
                        text: "Leaves are hand‑rolled and fired in small batches to preserve aroma and character.",
                    },
                    {
                        image: `${process.env.NEXT_PUBLIC_CMS_URL}/uploads/2148124111_307a9dba0f.jpg`,
                        title: "Brew with confidence",
                        text: "Every order includes brew guides and tasting notes to help you get the perfect cup.",
                    },
                ]}
            />

            {/* Company story and gallery */}
            <Box sx={{ py: { xs: 4, md: 6 }, px: { xs: '1rem', md: '2.5rem' }, bgcolor: 'white' }}>
                <Container maxWidth="lg">
                    <Typography 
                        variant="h5" 
                        align="center" 
                        className="hipster-heading"
                        sx={{ 
                            fontWeight: 300, 
                            mb: 2,
                            color: '#1a1a1a',
                            fontSize: '1.5rem',
                            fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                            letterSpacing: '-0.02em',
                            textTransform: 'lowercase'
                        }}
                    >
                        our story
                    </Typography>
                    <Typography variant="body1" sx={{ 
                        textAlign: 'center', 
                        color: '#4a4a4a', 
                        maxWidth: 800, 
                        mx: 'auto', 
                        lineHeight: 1.7, 
                        mb: 3,
                        fontSize: '1rem',
                        fontWeight: 300,
                        fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                        letterSpacing: '-0.02em',
                        textTransform: 'lowercase'
                    }}>
                        founded with a simple belief that a great cup of tea can slow the world down, guru tea curates
                        small lots from farms we know by name. we obsess over freshness, roast curves and water ratios so
                        you don't have to — just brew, sip and enjoy the moment.
                    </Typography>

                    {/* Photo gallery */}
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' },
                        gap: 2,
                    }}>
                        {[
                            `${process.env.NEXT_PUBLIC_CMS_URL}/uploads/2149483936_72bab6b54d.jpg`,
                            `${process.env.NEXT_PUBLIC_CMS_URL}/uploads/2149483934_7d8aabeeb9.jpg`,
                            `${process.env.NEXT_PUBLIC_CMS_URL}/uploads/2148124111_307a9dba0f.jpg`,
                            `${process.env.NEXT_PUBLIC_CMS_URL}/uploads/2148186319_52984b5731.jpg`,
                            `${process.env.NEXT_PUBLIC_CMS_URL}/uploads/2149483934_7d8aabeeb9.jpg`,
                            `${process.env.NEXT_PUBLIC_CMS_URL}/uploads/2149483936_72bab6b54d.jpg`,
                        ].map((src, idx) => (
                            <Box key={idx} sx={{ position: 'relative', height: { xs: 140, sm: 180, md: 200 }, overflow: 'hidden', bgcolor: '#f5f5f5' }}>
                                <Box component="img" src={src} alt={`Gallery ${idx+1}`} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}