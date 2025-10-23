"use client";

import { Box, Container, Typography, Grid } from "@mui/material";
import AnimatedSection from "./AnimatedSection";

interface TeaProcessProps {
  images?: {
    collection?: string;
    sorting?: string;
    health?: string;
  };
}

export default function TeaProcess({ 
  images = {
    collection: "http://localhost:1337/uploads/tea_2356770_1280_157c28a389.jpg",
    sorting: "http://localhost:1337/uploads/38624_1_e33b250554.jpg", 
    health: "http://localhost:1337/uploads/6285_a52115f693.jpg"
  }
}: TeaProcessProps) {
  console.log('TeaProcess images:', images);
  return (
    <Box sx={{ 
      py: { xs: 6, md: 8 }, 
      px: { xs: '1rem', md: '2.5rem' },
      bgcolor: '#f8f9fa'
    }}>
      <Container maxWidth="lg" sx={{ p: 0 }}>
        {/* First section: Text left, Image right */}
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center" sx={{ mb: { xs: 6, md: 8 } }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <AnimatedSection direction="left" delay={0}>
              <Box sx={{ pr: { md: 4 } }}>
              <Typography variant="h3" sx={{ 
                fontWeight: 800, 
                mb: 3,
                fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                textTransform: 'lowercase',
                letterSpacing: '-0.02em',
                fontSize: { xs: '2rem', md: '2.5rem' },
                color: '#1a1a1a'
              }}>
                premium tea collection
              </Typography>
              <Typography variant="body1" sx={{ 
                mb: 3,
                fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                textTransform: 'lowercase',
                letterSpacing: '0.02em',
                fontSize: '1rem',
                lineHeight: 1.7,
                color: '#666666'
              }}>
                we carefully select the finest tea leaves from renowned gardens around the world. 
                our expert tasters evaluate each batch for aroma, flavor, and quality, ensuring 
                only the most exceptional teas reach your cup.
              </Typography>
              <Typography variant="body1" sx={{ 
                fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                textTransform: 'lowercase',
                letterSpacing: '0.02em',
                fontSize: '1rem',
                lineHeight: 1.7,
                color: '#666666'
              }}>
                from traditional chinese gardens to modern japanese plantations, we source 
                directly from farmers who share our commitment to sustainable and ethical practices.
              </Typography>
              </Box>
            </AnimatedSection>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <AnimatedSection direction="right" delay={200}>
              <Box sx={{ 
                height: { xs: 300, md: 400 },
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
              }}>
                <Box
                  component="img"
                  src={images.collection!}
                  alt="Tea collection process"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>
            </AnimatedSection>
          </Grid>
        </Grid>

        {/* Second section: Image left, Text right (mirrored) */}
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center" sx={{ mb: { xs: 6, md: 8 } }}>
          <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 2, md: 1 } }}>
            <AnimatedSection direction="left" delay={400}>
              <Box sx={{ 
                height: { xs: 300, md: 400 },
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
              }}>
                <Box
                  component="img"
                  src={images.sorting!}
                  alt="Tea sorting process"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>
            </AnimatedSection>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 1, md: 2 } }}>
            <AnimatedSection direction="right" delay={600}>
              <Box sx={{ pl: { md: 4 } }}>
              <Typography variant="h3" sx={{ 
                fontWeight: 800, 
                mb: 3,
                fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                textTransform: 'lowercase',
                letterSpacing: '-0.02em',
                fontSize: { xs: '2rem', md: '2.5rem' },
                color: '#1a1a1a'
              }}>
                meticulous sorting & grading
              </Typography>
              <Typography variant="body1" sx={{ 
                mb: 3,
                fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                textTransform: 'lowercase',
                letterSpacing: '0.02em',
                fontSize: '1rem',
                lineHeight: 1.7,
                color: '#666666'
              }}>
                each tea leaf is hand-sorted by our skilled artisans, who separate the finest 
                buds and leaves from the rest. this meticulous process ensures consistent 
                quality and optimal flavor extraction in every cup.
              </Typography>
              <Typography variant="body1" sx={{ 
                fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                textTransform: 'lowercase',
                letterSpacing: '0.02em',
                fontSize: '1rem',
                lineHeight: 1.7,
                color: '#666666'
              }}>
                we grade our teas using traditional methods combined with modern quality 
                control, guaranteeing that only the highest grade teas bear our name.
              </Typography>
              </Box>
            </AnimatedSection>
          </Grid>
        </Grid>

        {/* Third section: Text left, Image right */}
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <AnimatedSection direction="left" delay={800}>
              <Box sx={{ pr: { md: 4 } }}>
              <Typography variant="h3" sx={{ 
                fontWeight: 800, 
                mb: 3,
                fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                textTransform: 'lowercase',
                letterSpacing: '-0.02em',
                fontSize: { xs: '2rem', md: '2.5rem' },
                color: '#1a1a1a'
              }}>
                health & wellness benefits
              </Typography>
              <Typography variant="body1" sx={{ 
                mb: 3,
                fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                textTransform: 'lowercase',
                letterSpacing: '0.02em',
                fontSize: '1rem',
                lineHeight: 1.7,
                color: '#666666'
              }}>
                our premium teas are rich in antioxidants, polyphenols, and other beneficial 
                compounds that support your overall well-being. from boosting immunity to 
                promoting relaxation, each blend offers unique health benefits.
              </Typography>
              <Typography variant="body1" sx={{ 
                fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                textTransform: 'lowercase',
                letterSpacing: '0.02em',
                fontSize: '1rem',
                lineHeight: 1.7,
                color: '#666666'
              }}>
                whether you seek the energizing properties of green tea or the calming effects 
                of chamomile, our carefully curated selection supports your health journey.
              </Typography>
              </Box>
            </AnimatedSection>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <AnimatedSection direction="right" delay={1000}>
              <Box sx={{ 
                height: { xs: 300, md: 400 },
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
              }}>
                <Box
                  component="img"
                  src={images.health!}
                  alt="Tea health benefits"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>
            </AnimatedSection>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
