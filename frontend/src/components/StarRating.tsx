"use client";

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

interface StarRatingProps {
  rating: number; // Rating from 0 to 5
  reviewCount: number;
  size?: "small" | "medium" | "large";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showReviewCount?: boolean;
  filledColor?: string;
  emptyColor?: string;
  variant?: "default" | "hipster"; // New prop to control styling
}

export default function StarRating({ 
  rating, 
  reviewCount, 
  size = "small", 
  interactive = false,
  onRatingChange,
  showReviewCount = true,
  filledColor = "#FFD700",
  emptyColor = "#BDBDBD",
  variant = "default"
}: StarRatingProps) {
  const starSize = size === "small" ? 16 : size === "medium" ? 20 : 24;
  const [hoverRating, setHoverRating] = useState(0);
  
  const handleStarClick = (starValue: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const handleStarHover = (starValue: number) => {
    if (interactive) {
      setHoverRating(starValue);
    }
  };

  const handleStarLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };
  
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: variant === "hipster" ? 0.25 : 0.5 }}>
        {[1, 2, 3, 4, 5].map((star) => {
          // Determine if star should be filled based on hover or rating
          const isFilled = interactive 
            ? (hoverRating > 0 ? star <= hoverRating : star <= rating)
            : star <= rating;
            
          return (
            <Box 
              key={star} 
              sx={{ 
                display: "flex", 
                alignItems: "center",
                cursor: interactive ? "pointer" : "default",
                ...(variant === "hipster" ? {
                  p: 0.25,
                  borderRadius: 0,
                  border: isFilled ? '2px solid #2c2c2c' : '2px solid #e0e0e0',
                  bgcolor: isFilled ? '#1a1a1a' : '#ffffff',
                  boxShadow: isFilled ? '1px 1px 0px #66bb6a' : '1px 1px 0px #cccccc',
                  transition: 'all 0.2s ease',
                  '&:hover': interactive ? {
                    transform: 'translateY(-1px)',
                    boxShadow: isFilled ? '2px 2px 0px #66bb6a' : '2px 2px 0px #2c2c2c',
                    borderColor: '#66bb6a'
                  } : {}
                } : {
                  transition: interactive ? "transform 0.2s ease" : "none",
                  "&:hover": interactive ? {
                    transform: "scale(1.1)"
                  } : {}
                })
              }}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => handleStarHover(star)}
              onMouseLeave={handleStarLeave}
            >
              {isFilled ? (
                <StarIcon 
                  sx={{ 
                    fontSize: starSize, 
                    color: filledColor,
                    fill: filledColor,
                    transition: 'all 0.2s ease'
                  }} 
                />
              ) : (
                <StarBorderIcon 
                  sx={{ 
                    fontSize: starSize, 
                    color: emptyColor,
                    transition: 'all 0.2s ease',
                    "&:hover": interactive && variant !== "hipster" ? {
                      transform: "scale(1.1)",
                      color: filledColor
                    } : {}
                  }} 
                />
              )}
            </Box>
          );
        })}
      </Box>
      {showReviewCount && (
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 0.5, 
          ml: variant === "hipster" ? 1 : 0.5,
          ...(variant === "hipster" ? {
            px: 1,
            py: 0.5,
            borderRadius: 0,
            border: '2px solid #2c2c2c',
            bgcolor: '#ffffff',
            boxShadow: '1px 1px 0px #66bb6a'
          } : {})
        }}>
          <ChatBubbleOutlineIcon 
            sx={{ 
              fontSize: size === "small" ? (variant === "hipster" ? 14 : 16) : size === "medium" ? (variant === "hipster" ? 16 : 18) : (variant === "hipster" ? 18 : 20),
              color: variant === "hipster" ? "#1a1a1a" : "#80858b"
            }}
          />
          <Typography 
            variant="caption" 
            sx={{ 
              color: variant === "hipster" ? "#1a1a1a" : "#80858b",
              fontSize: size === "small" ? (variant === "hipster" ? "0.7rem" : "0.75rem") : size === "medium" ? (variant === "hipster" ? "0.8rem" : "0.875rem") : (variant === "hipster" ? "0.9rem" : "1rem"),
              lineHeight: 1,
              ...(variant === "hipster" ? {
                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                letterSpacing: '-0.02em',
                textTransform: 'lowercase',
                fontWeight: 300
              } : {})
            }}
          >
            {reviewCount}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
