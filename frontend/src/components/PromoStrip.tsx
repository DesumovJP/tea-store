"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function PromoStrip() {
  const marketingText = "🌸 Follow us on social media and get your 15% discount for next order! ☕ Premium tea blends delivered to your door • Free shipping on orders over $50 • Join our tea community today! 🌟✨";

  return (
    <Box className="promo-root promo-container">
      <Typography variant="h6" className="promo-text promo-typo">
        {marketingText}
      </Typography>
    </Box>
  );
}


