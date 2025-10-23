"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function PromoStrip() {
  const marketingText = "🌸 Follow us on social media and get your 15% discount for next order! ☕ Premium tea blends delivered to your door • Free shipping on orders over $50 • Join our tea community today! 🌟✨";

  return (
    <Box 
      sx={{ 
        py: { xs: 2, md: 2.5 }, 
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #a5d6a7 0%, #81c784 25%, #66bb6a 50%, #4caf50 75%, #43a047 100%)',
        '&:hover .promo-text': {
          animationPlayState: 'paused'
        }
      }}
    >
      <Typography 
        variant="h6" 
        className="promo-text"
        sx={{ 
          fontWeight: 800, 
          letterSpacing: '0.02em', 
          mb: 0, 
          color: '#2c3a2d',
          fontSize: { xs: '0.9rem', md: '1.1rem' },
          display: 'inline-block',
          whiteSpace: 'nowrap',
          padding: '0 2rem',
          transition: 'all 0.3s ease'
        }}
      >
        {marketingText}
      </Typography>
    </Box>
  );
}


