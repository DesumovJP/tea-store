"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export const usePageLoading = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Add loading class to body and html
    document.body.classList.add('loading');
    document.body.classList.remove('loaded');
    document.documentElement.classList.add('loading');
    document.documentElement.classList.remove('loaded');

    // Set a timeout to show content after page is ready
    const timer = setTimeout(() => {
      document.body.classList.remove('loading');
      document.body.classList.add('loaded');
      document.documentElement.classList.remove('loading');
      document.documentElement.classList.add('loaded');
      
      // Add show-footer class after additional delay
      const showFooterDelay = process.env.NODE_ENV === 'development' ? 300 : 100;
      setTimeout(() => {
        document.body.classList.add('show-footer');
        document.documentElement.classList.add('show-footer');
      }, showFooterDelay);
    }, 200); // 200ms delay to ensure smooth transition

    return () => {
      clearTimeout(timer);
    };
  }, [pathname]); // Trigger on route change

  return null;
};
