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
    <Box className={`rating ${interactive ? 'rating--interactive' : ''}`}>
      <Box className={`rating-stars rating-stars--${size}`}>
        {[1, 2, 3, 4, 5].map((star) => {
          // Determine if star should be filled based on hover or rating
          const isFilled = interactive 
            ? (hoverRating > 0 ? star <= hoverRating : star <= rating)
            : star <= rating;
            
          return (
            <Box 
              key={star} 
              className={`rating-star ${isFilled ? 'is-filled' : ''}`}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => handleStarHover(star)}
              onMouseLeave={handleStarLeave}
            >
              {isFilled ? (
                <StarIcon style={{ fontSize: starSize }} />
              ) : (
                <StarBorderIcon style={{ fontSize: starSize }} />
              )}
            </Box>
          );
        })}
      </Box>
      {showReviewCount && (
        <Box className="rating-count">{reviewCount}</Box>
      )}
    </Box>
  );
}
