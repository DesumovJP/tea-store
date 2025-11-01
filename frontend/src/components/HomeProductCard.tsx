"use client";

import ProductCard from "@/components/ProductCard";
import { useCartStore } from "@/store/cartStore";
import { triggerGlobalCartAnimation } from "@/hooks/useCartAnimation";
import type { Product as GqlProduct } from "@/lib/graphql";

export default function HomeProductCard({ product }: { product: GqlProduct }) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    addItem({
      id: product.documentId,
      name: product.title,
      price: product.price,
      quantity: 1,
      imageUrl: product.images?.[0]?.url ? `${process.env.NEXT_PUBLIC_CMS_URL}${product.images[0].url}` : undefined,
      categoryName: product.category?.name,
    });
    try { triggerGlobalCartAnimation(); } catch {}
  };

  return <ProductCard product={product} variant="catalog" onAddToCart={handleAdd} />;
}


