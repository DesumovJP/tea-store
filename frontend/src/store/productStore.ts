"use client";

import { create } from "zustand";
import type { Product } from "@/lib/graphql";

type ProductBySlug = Record<string, Product>;

type ProductStore = {
    bySlug: ProductBySlug;
    getBySlug: (slug: string) => Product | undefined;
    setBySlug: (slug: string, product: Product) => void;
    hasSlug: (slug: string) => boolean;
    clear: () => void;
};

export const useProductStore = create<ProductStore>((set, get) => ({
    bySlug: {},
    getBySlug: (slug) => get().bySlug[slug],
    setBySlug: (slug, product) => set((state) => ({ bySlug: { ...state.bySlug, [slug]: product } })),
    hasSlug: (slug) => Boolean(get().bySlug[slug]),
    clear: () => set({ bySlug: {} }),
}));













