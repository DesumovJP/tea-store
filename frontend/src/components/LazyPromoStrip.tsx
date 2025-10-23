"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Lazy load PromoStrip component with no SSR
const PromoStrip = dynamic(() => import("./PromoStrip"), {
  ssr: false,
  loading: () => null // Don't show anything while loading
});

interface LazyPromoStripProps {
  isCartPage: boolean;
}

export default function LazyPromoStrip({ isCartPage }: LazyPromoStripProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    // Check if page is fully loaded
    const checkPageLoaded = () => {
      if (document.readyState === 'complete') {
        setIsPageLoaded(true);
        // Additional delay to ensure smooth transition
        const delay = process.env.NODE_ENV === 'development' ? 800 : 400;
        setTimeout(() => {
          setShouldRender(true);
        }, delay);
      }
    };

    // Check immediately
    checkPageLoaded();

    // Also listen for load event
    window.addEventListener('load', checkPageLoaded);

    return () => {
      window.removeEventListener('load', checkPageLoaded);
    };
  }, []);

  // Don't render anything until page is fully loaded
  if (isCartPage || !isPageLoaded || !shouldRender) {
    return null;
  }

  return (
    <div 
      data-component="promo-strip" 
      className="loaded"
      style={{ 
        opacity: 0,
        transform: 'translateY(20px)',
        transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out'
      }}
      onLoad={() => {
        // Trigger animation after component is loaded
        setTimeout(() => {
          const element = document.querySelector('[data-component="promo-strip"]') as HTMLElement;
          if (element) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
          }
        }, 100);
      }}
    >
      <PromoStrip />
    </div>
  );
}
