"use client";

import { useState } from "react";
import { Box, Typography, TextField, Button, Paper, Alert, CircularProgress } from "@mui/material";
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
      <Paper elevation={0} className="review-form" style={{ border: 'none' }}>
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
    <Paper elevation={0} className="review-form">
      <Typography variant="h6" className="review-form-title">write a review</Typography>
      
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
        <Box className="review-form-field">
          <Typography variant="subtitle2" className="reviews-text">rating *</Typography>
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

        <Box className="review-form-field review-field input input--light">
          <TextField
            fullWidth
            label="your name *"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
            className="input"
          />
          <TextField
            fullWidth
            label="your email *"
            type="email"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            required
            className="input"
          />
        </Box>

        <Box className="review-form-field review-field input input--light">
          <TextField
            fullWidth
            label="your review (optional)"
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="share your experience with this product..."
            className="input"
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting || rating === 0}
          className="btn btn--dark"
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
