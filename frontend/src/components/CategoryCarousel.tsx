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
    <Box className="cat-carousel-root" style={{ paddingTop: '12px', paddingBottom: '24px', paddingLeft: '2%', paddingRight: '2%' }}>
      <Typography variant="h5" align="center" className="section-title" style={{ fontWeight: 700, marginBottom: 12 }}>
        Our Premium Tea
      </Typography>
      <Container maxWidth={false} className="cat-carousel-wrap" ref={containerRef}>

        {/* Scroller */}
        <Box
          ref={scrollerRef}
          onScroll={handleScroll}
          className={`cat-carousel-scroller ${isCarousel ? 'flow' : 'grid'}`}
          style={{
            gap: isMdUp ? 24 : 16,
            gridAutoColumns: isCarousel ? `calc((100% - ${(columns - 1)} * ${(isMdUp ? 24 : 16)}px) / ${columns})` : undefined,
          }}
        >
          {items.map((cat) => (
            <Box key={cat.name}>
              <Link href={cat.href} className="catalog-product-card-link">
                <Box className="cat-carousel-card" data-card>
                  <Box className="cat-carousel-image-wrap">
                    {cat.image ? (
                      <Box component="img" src={cat.image} alt={cat.alt || cat.name} className="cat-carousel-image" />
                    ) : null}
                    {/* Hover dim overlay (default dimmed; clears on hover) */}
                    <Box className="cat-carousel-dim" />
                    {/* Overlay content */}
                    <Box className="cat-carousel-overlay">
                    <Typography variant="h6" className="cat-carousel-name">
                      {cat.name}
                    </Typography>
                    <Typography variant="caption" className="cat-carousel-sub">
                      Discover our {cat.name.toLowerCase()} selection.
                    </Typography>
                    <Typography className="cat-carousel-view">
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
          <Box className="cat-carousel-dots">
            {Array.from({ length: pageCount }).map((_, i) => (
              <Box
                key={i}
                onClick={() => goToPage(i)}
                className={`cat-carousel-dot ${i === activePage ? 'cat-carousel-dot--active' : ''}`}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}


