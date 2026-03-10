import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Usuario, Producto } from '../types';

interface CartItem {
    producto: Producto;
    cantidad: number;
}

interface AppState {
    user: Usuario | null;
    token: string | null;
    cart: CartItem[];
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    setUser: (user: Usuario, token: string) => void;
    logout: () => void;
    addToCart: (producto: Producto) => void;
    removeFromCart: (productoId: number) => void;
    clearCart: () => void;
    cartTotal: () => number;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            cart: [],
            isCartOpen: false,
            setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
            setUser: (user, token) => set({ user, token }),
            logout: () => set({ user: null, token: null, cart: [] }),
    addToCart: (producto) => {
        const { cart } = get();
        const existing = cart.find(item => item.producto.id === producto.id);
        if (existing) {
            if (existing.cantidad < producto.stockDisponible) {
                set({ cart: cart.map(item => item.producto.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item) });
            }
        } else {
            set({ cart: [...cart, { producto, cantidad: 1 }] });
        }
    },
    removeFromCart: (productoId) => {
        set({ cart: get().cart.filter(item => item.producto.id !== productoId) });
    },
    clearCart: () => set({ cart: [] }),
    cartTotal: () => get().cart.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0),
        }),
        {
            name: 'donpollo-storage',
            partialize: (state) => ({ user: state.user, token: state.token, cart: state.cart }),
        }
    )
);
