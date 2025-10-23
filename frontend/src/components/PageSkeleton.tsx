"use client";

import { Box, Skeleton } from "@mui/material";

interface PageSkeletonProps {
  variant?: "product" | "catalog" | "home";
}

export default function PageSkeleton({ variant = "catalog" }: PageSkeletonProps) {
  if (variant === "product") {
    return (
      <Box sx={{ 
        maxWidth: '100%', 
        mx: 'auto', 
        px: { xs: '1.25rem', sm: '15%', md: '25%' }, 
        py: { xs: '1.875rem', md: '5rem' }
      }}>
        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Left Panel Skeleton */}
          <Box sx={{ flex: 1, pr: { md: 6 } }}>
            <Skeleton variant="text" sx={{ fontSize: '0.75rem', width: '100px', mb: 2 }} />
            <Skeleton variant="text" sx={{ fontSize: '2.5rem', width: '80%', mb: 4 }} />
            <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '120px', mb: 6 }} />
            <Skeleton variant="rectangular" height={200} sx={{ mb: 4 }} />
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Skeleton variant="rectangular" height={40} width={120} />
              <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '100px' }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Skeleton variant="rectangular" height={48} width={150} />
              <Skeleton variant="rectangular" height={48} width={150} />
            </Box>
          </Box>
          
          {/* Right Panel Skeleton */}
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="rectangular" height={400} />
          </Box>
        </Box>
      </Box>
    );
  }

  if (variant === "catalog") {
    return (
      <Box sx={{ 
        maxWidth: '100%', 
        mx: 'auto', 
        px: { xs: '1.25rem', sm: '15%', md: '25%' }, 
        py: { xs: '1.875rem', md: '5rem' }
      }}>
        <Skeleton variant="text" sx={{ fontSize: '2rem', width: '200px', mb: 2 }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', width: '60%', mb: 4 }} />
        
        {/* Category filters skeleton */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} variant="rectangular" height={40} width={100} />
          ))}
        </Box>
        
        {/* Search and sort skeleton */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Skeleton variant="rectangular" height={40} width="60%" />
          <Skeleton variant="rectangular" height={40} width="30%" />
        </Box>
        
        {/* Products grid skeleton */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Box key={i}>
              <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
              <Skeleton variant="text" sx={{ fontSize: '1rem', width: '80%', mb: 1 }} />
              <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '60%', mb: 2 }} />
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
      <Box sx={{ height: { xs: '35vh', md: '35vh' }, position: 'relative' }}>
        <Skeleton variant="rectangular" height="100%" />
      </Box>
      
      {/* Content skeleton */}
      <Box sx={{ 
        maxWidth: '100%', 
        mx: 'auto', 
        px: { xs: '1.25rem', sm: '15%', md: '25%' }, 
        py: { xs: '1.875rem', md: '5rem' }
      }}>
        <Skeleton variant="text" sx={{ fontSize: '2rem', width: '200px', mb: 2 }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', width: '60%', mb: 4 }} />
        
        {/* Products grid skeleton */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Box key={i}>
              <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
              <Skeleton variant="text" sx={{ fontSize: '1rem', width: '80%', mb: 1 }} />
              <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '60%', mb: 2 }} />
              <Skeleton variant="rectangular" height={36} width="100%" />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}









