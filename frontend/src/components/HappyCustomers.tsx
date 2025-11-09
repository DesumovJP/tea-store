"use client";

import { Box, Container, Typography, Avatar } from "@mui/material";
import styles from "./HappyCustomers.module.css";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import StarRating from "./StarRating";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

interface ReviewItem {
  documentId: string;
  rating: number;
  comment?: string;
  authorName: string;
  createdAt?: string;
  product?: { slug: string; title: string } | null;
}

interface HappyCustomersProps {
  reviews: ReviewItem[];
  subtitle?: string;
}

export default function HappyCustomers({ reviews, subtitle }: HappyCustomersProps) {
  const items = reviews?.slice(0, 12) || [];
  const theme = useTheme();
  // Avoid SSR/client mismatch that caused layout jumps on first paint
  const mdUp = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true });
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'), { noSsr: true });
  const columns = lgUp ? 3 : mdUp ? 2 : 1;
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Масив аватарок для відгуків
  const avatarImages = [
    'http://localhost:1337/uploads/121427_cfc9c427dc.jpg',
    'http://localhost:1337/uploads/184564a4131ed0ce4b79dd0e376493e7_3978a92d44.jpg',
    'http://localhost:1337/uploads/c9b6f424a544f3e1fa9a6d73b170b79e_6067558a03.jpg',
    'http://localhost:1337/uploads/b604e3255e270af521a2ec9007efdce0_d105da6920.jpg',
    'http://localhost:1337/uploads/9c822d62b4323f4265eb1f89638b4411_e5a0e79785.jpg'
  ];

  // Функція для отримання випадкової аватарки на основі documentId
  const getRandomAvatar = (documentId: string) => {
    const hash = documentId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const index = Math.abs(hash) % avatarImages.length;
    return avatarImages[index];
  };

  const truncateTitle = (title: string) => {
    const t = title.split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return t.length > 28 ? `${t.slice(0, 27)}…` : t;
  };

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [pageCount, setPageCount] = useState(1);
  const [activePage, setActivePage] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap || '16');
    const step = first ? first.getBoundingClientRect().width + gap : el.clientWidth;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  const getInitials = (name: string) => {
    const parts = String(name || '').trim().split(/\s+/).slice(0, 2);
    return parts.map(p => p.charAt(0).toUpperCase()).join('') || 'U';
  };

  const formatTeaTitle = (title?: string) => {
    if (!title) return '';
    const t = title
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return t.length > 28 ? `${t.slice(0, 27)}…` : t;
  };

  // Pages depend on visible columns (desktop shows 3 at once)
  const pages = Math.max(1, Math.ceil(items.length / Math.max(1, columns)));
  // quick sync on mount/update without using requestAnimationFrame (works on SSR)
  if (pageCount !== pages) {
    setPageCount(pages);
  }

  // Auto-scroll effect with seamless loop
  useEffect(() => {
    if (!isAutoScrolling || items.length <= columns) return;
    
    const interval = setInterval(() => {
      const el = scrollerRef.current;
      if (!el) return;
      
      const first = el.firstElementChild as HTMLElement | null;
      const gap = parseFloat(getComputedStyle(el).columnGap || '16');
      const step = first ? first.getBoundingClientRect().width + gap : el.clientWidth;
      
      el.scrollBy({ left: step, behavior: 'smooth' });
      
      // Seamless loop: when reaching the middle (end of first set), instantly jump to beginning
      setTimeout(() => {
        if (el.scrollLeft >= el.scrollWidth / 2 - 10) {
          el.scrollTo({ left: 0, behavior: 'auto' }); // Instant jump, no animation
        }
      }, 1000);
    }, 3000); // Scroll every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoScrolling, items.length, columns]);

  if (!mounted) return null;
  return (
    <Box className="happy-root">
      <Container maxWidth="lg" className="happy-customers-container">
        <Typography 
          component="h2"
          className="happy-title"
        >
          Sharing happiness.
        </Typography>
        {subtitle ? (
          <Typography component="p" className={`happy-subtitle`}>
            {subtitle}
          </Typography>
        ) : null}

        <Box 
          id="reviews-scroller" 
          ref={scrollerRef} 
          onScroll={() => {
            const el = scrollerRef.current; 
            if (!el) return; 
            const w = el.clientWidth; 
            setActivePage(Math.min(pageCount-1, Math.max(0, Math.round(el.scrollLeft / Math.max(1,w)))));
          }}
          onMouseEnter={() => setIsAutoScrolling(false)}
          onMouseLeave={() => setIsAutoScrolling(true)}
          onTouchStart={() => setIsAutoScrolling(false)}
          onTouchEnd={() => {
            setTimeout(() => setIsAutoScrolling(true), 2000);
          }}
          className={`happy-scroller happy-scroller--${columns}`}>
          {/* First set of items */}
          {items.map((r) => (
          <Box key={r.documentId} className="happy-item">
              <Link href={r.product?.slug ? `/catalog/${r.product.slug}` : '#'} className="link-unstyled">
              <Box data-review-card className="happy-card">
                {/* Review content with decorative quotes */}
                <Box className="happy-card-content">
                  {/* Opening quote */}
                  <Box className="happy-quote-open">
                    "
                  </Box>

                  {/* Closing quote */}
                  <Box className="happy-quote-close">
                    "
                  </Box>

                  {r.comment && (
                    <Box className="happy-comment-wrapper">
                      <Typography variant="body2" className="happy-comment">
                        {r.comment}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Footer with user info and rating */}
                <Box className="happy-card-footer">
                  {/* User info row with product name */}
                  <Box className="happy-user-row">
                    <Box
                      component="img"
                      src={getRandomAvatar(r.documentId)}
                      alt={r.authorName}
                      className="happy-avatar"
                    />
                    <Box style={{ minWidth: 0, flex: 1 }}>
                      <Box className="happy-user-name-row">
                        <Typography variant="subtitle2" className="happy-user-name">
                          {r.authorName}
                        </Typography>
                        {r.product?.title && (
                          <Typography variant="caption" className="happy-product-title">
                            {formatTeaTitle(r.product.title)}
                          </Typography>
                        )}
                      </Box>
                      <Box className="happy-date-rating-row">
                        <Typography variant="caption" className="happy-user-date">
                          {new Date(r.createdAt || new Date().toISOString()).toLocaleDateString('uk-UA', { year: 'numeric', month: 'short' })}
                        </Typography>
                        <Box className="happy-rating-badge">
                          <StarRoundedIcon className="happy-rating-star" />
                          <Typography variant="caption" className="happy-rating-value">
                            {(Number(r.rating) || 0).toFixed(1)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              </Link>
            </Box>
          ))}
          
          {/* Duplicate set for seamless loop */}
          {items.map((r) => (
            <Box key={`duplicate-${r.documentId}`} className="happy-item">
              <Link href={r.product?.slug ? `/catalog/${r.product.slug}` : '#'} className="link-unstyled">
              <Box data-review-card className="happy-card" style={{ height: '100%' }}>
                {/* Review content with quotes */}
                <Box className="happy-card-content">
                  {/* Opening quote */}
                  <Box className="happy-quote-open">
                    "
                  </Box>

                  {/* Closing quote */}
                  <Box className="happy-quote-close">
                    "
                  </Box>

                  {r.comment && (
                    <Box className="happy-comment-wrapper">
                      <Typography variant="body2" className="happy-comment">
                        {r.comment}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Footer with border */}
                <Box className="happy-card-footer">
                  {/* User info row with product name */}
                  <Box className="happy-user-row">
                    <Box component="img" 
                      src={getRandomAvatar(r.documentId)} 
                      alt="Reviewer avatar" 
                      className="happy-avatar"
                    />
                    <Box style={{ minWidth: 0, flex: 1 }}>
                      <Box className="happy-user-name-row">
                        <Typography variant="subtitle2" className="happy-user-name">
                          {r.authorName || 'Anonymous'}
                        </Typography>
                        {r.product?.title && (
                          <Typography variant="caption" className="happy-product-title">
                            {formatTeaTitle(r.product.title)}
                          </Typography>
                        )}
                      </Box>
                      <Box className="happy-date-rating-row">
                        <Typography variant="caption" className="happy-user-date">
                          {new Date(r.createdAt || new Date().toISOString()).toLocaleDateString('uk-UA', { year: 'numeric', month: 'short' })}
                        </Typography>
                        <Box className="happy-rating-badge">
                          <StarRoundedIcon className="happy-rating-star" />
                          <Typography variant="caption" className="happy-rating-value">
                            {(Number(r.rating) || 0).toFixed(1)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              </Link>
            </Box>
          ))}
        </Box>
        {/* Pagination tiles */}
        {items.length > 0 && (
          <Box className="happy-pagination">
            {Array.from({ length: pageCount }).map((_, i) => (
              <Box 
                key={i} 
                onClick={() => { 
                  setIsAutoScrolling(false);
                  const el = scrollerRef.current; 
                  if (!el) return; 
                  // Calculate position considering duplicates
                  const position = i * el.clientWidth;
                  el.scrollTo({ left: position, behavior: 'smooth' }); 
                  setActivePage(i);
                  setTimeout(() => setIsAutoScrolling(true), 3000);
                }} 
                className={`happy-page-dot ${i === activePage ? 'happy-page-dot--active' : ''}`}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}


