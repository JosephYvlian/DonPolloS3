import { create } from 'zustand';
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

export const useStore = create<AppState>((set, get) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    cart: [],
    isCartOpen: false,
    setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
    setUser: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token });
    },
    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, cart: [] });
    },
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
}));
