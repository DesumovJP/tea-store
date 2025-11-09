"use client";

import { Box, Typography } from "@mui/material";
import Link from "next/link";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const HomeIcon = ({ sx }: { sx?: any }) => (
  <Box component="svg" width={18} height={18} viewBox="0 0 24 24" fill="none" sx={sx}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Box>
);

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <Box className="product-breadcrumbs">
      {items.map((item, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {item.href ? (
            <Link href={item.href} className="link-unstyled">
              {item.label.toLowerCase() === 'home' ? (
                <HomeIcon sx={{ color: '#1a1a1a', display: 'flex', alignItems: 'center' }} />
              ) : (
                <Typography variant="body2" className="breadcrumb-text">
                  {item.label}
                </Typography>
              )}
            </Link>
          ) : (
            <Typography variant="body2" className="breadcrumb-text">
              {item.label}
            </Typography>
          )}
          {index < items.length - 1 && <ChevronRightIcon className="icon-chevron" />}
        </Box>
      ))}
    </Box>
  );
}

