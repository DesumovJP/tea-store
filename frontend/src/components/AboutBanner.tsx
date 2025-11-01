"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import styles from "./AboutBanner.module.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface AboutBannerProps {
  imageSrc?: string;
  title?: string;
  text?: string;
  stats?: { value: string; label: string }[];
}

export default function AboutBanner({
  imageSrc = "/banner/about-banner.jpg",
  title = "About Guru Tea",
  text = "We source the finest teas from around the world — from classic blends to rare small-batch harvests.",
  stats = [
    { value: "500+", label: "Satisfied customers" },
    { value: "25+", label: "Tea varieties" },
    { value: "98%", label: "Positive reviews" },
  ],
}: AboutBannerProps) {
  const statsRef = useRef<HTMLDivElement | null>(null);
  const [animated, setAnimated] = useState(false);
  const [currentValues, setCurrentValues] = useState<number[]>(() => stats.map(() => 0));
  const [currentCupsValue, setCurrentCupsValue] = useState<number>(0);
  const formatNumber = (n: number) => new Intl.NumberFormat('en-US').format(Math.max(0, n));

  const parseStat = (v: string) => {
    const match = v.match(/([0-9]+(?:\.[0-9]+)?)(.*)/);
    const target = match ? Number(match[1]) : Number(v);
    const suffix = match ? match[2] : "";
    return { target, suffix } as { target: number; suffix: string };
  };

  useEffect(() => {
    if (!statsRef.current || animated) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setAnimated(true);
          // animate values
          const starts = stats.map(() => 0);
          const targets = stats.map((s) => parseStat(s.value).target);
          // cups animation target (25,000+)
          const cupsTarget = 25000;
          const cupsStart = 0;
          const duration = 1200; // ms
          const startTs = performance.now();

          const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
          const tick = (now: number) => {
            const p = Math.min(1, (now - startTs) / duration);
            const eased = easeOutCubic(p);
            const next = targets.map((tgt, i) => Math.round((starts[i] + (tgt - starts[i]) * eased)));
            setCurrentValues(next);
            const nextCups = Math.round(cupsStart + (cupsTarget - cupsStart) * eased);
            setCurrentCupsValue(nextCups);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [animated, stats]);
  return (
    <Box className="about-root">
      <Container maxWidth="lg" className="about-container">
        <Box className="about-hero">
          <Box component="img" src={imageSrc} alt={title} className="about-hero-img" />
          {/* Faded overlay over background image */}
          <Box className="about-overlay" />

          {/* Grid overlay with two cards */}
          <Box className="about-grid">
            {/* Stats card */}
            {stats?.length ? (
              <Box ref={statsRef} className="about-stats-card">
                <Box className="about-stats-grid">
                  <Box>
                    {stats.slice(0,3).map((s, idx) => {
                      const parsed = parseStat(s.value);
                      return (
                        <Box key={s.label} className="about-stat-row">
                          <Typography component="span" className="hipster-heading about-stat-number">
                            {currentValues[idx]}
                            <Box component="span" className="about-stat-suffix">{parsed.suffix}</Box>
                          </Typography>
                          <Typography component="span" variant="body2" className="hipster-heading about-stat-label">
                            {s.label}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                  <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Box className="about-cups">
                      <Typography className="about-cups-number">
                        {formatNumber(currentCupsValue)}+
                      </Typography>
                      <Typography className="about-cups-label">
                        cups of premium tea delivered to our happy customers
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ) : null}

            {/* Right column: socials on top + About card below */}
            <Box className="about-right">
              <Box className="about-socials">
                <Link href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="link-unstyled">
                  <Box className="navbar-social-icon navbar-social--instagram" style={{ width: 48, height: 48, borderRadius: 8 }}>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </Box>
                </Link>
                <Link href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="link-unstyled">
                  <Box className="navbar-social-icon navbar-social--facebook" style={{ width: 48, height: 48, borderRadius: 8 }}>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </Box>
                </Link>
                <Link href="https://youtube.com" aria-label="YouTube" target="_blank" rel="noopener noreferrer" className="link-unstyled">
                  <Box className="navbar-social-icon navbar-social--youtube" style={{ width: 48, height: 48, borderRadius: 8 }}>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </Box>
                </Link>
                <Link href="https://tiktok.com" aria-label="TikTok" target="_blank" rel="noopener noreferrer" className="link-unstyled">
                  <Box className="navbar-social-icon navbar-social--tiktok" style={{ width: 48, height: 48, borderRadius: 8 }}>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </Box>
                </Link>
                <Link href="https://t.me" aria-label="Telegram" target="_blank" rel="noopener noreferrer" className="link-unstyled">
                  <Box className="navbar-social-icon navbar-social--telegram" style={{ width: 48, height: 48, borderRadius: 8 }}>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.633 2.897l-17.022 6.563c-1.162.452-1.155 1.08-.21 1.363l4.345 1.357 1.678 5.303c.221.61.112.85.764.85.502 0 .723-.23 1.002-.502l2.406-2.34 5.01 3.693c.922.51 1.585.246 1.82-.857l3.292-15.438c.337-1.35-.514-1.965-1.585-1.523zM8.29 13.253l8.308-5.224c.412-.25.79-.113.48.159l-6.716 6.073-.26 3.69-1.812-4.698z"/>
                    </svg>
                  </Box>
                </Link>
              </Box>
              <Box className="about-card">
                <Typography variant="h5" className="about-title">
                  {title}
                </Typography>
                <Typography variant="body2" className="about-text">
                  {text}
                </Typography>
                <Link href="/about" className="link-unstyled">
                  <Button className="btn btn--light">
                    read more
                  </Button>
                </Link>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}


