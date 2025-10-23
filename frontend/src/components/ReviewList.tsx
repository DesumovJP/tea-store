"use client";

import { Box, Typography, Divider, Avatar } from "@mui/material";
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

  return (
    <Box sx={{ mt: 3 }}>
      {/* Rating Summary */}
      <Box sx={{ 
        mb: 3, 
        p: 2, 
        bgcolor: "#ffffff", 
        border: '2px solid #2c2c2c',
        borderRadius: 0,
        boxShadow: '2px 2px 0px #66bb6a'
      }}>
        <Typography variant="h6" sx={{ 
          mb: 1, 
          fontWeight: 300,
          fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
          letterSpacing: '-0.02em',
          textTransform: 'lowercase',
          color: '#1a1a1a',
          fontSize: '1.5rem'
        }}>
          customer reviews
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 0.5, 
            px: 1.25, 
            py: 0.5, 
            borderRadius: 0, 
            bgcolor: '#1a1a1a', 
            border: '2px solid #2c2c2c',
            boxShadow: '2px 2px 0px #2c2c2c'
          }}>
            <StarRoundedIcon sx={{ color: '#ffffff', fontSize: '0.75rem' }} />
            <Typography variant="caption" sx={{ 
              fontWeight: 800, 
              color: '#ffffff',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
              textTransform: 'lowercase',
              letterSpacing: '0.02em'
            }}>
              {averageRating.toFixed(1)}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{
            color: '#1a1a1a',
            fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
            letterSpacing: '-0.02em',
            textTransform: 'lowercase',
            fontWeight: 300
          }}>
            out of 5 stars ({totalReviews} reviews)
          </Typography>
        </Box>
      </Box>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Typography variant="body2" sx={{ 
          textAlign: "center", 
          py: 4,
          color: '#1a1a1a',
          fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
          letterSpacing: '-0.02em',
          textTransform: 'lowercase',
          fontWeight: 300
        }}>
          no reviews yet. be the first to review this product!
        </Typography>
      ) : (
        <Box>
          {reviews.map((review, index) => (
            <Box key={review.documentId} sx={{ 
              border: '2px solid #2c2c2c',
              borderRadius: 0,
              bgcolor: '#ffffff',
              boxShadow: '2px 2px 0px #66bb6a',
              mb: 2,
              p: 2,
              position: 'relative'
            }}>

              {/* Header with user info */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, pb: 2, borderBottom: '2px solid #2c2c2c' }}>
                <Box
                  component="img"
                  src={getRandomAvatar(review.documentId)}
                  alt={review.authorName}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #2c2c2c',
                    flexShrink: 0
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ 
                      fontWeight: 800,
                      fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                      textTransform: 'lowercase',
                      letterSpacing: '0.01em',
                      color: '#1a1a1a'
                    }}>
                      {review.authorName}
                    </Typography>
                    <Box sx={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: 0.5, 
                      px: 1, 
                      py: 0.25, 
                      borderRadius: 0, 
                      bgcolor: '#1a1a1a', 
                      border: '2px solid #2c2c2c',
                      boxShadow: '1px 1px 0px #2c2c2c'
                    }}>
                      <StarRoundedIcon sx={{ color: '#ffffff', fontSize: '0.7rem' }} />
                      <Typography variant="caption" sx={{ 
                        fontWeight: 800, 
                        color: '#ffffff',
                        fontSize: '0.7rem',
                        fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                        textTransform: 'lowercase',
                        letterSpacing: '0.02em'
                      }}>
                        {review.rating}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ 
                    color: '#666666',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                    textTransform: 'lowercase',
                    letterSpacing: '0.02em'
                  }}>
                    {formatDate(review.createdAt)}
                  </Typography>
                </Box>
              </Box>

              {/* Review content with quotes positioned outside */}
              {review.comment && (
                <Box sx={{ position: 'relative', pl: 4, pr: 4 }}>
                  {/* Opening quote - positioned outside left */}
                  <Box sx={{
                    position: 'absolute',
                    top: '-0.5rem',
                    left: '0',
                    width: '1.25rem',
                    height: '1.25rem',
                    bgcolor: '#2c2c2c',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                    border: '1px solid #2c2c2c',
                    boxShadow: '1px 1px 0px #1a1a1a',
                    zIndex: 2
                  }}>
                    "
                  </Box>

                  {/* Closing quote - positioned outside right */}
                  <Box sx={{
                    position: 'absolute',
                    bottom: '-0.5rem',
                    right: '0',
                    width: '1rem',
                    height: '1rem',
                    bgcolor: '#2c2c2c',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    fontFamily: '"Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                    border: '1px solid #2c2c2c',
                    boxShadow: '1px 1px 0px #1a1a1a',
                    zIndex: 2
                  }}>
                    "
                  </Box>

                  <Typography variant="body2" sx={{ 
                    lineHeight: 1.6,
                    color: '#1a1a1a',
                    fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                    letterSpacing: '0.02em',
                    fontWeight: 400
                  }}>
                    {review.comment}
                  </Typography>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
