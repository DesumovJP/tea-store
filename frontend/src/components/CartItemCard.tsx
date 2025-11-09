"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export type CartItemData = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  categoryName?: string | null;
};

export default function CartItemCard({
  item,
  onRemove,
  onUpdateQty,
}: {
  item: CartItemData;
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
}) {
  return (
    <Box sx={{ 
        p: { xs: 1.5, md: 2 }, 
        bgcolor: '#ffffff', 
        borderRadius: 0, 
        border: '0.5px solid rgba(0,0,0,0.06)', 
        boxShadow: 
            '0 1px 2px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.02)',
        mb: 2,
        transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease'
    }}>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 4, md: 4 }}>
          <Box sx={{ width: '100%', height: { xs: '6rem', md: '8rem' }, borderRadius: '0.25rem', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {item.imageUrl ? (
              <CardMedia component="img" image={item.imageUrl} alt={item.name} sx={{ width: '100%', height: '100%', objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }} />
            ) : (
              <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary', fontSize: '0.75rem' }}>No Image</Box>
            )}
          </Box>
        </Grid>
        <Grid size={{ xs: 5, md: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                color: '#1a1a1a', 
                fontSize: { xs: '0.95rem', md: '1rem' }, 
                lineHeight: 1.3,
                fontFamily: 'var(--heading-font)',
                letterSpacing: '-0.01em',
                mb: 0.5
            }}>{item.name}</Typography>
            <Typography variant="body2" sx={{ 
                color: '#6b7280', 
                fontSize: '0.875rem', 
                fontWeight: 300,
                fontFamily: 'var(--app-font)',
                letterSpacing: '-0.01em',
                mb: 1
            }}>{item.categoryName || 'Premium Quality'}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, flexWrap: 'wrap', mb: 1.5 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                color: '#1a1a1a', 
                fontSize: { xs: '1rem', md: '1.125rem' },
                fontFamily: 'var(--app-font)',
                letterSpacing: '-0.01em'
              }}>${item.price.toFixed(2)}</Typography>
              <Typography variant="body2" sx={{ 
                color: '#6b7280', 
                fontSize: '0.875rem', 
                fontWeight: 300,
                fontFamily: 'var(--app-font)',
                letterSpacing: '-0.01em'
              }}>/ 100g × {item.quantity}</Typography>
              <Typography variant="body2" sx={{ 
                color: '#1a1a1a', 
                fontSize: '0.875rem', 
                fontWeight: 500,
                fontFamily: 'var(--app-font)',
                letterSpacing: '-0.01em'
              }}>= ${(item.price * item.quantity).toFixed(2)}</Typography>
            </Box>
            <Box className="qty-box">
              <IconButton size="small" onClick={() => onUpdateQty(item.id, Math.max(1, item.quantity - 1))} className="qty-btn qty-btn--left">
                <RemoveIcon sx={{ fontSize: '0.875rem' }} />
              </IconButton>
              <Box className="qty-count"><Typography variant="body2" className="qty-count-text">{item.quantity.toString().padStart(2, '0')}</Typography></Box>
              <IconButton size="small" onClick={() => onUpdateQty(item.id, item.quantity + 1)} className="qty-btn">
                <AddIcon sx={{ fontSize: '0.875rem' }} />
              </IconButton>
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 3, md: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <IconButton size="small" onClick={() => onRemove(item.id)} className="cart-remove-icon" aria-label="remove item">
              <DeleteOutlineIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}


