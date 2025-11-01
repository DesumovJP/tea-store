"use client";

import Box from "@mui/material/Box";

type CartIconProps = {
  size?: number;
  sx?: any;
  strokeWidth?: number;
  className?: string;
};

export default function CartIcon({ size = 20, sx, strokeWidth = 2, className }: CartIconProps) {
  return (
    <Box
      component="svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      sx={sx}
      className={className}
      aria-hidden
      focusable={false}
    >
      <path
        d="M3 3h2l.5 2.5M6 7h14l-2 7H8.5L7 7m0 0H4.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="20" r="1.5" stroke="currentColor" strokeWidth={strokeWidth} />
      <circle cx="17" cy="20" r="1.5" stroke="currentColor" strokeWidth={strokeWidth} />
    </Box>
  );
}


