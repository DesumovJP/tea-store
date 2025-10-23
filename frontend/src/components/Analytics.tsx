"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window { gtag: (...args: any[]) => void }
}

function loadGa(measurementId: string) {
  if (!measurementId) return;
  if (document.getElementById("ga4-script")) return;

  const s1 = document.createElement("script");
  s1.id = "ga4-script";
  s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(s1);

  const s2 = document.createElement("script");
  s2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);} 
    gtag('js', new Date());
    gtag('config', '${measurementId}', { send_page_view: false });
  `;
  document.head.appendChild(s2);
}

export default function Analytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!measurementId) return;
    loadGa(measurementId);
  }, [measurementId]);

  useEffect(() => {
    if (!measurementId) return;
    if (typeof window === "undefined" || !window.gtag) return;
    const url = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`;
    window.gtag("event", "page_view", { page_path: url });
  }, [measurementId, pathname, searchParams]);

  return null;
}


