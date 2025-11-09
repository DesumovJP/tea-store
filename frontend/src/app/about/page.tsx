"use client";

import { Box, Typography, Container } from "@mui/material";
import FeatureTriplet from "@/components/FeatureTriplet";

export default function About() {
    return (
        <Box className="about-page-root">
            

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
            <Box className="about-story-section">
                <Container maxWidth="lg">
                    <Typography 
                        variant="h5" 
                        align="center" 
                        className="hipster-heading about-story-title"
                    >
                        our story
                    </Typography>
                    <Typography variant="body1" className="about-story-sub">
                        founded with a simple belief that a great cup of tea can slow the world down, guru tea curates
                        small lots from farms we know by name. we obsess over freshness, roast curves and water ratios so
                        you don't have to — just brew, sip and enjoy the moment.
                    </Typography>

                    {/* Photo gallery */}
                    <Box className="about-gallery">
                        {[
                            `${process.env.NEXT_PUBLIC_CMS_URL}/uploads/2149483936_72bab6b54d.jpg`,
                            `${process.env.NEXT_PUBLIC_CMS_URL}/uploads/2149483934_7d8aabeeb9.jpg`,
                            `${process.env.NEXT_PUBLIC_CMS_URL}/uploads/2148124111_307a9dba0f.jpg`,
                            `${process.env.NEXT_PUBLIC_CMS_URL}/uploads/2148186319_52984b5731.jpg`,
                            `${process.env.NEXT_PUBLIC_CMS_URL}/uploads/2149483934_7d8aabeeb9.jpg`,
                            `${process.env.NEXT_PUBLIC_CMS_URL}/uploads/2149483936_72bab6b54d.jpg`,
                        ].map((src, idx) => (
                            <Box key={idx} className="about-gallery-tile">
                                <Box component="img" src={src} alt={`Gallery ${idx+1}`} className="about-gallery-img" />
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}