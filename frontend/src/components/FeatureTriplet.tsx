"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

type Feature = {
  image: string;
  title: string;
  text: string;
};

interface FeatureTripletProps { items?: Feature[]; title?: string }

export default function FeatureTriplet({ items, title = "Our Tea Garden" }: FeatureTripletProps) {
  const data: Feature[] = items || [];

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, px: { xs: '1rem', md: '2.5rem' } }}>
      <Container maxWidth="lg">
        <Typography variant="h5" align="center" sx={{ fontWeight: 700, mb: 3 }} className="section-title">
          {title}
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(2, 1fr)', // custom 2-col layout on desktop
            },
            gap: 3,
          }}
        >
          {data.map((f, idx) => (
            <Box
              key={f.title}
              sx={{
                // On desktop: first card spans 2 rows in the left column
                gridColumn: { md: idx === 0 ? '1 / span 1' : '2 / span 1' },
                gridRow: { md: idx === 0 ? '1 / span 2' : (idx === 1 ? '1' : '2') },
              }}
            >
              <Box sx={{ mb: 1.5, position: 'relative', height: { xs: 180, sm: 200, md: idx === 0 ? 420 : 200 }, overflow: 'hidden' }}>
                <Box component="img" src={f.image} alt={f.title} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                {f.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b6b6b' }}>
                {f.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}


