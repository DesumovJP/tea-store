"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

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
    <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: '0.25rem', border: '1px solid #e0e0e0', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', mb: 2 }}>
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
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3a2d', fontSize: '1rem', lineHeight: 1.2 }}>{item.name}</Typography>
            <Typography variant="body2" sx={{ color: '#5a6b5a', fontSize: '0.875rem', fontWeight: 500 }}>{item.categoryName || 'Premium Quality'}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, flexWrap: 'wrap' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3a2d', fontSize: '1.125rem' }}>${item.price.toFixed(2)}</Typography>
              <Typography variant="body2" sx={{ color: '#6b7c6b', fontSize: '0.875rem', fontWeight: 500 }}>/ 100g × {item.quantity}</Typography>
              <Typography variant="body2" sx={{ color: '#3b4d3c', fontSize: '0.875rem', fontWeight: 600 }}>= ${(item.price * item.quantity).toFixed(2)}</Typography>
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
            <Button size="small" onClick={() => onRemove(item.id)} className="btn btn--remove btn--sm" startIcon={<DeleteIcon />}>remove</Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}


