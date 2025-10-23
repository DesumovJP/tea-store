"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Link from "next/link";

type CategoryItem = {
  name: string;
  href: string;
  image?: string;
  alt?: string;
};

interface CategoryCarouselProps {
  items: CategoryItem[];
}

export default function CategoryCarousel({ items }: CategoryCarouselProps) {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const isXlUp = useMediaQuery(theme.breakpoints.up('xl'));
  const isMin360 = useMediaQuery('(min-width:360px)');

  // Кількість колонок, що мають поміститися на екрані
  // Desired columns: mobile=2, tablet=3/4, desktop=5
  const columns = isXlUp ? 5 : isLgUp ? 4 : isMdUp ? 3 : isMin360 ? 2 : 1;
  // Карусель увімкнена починаючи з 2 карток в ряд
  const isCarousel = columns >= 2;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [overlayTop, setOverlayTop] = useState(0);
  const [overlayHeight, setOverlayHeight] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [activePage, setActivePage] = useState(0);
  const [stepPx, setStepPx] = useState(0);

  const scrollBy = (dir: 1 | -1) => {
    const container = scrollerRef.current;
    if (!container) return;
    const delta = Math.round(container.clientWidth * 0.6) * dir;
    container.scrollBy({ left: delta, behavior: "smooth" });
  };

  useEffect(() => {
    if (!isCarousel) return;
    const container = containerRef.current;
    const scroller = scrollerRef.current;
    if (!container || !scroller) return;

    const getCard = (): HTMLElement | null => {
      const firstCard = scroller.firstElementChild as HTMLElement | null;
      return (firstCard?.querySelector('[data-card]') as HTMLElement | null) ?? null;
    };

    const updateOverlay = () => {
      const card = getCard();
      if (!card) return;
      const containerRect = container.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      setOverlayTop(cardRect.top - containerRect.top);
      setOverlayHeight(cardRect.height);
    };

    // Initial after layout and image load
    const id = requestAnimationFrame(updateOverlay);

    // Recalculate on resize and whenever the circle element resizes
    const ro = new ResizeObserver(() => updateOverlay());
    const cardEl = getCard();
    if (cardEl) ro.observe(cardEl);
    window.addEventListener('resize', updateOverlay);

    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
      window.removeEventListener('resize', updateOverlay);
    };
  }, [isCarousel, columns]);

  // Recompute pages and step (2 cards) when layout changes
  useEffect(() => {
    const pages = Math.max(1, Math.ceil(items.length / 2));
    setPageCount(pages);

    const scroller = scrollerRef.current;
    if (scroller) {
      const gap = parseFloat(getComputedStyle(scroller).columnGap || '0');
      const first = scroller.firstElementChild as HTMLElement | null;
      const childWidth = first ? first.getBoundingClientRect().width : scroller.clientWidth / Math.max(1, columns);
      const step = (childWidth + gap) * 2; // move by 2 cards
      setStepPx(step);
    }
  }, [items.length, columns]);

  const handleScroll = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const page = stepPx > 0 ? Math.min(pageCount - 1, Math.max(0, Math.round(scroller.scrollLeft / stepPx))) : 0;
    if (page !== activePage) setActivePage(page);
  };

  const goToPage = (page: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const left = stepPx > 0 ? page * stepPx : page * scroller.clientWidth;
    scroller.scrollTo({ left, behavior: 'smooth' });
    setActivePage(page);
  };

  return (
    <Box sx={{ py: { xs: 3, md: 6 }, px: { xs: 2, md: '10%', lg: '15%' }, bgcolor: "#ffffff" }}>
      <Typography variant="h5" align="center" sx={{ fontWeight: 700, mb: 3 }} className="section-title">
        Our Premium Tea
      </Typography>
      <Container maxWidth={false} sx={{ position: "relative", p: 0 }} ref={containerRef}>

        {/* Scroller */}
        <Box
          ref={scrollerRef}
          onScroll={handleScroll}
          sx={{
            display: 'grid',
            ...(isCarousel
              ? (() => {
                  const gap = theme.spacing(isMdUp ? 3 : 2); // px string
                  const baseWidth = `calc((100% - ${(columns - 1)} * ${gap}) / ${columns})`;
                  const scale = 1; // exact fit per requested columns
                  const calcWidth = `calc(${baseWidth} * ${scale})`;
                  return {
                    gridAutoFlow: 'column',
                    gridAutoColumns: calcWidth,
                    overflowX: 'auto',
                    scrollSnapType: 'x mandatory',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                  } as const;
                })()
              : {
                  gridTemplateColumns: '1fr',
                }),
            justifyItems: 'center',
            gap: { xs: 2, md: 3 },
            px: 0,
          }}
        >
          {items.map((cat) => (
            <Box key={cat.name} sx={{ p: 0, width: '100%', scrollSnapAlign: 'start' }}>
              <Link href={cat.href} style={{ textDecoration: "none" }}>
                <Box
                  sx={{
                    position: "relative",
                    width: '100%',
                    borderRadius: 1,
                    overflow: "hidden",
                    bgcolor: "transparent",
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'box-shadow 200ms ease, border-color 200ms ease',
                    willChange: 'box-shadow',
                    '&:hover': {
                      boxShadow: '0 10px 24px rgba(0,0,0,0.15)',
                    },
                    '&:hover .image-dim': { opacity: 0 },
                    '&:hover .view-text': { opacity: 1, transform: 'translateY(0)' },
                  }}
                  data-card
                >
                  <Box className="image-wrap" sx={{ position: 'relative', width: '100%', pt: '133%' }}>
                    {cat.image ? (
                      <Box
                        component="img"
                        src={cat.image}
                        alt={cat.alt || cat.name}
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          display: 'block',
                          objectFit: 'cover',
                          objectPosition: 'center',
                        }}
                      />
                    ) : null}
                    {/* Hover dim overlay (default dimmed; clears on hover) */}
                    <Box className="image-dim" sx={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', opacity: 1, transition: 'opacity 180ms ease', pointerEvents: 'none' }} />
                    {/* Overlay content */}
                    <Box sx={{ position: 'absolute', inset: 0, color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 2, textAlign: 'center', pointerEvents: 'none' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.75, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                      {cat.name}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.95, mb: 1, fontSize: { xs: '0.95rem', md: '1.05rem' } }}>
                      Discover our {cat.name.toLowerCase()} selection.
                    </Typography>
                    <Typography className="view-text" sx={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'underline', color: '#ffffff', opacity: 0, transform: 'translateY(6px)', transition: 'opacity 180ms ease, transform 180ms ease', mt: 1.5 }}>
                      View
                    </Typography>
                    </Box>
                  </Box>
                </Box>
              </Link>
            </Box>
          ))}
        </Box>
        {/* Slider tiles/pagination */}
        {pageCount > 1 && !isXlUp && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
            {Array.from({ length: pageCount }).map((_, i) => (
              <Box
                key={i}
                onClick={() => goToPage(i)}
                sx={{
                  width: 24,
                  height: 6,
                  borderRadius: 2,
                  bgcolor: i === activePage ? '#3b4d3c' : 'grey.400',
                  cursor: 'pointer'
                }}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}


