"use client";

import { create } from "zustand";
import type { Product, Category } from "@/lib/graphql";

type DataState = {
    // data
    products: Product[];
    categories: Category[];

    // loading flags
    isLoadingProducts: boolean;
    isLoadingCategories: boolean;

    // errors
    productsError: string | null;
    categoriesError: string | null;

    // cache timestamps (ms since epoch)
    productsUpdatedAt: number | null;
    categoriesUpdatedAt: number | null;

    // getters
    getProducts: () => Product[];
    getCategories: () => Category[];

    // cache validators
    isProductsCacheValid: () => boolean;
    isCategoriesCacheValid: () => boolean;

    // setters
    setProducts: (items: Product[]) => void;
    setCategories: (items: Category[]) => void;
    setProductsLoading: (loading: boolean) => void;
    setCategoriesLoading: (loading: boolean) => void;
    setProductsError: (message: string | null) => void;
    setCategoriesError: (message: string | null) => void;
};

// Default cache TTL: 5 minutes
const CACHE_TTL_MS = 5 * 60 * 1000;

export const useDataStore = create<DataState>((set, get) => ({
    products: [],
    categories: [],

    isLoadingProducts: false,
    isLoadingCategories: false,

    productsError: null,
    categoriesError: null,

    productsUpdatedAt: null,
    categoriesUpdatedAt: null,

    getProducts: () => get().products,
    getCategories: () => get().categories,

    isProductsCacheValid: () => {
        const { productsUpdatedAt, products } = get();
        if (!productsUpdatedAt || products.length === 0) return false;
        return Date.now() - productsUpdatedAt < CACHE_TTL_MS;
    },
    isCategoriesCacheValid: () => {
        const { categoriesUpdatedAt, categories } = get();
        if (!categoriesUpdatedAt || categories.length === 0) return false;
        return Date.now() - categoriesUpdatedAt < CACHE_TTL_MS;
    },

    setProducts: (items) => set({ products: items, productsUpdatedAt: Date.now() }),
    setCategories: (items) => set({ categories: items, categoriesUpdatedAt: Date.now() }),
    setProductsLoading: (loading) => set({ isLoadingProducts: loading }),
    setCategoriesLoading: (loading) => set({ isLoadingCategories: loading }),
    setProductsError: (message) => set({ productsError: message }),
    setCategoriesError: (message) => set({ categoriesError: message }),
}));












