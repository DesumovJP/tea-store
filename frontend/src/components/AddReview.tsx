"use client";

import { useState } from "react";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  Alert,
  CircularProgress
} from "@mui/material";
import StarRating from "./StarRating";

interface AddReviewProps {
  productId: string;
  onReviewAdded?: () => void;
}

export default function AddReview({ productId, onReviewAdded }: AddReviewProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setMessage({ type: 'error', text: 'Please select a rating' });
      return;
    }

    if (!authorName.trim() || !authorEmail.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          comment: comment.trim() || null,
          authorName: authorName.trim(),
          authorEmail: authorEmail.trim(),
          productId,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Thank you for your review! It will be published after moderation.' });
        setRating(0);
        setComment("");
        setAuthorName("");
        setAuthorEmail("");
        onReviewAdded?.();
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to submit review' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If review was successfully submitted, show only success message
  if (message?.type === 'success') {
    return (
      <Paper elevation={0} sx={{ p: 3, mt: 3, border: 'none', boxShadow: 'none' }}>
        <Alert 
          severity="success" 
          sx={{ mb: 0 }}
        >
          {message.text}
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ 
      p: 3, 
      mt: 3, 
      border: '2px solid #2c2c2c', 
      borderRadius: 0,
      bgcolor: '#ffffff',
      boxShadow: '2px 2px 0px #66bb6a'
    }}>
      <Typography variant="h6" sx={{ 
        mb: 2, 
        fontWeight: 300,
        fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
        letterSpacing: '-0.02em',
        textTransform: 'lowercase',
        color: '#1a1a1a',
        fontSize: '1.5rem'
      }}>
        write a review
      </Typography>
      
      {message && (
        <Alert 
          severity={message.type} 
          sx={{ mb: 2 }}
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ 
            mb: 1, 
            fontWeight: 300,
            fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
            letterSpacing: '-0.02em',
            textTransform: 'lowercase',
            color: '#1a1a1a'
          }}>
            rating *
          </Typography>
          <StarRating 
            rating={rating} 
            reviewCount={0} 
            size="medium"
            interactive={true}
            onRatingChange={setRating}
            showReviewCount={false}
            variant="hipster"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="your name *"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 0,
                border: '1px solid #2c2c2c',
                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                letterSpacing: '-0.02em',
                textTransform: 'lowercase',
                fontWeight: 300,
                '&:hover': {
                  border: '1px solid #66bb6a',
                  boxShadow: '1px 1px 0px #2c2c2c'
                },
                '&.Mui-focused': {
                  border: '1px solid #66bb6a',
                  boxShadow: '1px 1px 0px #2c2c2c'
                }
              },
              '& .MuiInputLabel-root': {
                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                letterSpacing: '-0.02em',
                textTransform: 'lowercase',
                fontWeight: 300,
                color: '#1a1a1a'
              }
            }}
          />
          <TextField
            fullWidth
            label="your email *"
            type="email"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            required
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 0,
                border: '1px solid #2c2c2c',
                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                letterSpacing: '-0.02em',
                textTransform: 'lowercase',
                fontWeight: 300,
                '&:hover': {
                  border: '1px solid #66bb6a',
                  boxShadow: '1px 1px 0px #2c2c2c'
                },
                '&.Mui-focused': {
                  border: '1px solid #66bb6a',
                  boxShadow: '1px 1px 0px #2c2c2c'
                }
              },
              '& .MuiInputLabel-root': {
                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                letterSpacing: '-0.02em',
                textTransform: 'lowercase',
                fontWeight: 300,
                color: '#1a1a1a'
              }
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="your review (optional)"
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="share your experience with this product..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 0,
                border: '1px solid #2c2c2c',
                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                letterSpacing: '-0.02em',
                textTransform: 'lowercase',
                fontWeight: 300,
                '&:hover': {
                  border: '1px solid #66bb6a',
                  boxShadow: '1px 1px 0px #2c2c2c'
                },
                '&.Mui-focused': {
                  border: '1px solid #66bb6a',
                  boxShadow: '1px 1px 0px #2c2c2c'
                }
              },
              '& .MuiInputLabel-root': {
                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                letterSpacing: '-0.02em',
                textTransform: 'lowercase',
                fontWeight: 300,
                color: '#1a1a1a'
              }
            }}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting || rating === 0}
          sx={{ 
            minWidth: 120,
            textTransform: "uppercase",
            fontWeight: 800,
            fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
            letterSpacing: '0.05em',
            borderRadius: 0,
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            border: '2px solid #2c2c2c',
            boxShadow: '3px 3px 0px #66bb6a',
            '&:hover': { 
              backgroundColor: '#66bb6a',
              color: '#ffffff',
              transform: 'translateY(-1px) translateX(-1px)',
              boxShadow: '4px 4px 0px #1a1a1a',
              borderColor: '#66bb6a'
            },
            '&.Mui-disabled': { 
              backgroundColor: '#cccccc',
              color: '#666666',
              border: '2px solid #cccccc',
              boxShadow: 'none'
            }
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "submit review"
          )}
        </Button>
      </form>
    </Paper>
  );
}
