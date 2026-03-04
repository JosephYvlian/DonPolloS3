import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { useStore } from '../store/useStore';
import type { Producto } from '../types';
import { ShoppingCart, Check, PackageOpen } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatCurrency';

export default function Home() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart, cart, setIsCartOpen } = useStore();

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await api.get('/productos');
                setProductos(response.data);
            } catch (err) {
                console.error('Error fetching productos', err);
                toast.error('Ocurrió un error al cargar el catálogo');
            } finally {
                setLoading(false);
            }
        };
        fetchProductos();
    }, []);

    const handleAddToCart = (producto: Producto) => {
        const cartItem = cart.find(item => item.producto.id === producto.id);
        const inCartAmount = cartItem ? cartItem.cantidad : 0;

        if (inCartAmount >= producto.stockDisponible) {
            toast.error(`Solo hay ${producto.stockDisponible} unidades disponibles.`);
            return;
        }

        addToCart(producto);
        toast.success(`${producto.nombre} añadido al carrito.`);
        setIsCartOpen(true);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-brand-500 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">Cargando los mejores pollos para ti...</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in max-w-7xl mx-auto">
            <div className="mb-8 md:mb-12">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">Catálogo de Productos</h1>
                <p className="mt-2 text-lg text-slate-500 font-medium tracking-wide">Fresco de la granja a tu mesa.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {productos.map((producto) => {
                    const cartItem = cart.find(item => item.producto.id === producto.id);
                    const inCartAmount = cartItem ? cartItem.cantidad : 0;
                    const isOutOfStockBase = producto.stockDisponible <= 0;
                    const isMaxedOut = inCartAmount > 0 && inCartAmount >= producto.stockDisponible;

                    return (
                        <div key={producto.id} className="card-premium flex flex-col group">
                            <div className="relative h-56 bg-surface-100 flex items-center justify-center overflow-hidden">
                                {producto.imagenUrl ? (
                                    <img
                                        src={producto.imagenUrl}
                                        alt={producto.nombre}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center text-slate-400">
                                        <PackageOpen className="w-10 h-10 mb-2 opacity-50" />
                                        <span className="text-sm font-medium">Sin Imagen</span>
                                    </div>
                                )}
                                {/* Stock Badge Overlay */}
                                <div className="absolute top-3 right-3 flex flex-col gap-2">
                                    <div className={clsx(
                                        "px-3 py-1 text-xs font-bold rounded-full shadow-sm backdrop-blur-md",
                                        isOutOfStockBase ? "bg-red-500/90 text-white" : "bg-white/90 text-slate-700"
                                    )}>
                                        {isOutOfStockBase ? 'Agotado' : `${producto.stockDisponible} en stock`}
                                    </div>
                                    {inCartAmount > 0 && (
                                        <div className="px-3 py-1 text-xs font-bold rounded-full shadow-sm backdrop-blur-md bg-brand-500/90 text-white flex items-center justify-center">
                                            {inCartAmount} en carrito
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-slate-800 mb-1 leading-snug line-clamp-1 group-hover:text-brand-600 transition-colors" title={producto.nombre}>
                                    {producto.nombre}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                                    {producto.descripcion}
                                </p>
                                <div className="mt-auto">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                                            {formatCurrency(producto.precio)}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleAddToCart(producto)}
                                        disabled={isOutOfStockBase || isMaxedOut}
                                        className={clsx(
                                            "w-full flex items-center justify-center space-x-2 py-3 font-bold rounded-xl shadow-sm transition-all focus:outline-none focus:ring-4",
                                            isOutOfStockBase || isMaxedOut
                                                ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                                                : "bg-surface-50 border-2 border-brand-100 text-brand-600 hover:bg-brand-50 hover:border-brand-200 hover:shadow active:scale-[0.98] focus:ring-brand-500/20"
                                        )}
                                    >
                                        {isMaxedOut ? (
                                            <>
                                                <Check className="w-5 h-5 flex-shrink-0" />
                                                <span>Límite Alcanzado</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart className="w-5 h-5 flex-shrink-0" />
                                                <span>{inCartAmount > 0 ? 'Agregar Más' : 'Añadir al Carrito'}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {productos.length === 0 && (
                    <div className="col-span-full py-20 bg-white rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 space-y-4">
                        <PackageOpen className="w-12 h-12 text-slate-300" />
                        <p className="text-lg font-medium">No hay productos disponibles por el momento.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
