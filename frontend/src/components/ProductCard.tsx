"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import CartIcon from "@/components/icons/CartIcon";
import AddToCartButton from "@/components/AddToCartButton";
import { calculateAverageRating, type Product as GqlProduct } from "@/lib/graphql";

type ProductCardProps = {
  product: GqlProduct;
  variant?: "home" | "catalog";
  onAddToCart?: () => void;
};

export default function ProductCard({ product, variant = "catalog", onAddToCart }: ProductCardProps) {
  const href = `/catalog/${product.slug || product.documentId}`;
  const reviewsCount = product.reviews?.length || 0;
  const avgRating = reviewsCount > 0 ? calculateAverageRating(product.reviews || []).toFixed(1) : null;

  return (
    <Link href={href} className="catalog-product-card-link">
      <Box className="product-card">
        <Box className="product-card-content">
          {/* Header: title + add button; meta row under title */}
          <Box className="product-card-header">
            <Box className="product-card-header-text">
              <Typography className="product-card-title">{product.title}</Typography>
              <Box className="product-card-meta">
                {avgRating && (
                  <Box className="product-rating-badge rating-badge">
                    <StarRoundedIcon className="product-rating-star rating-badge-star" />
                    <Typography variant="caption" className="product-rating-value rating-badge-value">{avgRating}</Typography>
                  </Box>
                )}
                <Typography className="product-card-price-badge">${(product.price || 0).toFixed(2)}</Typography>
              </Box>
            </Box>

            {onAddToCart ? (
              <Button
                className="btn btn--sm product-card-add-button catalog-add-to-cart-button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddToCart();
                }}
              >
                <span className="catalog-add-button-plus">+</span>
                <CartIcon size={20} className="catalog-add-button-icon" />
              </Button>
            ) : null}
          </Box>

          {/* Rating moved into meta row */}

          {/* Image */}
          <Box className="product-card-image-container">
            {product.images?.[0]?.url ? (
              <CardMedia
                component="img"
                image={`${process.env.NEXT_PUBLIC_CMS_URL}${product.images[0].url}`}
                alt={product.images?.[0]?.alternativeText || product.title}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                className="product-card-image"
              />
            ) : (
              <Box className="product-card-missing-image">
                <Box component="svg" width={88} height={88} viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="30" fill="#f5f9f5" />
                  <g fill="currentColor">
                    <path d="M10 24c0-1.657 1.343-3 3-3h28c1.657 0 3 1.343 3 3v8c0 7.732-6.268 14-14 14h-6C16.268 46 10 39.732 10 32v-8z" />
                    <path d="M44 26h4a6 6 0 0 1 0 12h-2.5a2 2 0 1 1 0-4H48a 2 2 0 0 0 0-4h-4v-4z" />
                    <path d="M12 50h40a2 2 0 1 1 0 4H12a2 2 0 1 1 0-4z" />
                    <path d="M24 10c1 2-2 4-2 6s3 4 2 6c-1-2-4-4-4-6s3-4 4-6zm10 0c1 2-2 4-2 6s3 4 2 6c-1-2-4-4-4-6s3-4 4-6z" />
                  </g>
                </Box>
              </Box>
            )}
          </Box>

          {/* Description Overlay */}
          <Box className="product-card-description-overlay">
            <Typography className="product-card-description-text">{product.description || "Learn more"}</Typography>
          </Box>
        </Box>
      </Box>
    </Link>
  );
}


