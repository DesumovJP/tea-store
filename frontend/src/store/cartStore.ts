import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    categoryName?: string;
};

type CartState = {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
};

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            addItem: (item) =>
                set((state) => {
                    const existing = state.items.find((i) => i.id === item.id);
                    if (existing) {
                        return {
                            items: state.items.map((i) =>
                                i.id === item.id
                                    ? {
                                        ...i,
                                        quantity: i.quantity + item.quantity,
                                        imageUrl: i.imageUrl || item.imageUrl,
                                        categoryName: i.categoryName || item.categoryName,
                                    }
                                    : i
                            ),
                        };
                    }
                    return { items: [...state.items, item] };
                }),
            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((i) => i.id !== id),
                })),
            updateQuantity: (id, quantity) =>
                set((state) => ({
                    items: quantity <= 0 
                        ? state.items.filter((i) => i.id !== id)
                        : state.items.map((i) =>
                            i.id === id ? { ...i, quantity } : i
                        ),
                })),
            clearCart: () => set({ items: [] }),
        }),
        {
            name: "guru-tea-cart",
            storage: createJSONStorage(() => {
                if (typeof window !== 'undefined') {
                    return localStorage;
                }
                return {
                    getItem: () => null,
                    setItem: () => {},
                    removeItem: () => {},
                };
            }),
        }
    )
);
