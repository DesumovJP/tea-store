"use client";

import { Box, Typography } from "@mui/material";
import StarRating from "./StarRating";
import { Review } from "@/types/review";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

interface ReviewListProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export default function ReviewList({ reviews, averageRating, totalReviews }: ReviewListProps) {
  // Масив аватарок для відгуків
  const avatarImages = [
    'http://localhost:1337/uploads/121427_cfc9c427dc.jpg',
    'http://localhost:1337/uploads/184564a4131ed0ce4b79dd0e376493e7_3978a92d44.jpg',
    'http://localhost:1337/uploads/c9b6f424a544f3e1fa9a6d73b170b79e_6067558a03.jpg',
    'http://localhost:1337/uploads/b604e3255e270af521a2ec9007efdce0_d105da6920.jpg',
    'http://localhost:1337/uploads/9c822d62b4323f4265eb1f89638b4411_e5a0e79785.jpg'
  ];

  // Функція для отримання випадкової аватарки на основі documentId
  const getRandomAvatar = (documentId: string) => {
    const hash = documentId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const index = Math.abs(hash) % avatarImages.length;
    return avatarImages[index];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'short'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Don't render anything if there are no reviews
  if (reviews.length === 0) {
    return null;
  }

  return (
    <Box>
      <Box className="reviews-summary">
        <Typography variant="h6" className="reviews-title">Customer reviews</Typography>
        <Typography variant="body1" className="reviews-row">
          <Box component="span" className="reviews-score">{averageRating.toFixed(1)}</Box>
          <Box component="span" className="reviews-text"> out of 5 stars ({totalReviews} reviews)</Box>
        </Typography>
      </Box>

      {/* Reviews List */}
      <Box>
        {reviews.map((review) => (
            <Box key={review.documentId} className="review-card">

              {/* Header with user info */}
              <Box className="review-card-header">
                <Box component="img" src={getRandomAvatar(review.documentId)} alt={review.authorName} className="review-avatar" />
                <Box className="review-header-main">
                  {/* Top row: name left, date right */}
                  <Box className="review-header-top">
                    <Typography variant="subtitle2" className="review-author">{review.authorName}</Typography>
                    <Typography variant="caption" className="review-date">{formatDate(review.createdAt)}</Typography>
                  </Box>
                  {/* Bottom row: rating badge under the name */}
                  <Box className="review-header-bottom">
                    <Box className="review-rating-badge">
                      <StarRoundedIcon className="reviews-badge-star" />
                      <Typography variant="caption" className="reviews-badge-value">{(Number(review.rating) || 0).toFixed(1)}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Review content */}
              {review.comment && (
                <Box className="review-comment-wrap">
                  <Typography variant="body2" className="review-comment-body">{review.comment}</Typography>
                </Box>
              )}
            </Box>
          ))}
        </Box>
    </Box>
  );
}
