import { useEffect, useCallback } from "react";
import { useDataStore } from "@/store/dataStore";
import { fetchProducts, fetchCategories, type Product, type Category } from "@/lib/graphql";

export function useCachedProducts() {
    const {
        getProducts,
        isProductsCacheValid,
        isLoadingProducts,
        productsError,
        setProducts,
        setProductsLoading,
        setProductsError,
    } = useDataStore();

    const loadProducts = useCallback(async (forceRefresh = false) => {
        // Return cached data if valid and not forcing refresh
        if (!forceRefresh && isProductsCacheValid()) {
            return getProducts();
        }

        // Don't start loading if already loading
        if (isLoadingProducts) {
            return getProducts();
        }

        setProductsLoading(true);
        setProductsError(null);

        try {
            const products = await fetchProducts();
            setProducts(products);
            return products;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
            setProductsError(errorMessage);
            console.error('Error fetching products:', error);
            return getProducts(); // Return cached data if available
        } finally {
            setProductsLoading(false);
        }
    }, [
        getProducts,
        isProductsCacheValid,
        isLoadingProducts,
        setProducts,
        setProductsLoading,
        setProductsError,
    ]);

    // Auto-load on mount if no valid cache
    useEffect(() => {
        if (!isProductsCacheValid()) {
            loadProducts();
        }
    }, [isProductsCacheValid, loadProducts]);

    return {
        products: getProducts(),
        isLoading: isLoadingProducts,
        error: productsError,
        loadProducts,
        refreshProducts: () => loadProducts(true),
    };
}

export function useCachedCategories() {
    const {
        getCategories,
        isCategoriesCacheValid,
        isLoadingCategories,
        categoriesError,
        setCategories,
        setCategoriesLoading,
        setCategoriesError,
    } = useDataStore();

    const loadCategories = useCallback(async (forceRefresh = false) => {
        // Return cached data if valid and not forcing refresh
        if (!forceRefresh && isCategoriesCacheValid()) {
            return getCategories();
        }

        // Don't start loading if already loading
        if (isLoadingCategories) {
            return getCategories();
        }

        setCategoriesLoading(true);
        setCategoriesError(null);

        try {
            const categories = await fetchCategories();
            setCategories(categories);
            return categories;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories';
            setCategoriesError(errorMessage);
            console.error('Error fetching categories:', error);
            return getCategories(); // Return cached data if available
        } finally {
            setCategoriesLoading(false);
        }
    }, [
        getCategories,
        isCategoriesCacheValid,
        isLoadingCategories,
        setCategories,
        setCategoriesLoading,
        setCategoriesError,
    ]);

    // Auto-load on mount if no valid cache
    useEffect(() => {
        if (!isCategoriesCacheValid()) {
            loadCategories();
        }
    }, [isCategoriesCacheValid, loadCategories]);

    return {
        categories: getCategories(),
        isLoading: isLoadingCategories,
        error: categoriesError,
        loadCategories,
        refreshCategories: () => loadCategories(true),
    };
}

// Combined hook for both products and categories
export function useCachedData() {
    const products = useCachedProducts();
    const categories = useCachedCategories();

    const refreshAll = useCallback(() => {
        products.refreshProducts();
        categories.refreshCategories();
    }, [products.refreshProducts, categories.refreshCategories]);

    return {
        products: products.products,
        categories: categories.categories,
        isLoadingProducts: products.isLoading,
        isLoadingCategories: categories.isLoading,
        isLoading: products.isLoading || categories.isLoading,
        productsError: products.error,
        categoriesError: categories.error,
        hasError: Boolean(products.error || categories.error),
        refreshAll,
        refreshProducts: products.refreshProducts,
        refreshCategories: categories.refreshCategories,
    };
}












