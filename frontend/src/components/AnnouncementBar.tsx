"use client";

import Box from "@mui/material/Box";
import Link from "next/link";
import { useEffect, useState } from "react";

const MESSAGES = [
  { text: "Свіжа поставка матча 💚", href: "/catalog?category=Matcha", linkTitle: "Матча" },
  { text: "Безкоштовна доставка від 2000 грн" },
  { text: "Спробуй справжній матча лате в саше", href: "/catalog?search=лате", linkTitle: "Матча в саше" },
  { text: "Новинки фермерського чаю 💕", href: "/catalog?tag=new" },
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [animPhase, setAnimPhase] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
      setAnimPhase((p) => p ^ 1);
    }, 4500);
    return () => window.clearInterval(t);
  }, []);

  const current = MESSAGES[index];

  return (
    <Box className="announcement-container">
        <Box className="announcement-left">
          <ul className="announcement-social">
            <li>
              <a className="social__link" href="https://www.facebook.com/matcher.kyiv" target="_blank" rel="noopener" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12.07C22 6.48 17.52 2 11.93 2 6.35 2 1.87 6.48 1.87 12.07c0 4.99 3.64 9.13 8.4 9.93v-7.02H7.9v-2.9h2.37V9.41c0-2.35 1.4-3.65 3.54-3.65 1.02 0 2.1.18 2.1.18v2.3h-1.18c-1.16 0-1.52.72-1.52 1.46v1.76h2.59l-.41 2.9h-2.18V22c4.76-.8 8.4-4.94 8.4-9.93z"/></svg>
              </a>
            </li>
            <li>
              <a className="social__link" href="https://instagram.com/matcher.store" target="_blank" rel="noopener" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zm5.75-3.25a1.25 1.25 0 1 1-1.25 1.25 1.25 1.25 0 0 1 1.25-1.25z"/></svg>
              </a>
            </li>
            <li>
              <a className="social__link" href="https://tiktok.com/@matcher.store" target="_blank" rel="noopener" aria-label="TikTok">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.6 6.3c1.1 1 2.5 1.7 4 1.8v3.2c-1.6 0-3.2-.5-4.5-1.3v5.9c0 3.8-3 6.9-6.8 6.9S3.5 19.7 3.5 15.9c0-3.8 3-6.9 6.8-6.9.4 0 .8 0 1.2.1v3.3c-.4-.1-.8-.1-1.2-.1-2 0-3.6 1.6-3.6 3.6 0 2 1.6 3.6 3.6 3.6 2 0 3.6-1.6 3.6-3.6V2h3.1c.3 1.6 1.1 3 2.2 4.3z"/></svg>
              </a>
            </li>
          </ul>
        </Box>
        <Box className="announcement-middle hero-text-enter" data-anim={animPhase}>
          {current.href ? (
            <Link href={current.href} className="announcement-link hero-line hero-line--1">
              {current.text}
            </Link>
          ) : (
            <span className="announcement-text hero-line hero-line--1">{current.text}</span>
          )}
        </Box>
        <Box className="announcement-right" />
    </Box>
  );
}


