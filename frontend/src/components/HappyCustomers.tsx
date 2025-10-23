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
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const columns = lgUp ? 3 : mdUp ? 2 : 1;

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

  return (
    <Box sx={{ 
      py: { xs: 4, md: 6 }, 
      px: { xs: '1rem', md: '2.5rem' }, 
      bgcolor: '#f7faf7',
        // Зменшуємо відступи по боках
        '& .happy-customers-container': {
          paddingTop: { xs: '1rem', md: '2.5rem' },
          paddingBottom: { xs: '1rem', md: '2.5rem' },
          paddingLeft: { xs: '1rem', md: '5%', lg: '2%' },
          paddingRight: { xs: '1rem', md: '5%', lg: '2%' }
        }
    }}>
      <Container maxWidth="lg" className="happy-customers-container">
        <Typography 
          component="h2"
          className="section-title hipster-heading hipster-h1"
          sx={{
            textAlign: 'center',
            mb: 2
          }}
        >
          Sharing happiness.
        </Typography>
        {subtitle ? (
          <Typography component="p" className={styles.subtitle} sx={{ mb: 10 }}>
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
          sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          gap: 2,
          gridAutoColumns: columns === 3 ? 'calc((100% - 2 * 16px) / 3)' : (columns === 2 ? 'calc((100% - 16px) / 2)' : '100%'),
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          px: 0.5,
          alignItems: 'stretch',
        }}>
          {/* First set of items */}
          {items.map((r) => (
            <Box key={r.documentId} sx={{ scrollSnapAlign: 'start', height: '100%' }}>
              <Link href={r.product?.slug ? `/catalog/${r.product.slug}` : '#'} style={{ textDecoration: 'none' }}>
              <Box data-review-card sx={{ 
                position: 'relative', 
                p: { xs: 3, md: 3.25 }, 
                bgcolor: '#f8f9fa', 
                border: '2px solid #2c2c2c', 
                borderRadius: 0, 
                height: { xs: 280, md: 300 }, 
                display: 'flex', 
                flexDirection: 'column', 
                overflow: 'hidden', 
                boxShadow: '4px 4px 0px #2c2c2c', 
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px) translateX(-2px)',
                  boxShadow: '6px 6px 0px #66bb6a',
                  borderColor: '#66bb6a'
                }
              }}>
                {/* Review content with decorative quotes */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', mb: 2, position: 'relative', pl: 3, pr: 3 }}>
                  {/* Opening quote */}
                  <Box sx={{
                    position: 'absolute',
                    top: '-0.5rem',
                    left: '0.5rem',
                    width: '1.25rem',
                    height: '1.25rem',
                    bgcolor: '#2c2c2c',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                    border: '1px solid #2c2c2c',
                    boxShadow: '1px 1px 0px #1a1a1a',
                    zIndex: 2
                  }}>
                    "
                  </Box>

                  {/* Closing quote */}
                  <Box sx={{
                    position: 'absolute',
                    bottom: '-0.5rem',
                    right: '0.5rem',
                    width: '1rem',
                    height: '1rem',
                    bgcolor: '#2c2c2c',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                    border: '1px solid #2c2c2c',
                    boxShadow: '1px 1px 0px #1a1a1a',
                    zIndex: 2
                  }}>
                    "
                  </Box>

                  {r.comment && (
                    <Typography variant="body2" sx={{ 
                      color: '#1a1a1a', 
                      fontSize: { xs: '0.85rem', md: '0.9rem' }, 
                      fontWeight: 400, 
                      lineHeight: 1.6, 
                      letterSpacing: '0.02em', 
                      mb: 2,
                      display: '-webkit-box', 
                      WebkitLineClamp: 4, 
                      WebkitBoxOrient: 'vertical', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      flex: 1,
                      fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif'
                    }}>
                      {r.comment}
                    </Typography>
                  )}
                </Box>

                {/* Footer with user info and rating */}
                <Box sx={{ 
                  pt: 2,
                  borderTop: '2px solid #2c2c2c',
                  flexShrink: 0
                }}>
                  {/* User info row */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Box
                      component="img"
                      src={getRandomAvatar(r.documentId)}
                      alt={r.authorName}
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #2c2c2c'
                      }}
                    />
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ 
                        fontWeight: 800, 
                        lineHeight: 1.2,
                        color: '#1a1a1a',
                        mb: 0.25,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                        textTransform: 'lowercase',
                        letterSpacing: '0.01em',
                        fontSize: '0.9rem'
                      }}>
                        {r.authorName}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: '#666666',
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                        textTransform: 'lowercase',
                        letterSpacing: '0.02em'
                      }}>
                        {new Date(r.createdAt || new Date().toISOString()).toLocaleDateString('uk-UA', { year: 'numeric', month: 'short' })}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Product and rating row */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {r.product?.title && (
                      <Typography variant="caption" sx={{ 
                        color: '#1a1a1a', 
                        fontWeight: 800, 
                        maxWidth: '60%', 
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        fontSize: '0.8rem',
                        fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                        textTransform: 'lowercase',
                        letterSpacing: '0.02em'
                      }}>
                        {formatTeaTitle(r.product.title)}
                      </Typography>
                    )}
                    <Box sx={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: 0.5, 
                      px: 1.25, 
                      py: 0.5, 
                      borderRadius: 0, 
                      bgcolor: '#1a1a1a', 
                      border: '2px solid #2c2c2c',
                      boxShadow: '2px 2px 0px #2c2c2c',
                      flexShrink: 0
                    }}>
                      <StarRoundedIcon sx={{ color: '#ffffff', fontSize: '0.75rem' }} />
                      <Typography variant="caption" sx={{ 
                        fontWeight: 800, 
                        color: '#ffffff',
                        fontSize: '0.7rem',
                        fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        {(Number(r.rating) || 0).toFixed(1)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              </Link>
            </Box>
          ))}
          
          {/* Duplicate set for seamless loop */}
          {items.map((r) => (
            <Box key={`duplicate-${r.documentId}`} sx={{ scrollSnapAlign: 'start', height: '100%' }}>
              <Link href={r.product?.slug ? `/catalog/${r.product.slug}` : '#'} style={{ textDecoration: 'none' }}>
              <Box data-review-card sx={{ 
                position: 'relative', 
                p: { xs: 3, md: 3.25 }, 
                bgcolor: '#f8f9fa', 
                border: '2px solid #2c2c2c', 
                borderRadius: 0, 
                boxShadow: '4px 4px 0px #2c2c2c', 
                transition: 'all 0.3s ease', 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                '&:hover': { 
                  transform: 'translateY(-2px) translateX(-2px)', 
                  boxShadow: '6px 6px 0px #66bb6a', 
                  borderColor: '#66bb6a' 
                } 
              }}>
                {/* Review content with quotes */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', mb: 2, position: 'relative', pl: 3, pr: 3 }}>
                  {/* Opening quote */}
                  <Box sx={{
                    position: 'absolute',
                    top: '-0.5rem',
                    left: '0.5rem',
                    width: '1.25rem',
                    height: '1.25rem',
                    bgcolor: '#2c2c2c',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                    border: '1px solid #2c2c2c',
                    boxShadow: '1px 1px 0px #1a1a1a',
                    zIndex: 2
                  }}>
                    "
                  </Box>

                  {/* Closing quote */}
                  <Box sx={{
                    position: 'absolute',
                    bottom: '-0.5rem',
                    right: '0.5rem',
                    width: '1rem',
                    height: '1rem',
                    bgcolor: '#2c2c2c',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                    border: '1px solid #2c2c2c',
                    boxShadow: '1px 1px 0px #1a1a1a',
                    zIndex: 2
                  }}>
                    "
                  </Box>

                  {r.comment && (
                    <Typography variant="body2" sx={{ 
                      color: '#1a1a1a', 
                      fontSize: { xs: '0.85rem', md: '0.9rem' }, 
                      fontWeight: 400, 
                      lineHeight: 1.6, 
                      letterSpacing: '0.02em', 
                      mb: 2,
                      display: '-webkit-box', 
                      WebkitLineClamp: 4, 
                      WebkitBoxOrient: 'vertical', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      flex: 1,
                      fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif'
                    }}>
                      {r.comment}
                    </Typography>
                  )}
                </Box>

                {/* Footer with border */}
                <Box sx={{ 
                  borderTop: '2px solid #2c2c2c', 
                  pt: 2, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 1.5 
                }}>
                  {/* First row: reviewer info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box component="img" 
                      src={getRandomAvatar(r.documentId)} 
                      alt="Reviewer avatar" 
                      sx={{ 
                        width: 36, 
                        height: 36, 
                        borderRadius: '50%', 
                        objectFit: 'cover',
                        border: '2px solid #2c2c2c'
                      }} 
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 800, 
                        color: '#1a1a1a', 
                        fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                        textTransform: 'lowercase',
                        letterSpacing: '0.01em',
                        fontSize: '0.9rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {r.authorName || 'Anonymous'}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: '#666666', 
                        fontSize: '0.7rem', 
                        fontWeight: 500,
                        fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                        textTransform: 'lowercase',
                        letterSpacing: '0.02em'
                      }}>
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      px: 1.25, 
                      py: 0.5, 
                      borderRadius: 0, 
                      bgcolor: '#1a1a1a', 
                      border: '2px solid #2c2c2c', 
                      boxShadow: '2px 2px 0px #2c2c2c',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}>
                      <StarRoundedIcon sx={{ color: '#ffffff', fontSize: '0.75rem' }} />
                      <Typography variant="caption" sx={{ 
                        fontWeight: 800, 
                        color: '#ffffff', 
                        fontSize: '0.7rem',
                        fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        {r.rating || 0}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Second row: product title */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ 
                      color: '#1a1a1a', 
                      fontWeight: 800, 
                      maxWidth: '60%',
                      fontSize: '0.8rem',
                      fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                      textTransform: 'lowercase',
                      letterSpacing: '0.02em',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {r.product?.title ? truncateTitle(r.product.title) : 'Unknown Product'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              </Link>
            </Box>
          ))}
        </Box>
        {/* Pagination tiles */}
        {items.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mt: 3 }}>
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
                sx={{ 
                  width: 32, 
                  height: 8, 
                  borderRadius: 0, 
                  bgcolor: i === activePage ? '#1a1a1a' : '#f8f9fa', 
                  border: '2px solid #2c2c2c',
                  boxShadow: i === activePage ? '2px 2px 0px #66bb6a' : '2px 2px 0px #2c2c2c',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-1px) translateX(-1px)',
                    boxShadow: i === activePage ? '3px 3px 0px #66bb6a' : '3px 3px 0px #1a1a1a',
                    borderColor: i === activePage ? '#66bb6a' : '#1a1a1a'
                  }
                }} 
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}


