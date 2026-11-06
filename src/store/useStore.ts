import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/data/products";

export type CartLine = { product: Product; quantity: number; size: string };
export type Order = {
  id: string;
  date: string;
  total: number;
  status: string;
  items: CartLine[];
  email: string;
  address: string;
};

type Store = {
  cart: CartLine[];
  wishlist: string[];
  orders: Order[];
  drawerOpen: boolean;
  customProducts: Product[];
  hiddenProductIds: string[];
  addToCart: (product: Product, quantity?: number, size?: string) => void;
  setQuantity: (id: string, size: string, quantity: number) => void;
  removeFromCart: (id: string, size: string) => void;
  toggleWishlist: (id: string) => void;
  setDrawer: (open: boolean) => void;
  placeOrder: (order: Order) => void;
  updateOrder: (id: string, status: string) => void;
  clearCart: () => void;
  saveProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
};

export const useStore = create<Store>()(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      orders: [],
      drawerOpen: false,
      customProducts: [],
      hiddenProductIds: [],
      addToCart: (product, quantity = 1, size = product.sizes[0]) =>
        set((s) => {
          const found = s.cart.find((x) => x.product.id === product.id && x.size === size);
          return {
            cart: found
              ? s.cart.map((x) =>
                  x === found
                    ? { ...x, quantity: Math.min(product.stock, x.quantity + quantity) }
                    : x,
                )
              : [...s.cart, { product, quantity, size }],
            drawerOpen: true,
          };
        }),
      setQuantity: (id, size, quantity) =>
        set((s) => ({
          cart: s.cart.map((x) =>
            x.product.id === id && x.size === size
              ? { ...x, quantity: Math.max(1, Math.min(x.product.stock, quantity)) }
              : x,
          ),
        })),
      removeFromCart: (id, size) =>
        set((s) => ({ cart: s.cart.filter((x) => !(x.product.id === id && x.size === size)) })),
      toggleWishlist: (id) =>
        set((s) => ({
          wishlist: s.wishlist.includes(id)
            ? s.wishlist.filter((x) => x !== id)
            : [...s.wishlist, id],
        })),
      setDrawer: (drawerOpen) => set({ drawerOpen }),
      placeOrder: (order) => set((s) => ({ orders: [order, ...s.orders], cart: [] })),
      updateOrder: (id, status) =>
        set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)) })),
      clearCart: () => set({ cart: [] }),
      saveProduct: (product) =>
        set((s) => ({
          customProducts: [...s.customProducts.filter((p) => p.id !== product.id), product],
          hiddenProductIds: s.hiddenProductIds.filter((id) => id !== product.id),
        })),
      deleteProduct: (id) =>
        set((s) => ({
          customProducts: s.customProducts.filter((p) => p.id !== id),
          hiddenProductIds: [...new Set([...s.hiddenProductIds, id])],
        })),
    }),
    { name: "lw-jewelry-store" },
  ),
);

export const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
