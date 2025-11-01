"use client";

import { Box, Skeleton } from "@mui/material";

interface PageSkeletonProps {
  variant?: "product" | "catalog" | "home";
}

export default function PageSkeleton({ variant = "catalog" }: PageSkeletonProps) {
  if (variant === "product") {
    return (
      <Box className="skeleton-container">
        <Box className="skeleton-product-flex">
          {/* Left Panel Skeleton */}
          <Box className="skeleton-product-left">
            <Skeleton variant="text" height={18} width={100} />
            <Skeleton variant="text" height={40} width="80%" />
            <Skeleton variant="text" height={28} width={120} />
            <Skeleton variant="rectangular" height={200} />
            <Box className="skeleton-row-lg">
              <Skeleton variant="rectangular" height={40} width={150} />
              <Skeleton variant="text" height={18} width={120} />
            </Box>
            <Box className="skeleton-row-lg">
              <Skeleton variant="rectangular" height={48} width={150} />
              <Skeleton variant="rectangular" height={48} width={150} />
            </Box>
          </Box>
          
          {/* Right Panel Skeleton */}
          <Box style={{ flex: 1 }}>
            <Skeleton variant="rectangular" height={400} />
          </Box>
        </Box>
      </Box>
    );
  }

  if (variant === "catalog") {
    return (
      <Box className="skeleton-container">
        <Skeleton variant="text" height={40} width={200} />
        <Skeleton variant="text" height={22} width="60%" />
        
        {/* Category filters skeleton */}
        <Box className="skeleton-row-lg" style={{ flexWrap: 'wrap', marginBottom: 16 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} variant="rectangular" height={40} width={100} />
          ))}
        </Box>
        
        {/* Search and sort skeleton */}
        <Box className="skeleton-row-lg" style={{ marginBottom: 16 }}>
          <Skeleton variant="rectangular" height={40} width="60%" />
          <Skeleton variant="rectangular" height={40} width="30%" />
        </Box>
        
        {/* Products grid skeleton */}
        <Box className="skeleton-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Box key={i}>
              <Skeleton variant="rectangular" height={200} />
              <Skeleton variant="text" height={20} width="80%" />
              <Skeleton variant="text" height={18} width="60%" />
              <Skeleton variant="rectangular" height={36} width="100%" />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  // Home variant
  return (
    <Box>
      {/* Hero section skeleton */}
      <Box style={{ height: '35vh', position: 'relative' }}>
        <Skeleton variant="rectangular" height="100%" />
      </Box>
      
      {/* Content skeleton */}
      <Box className="skeleton-container">
        <Skeleton variant="text" height={40} width={200} />
        <Skeleton variant="text" height={22} width="60%" />
        
        {/* Products grid skeleton */}
        <Box className="skeleton-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Box key={i}>
              <Skeleton variant="rectangular" height={200} />
              <Skeleton variant="text" height={20} width="80%" />
              <Skeleton variant="text" height={18} width="60%" />
              <Skeleton variant="rectangular" height={36} width="100%" />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}












