"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import styles from "./MarketingIntro.module.css";

interface MarketingIntroProps {
  title?: string;
  subtitle?: string;
}

export default function MarketingIntro({
  title = "TEAS",
  subtitle = "Guru Tea offers the finest tea, blends and tisanes.",
}: MarketingIntroProps) {
  return (
    <Box className={styles.root}>
      <Container className={styles.wrap} maxWidth={false}>
        <Typography 
          component="h2" 
          className={styles.title}
          sx={{ textAlign: 'center' }}
        >
          {title}
        </Typography>
        <Typography component="p" className={styles.subtitle}>
          {subtitle}
        </Typography>
      </Container>
    </Box>
  );
}


