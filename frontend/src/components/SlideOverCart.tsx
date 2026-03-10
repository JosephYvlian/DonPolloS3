import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ShoppingCart, X, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatCurrency';

export default function SlideOverCart() {
    const { cart, removeFromCart, addToCart, isCartOpen, setIsCartOpen, cartTotal } = useStore();
    const navigate = useNavigate();

    const handleGoToCheckout = () => {
        setIsCartOpen(false);
        navigate('/cart');
    };

    return (
        <Transition.Root show={isCartOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={setIsCartOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-900/60 transition-opacity backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-300 sm:duration-400"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-300 sm:duration-400"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col bg-white shadow-2xl">
                                        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-xl font-bold text-slate-800 flex items-center">
                                                    <ShoppingCart className="w-5 h-5 mr-2 text-brand-500" /> Carrito de Compras
                                                </Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="relative -m-2 p-2 text-slate-400 hover:text-slate-600 transition"
                                                        onClick={() => setIsCartOpen(false)}
                                                    >
                                                        <span className="absolute -inset-0.5" />
                                                        <span className="sr-only">Close panel</span>
                                                        <X className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-8">
                                                <div className="flow-root">
                                                    {cart.length === 0 ? (
                                                        <div className="text-center py-20">
                                                            <ShoppingCart className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                                            <p className="text-slate-500 font-medium">No hay productos en tu carrito.</p>
                                                            <button
                                                                onClick={() => setIsCartOpen(false)}
                                                                className="mt-4 text-brand-500 font-semibold hover:text-brand-600 transition"
                                                            >
                                                                Continuar comprando &rarr;
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <ul role="list" className="-my-6 divide-y divide-slate-100">
                                                            {cart.map((item) => (
                                                                <li key={item.producto.id} className="flex py-6">
                                                                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                                                                        {item.producto.imagenUrl ? (
                                                                            <img src={item.producto.imagenUrl} alt={item.producto.nombre} className="h-full w-full object-cover object-center" />
                                                                        ) : (
                                                                            <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">Sin img</div>
                                                                        )}
                                                                    </div>

                                                                    <div className="ml-4 flex flex-1 flex-col">
                                                                        <div>
                                                                            <div className="flex justify-between text-base font-medium text-slate-800">
                                                                                <h3 className="line-clamp-2 pr-4">{item.producto.nombre}</h3>
                                                                                <p className="ml-4 font-bold whitespace-nowrap">{formatCurrency(item.producto.precio * item.cantidad)}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex flex-1 items-end justify-between text-sm">
                                                                            <div className="flex items-center space-x-3 border border-slate-200 rounded-lg p-1">
                                                                                <button
                                                                                    onClick={() => {
                                                                                        if (item.cantidad > 1) {
                                                                                            useStore.setState({ cart: cart.map(c => c.producto.id === item.producto.id ? { ...c, cantidad: c.cantidad - 1 } : c) });
                                                                                        } else {
                                                                                            removeFromCart(item.producto.id);
                                                                                        }
                                                                                    }}
                                                                                    className="p-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-500 transition"
                                                                                >
                                                                                    <Minus className="w-4 h-4" />
                                                                                </button>
                                                                                <span className="font-semibold w-4 text-center">{item.cantidad}</span>
                                                                                <button
                                                                                    onClick={() => {
                                                                                        if (item.cantidad < item.producto.stockDisponible) {
                                                                                            addToCart(item.producto);
                                                                                        } else {
                                                                                            toast.error(`Solo hay ${item.producto.stockDisponible} en stock`);
                                                                                        }
                                                                                    }}
                                                                                    className="p-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-500 transition"
                                                                                >
                                                                                    <Plus className="w-4 h-4" />
                                                                                </button>
                                                                            </div>

                                                                            <div className="flex">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => removeFromCart(item.producto.id)}
                                                                                    className="font-medium text-red-400 hover:text-red-500 flex items-center transition"
                                                                                >
                                                                                    <Trash2 className="w-4 h-4 mr-1" /> Eliminar
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {cart.length > 0 && (
                                            <div className="border-t border-slate-100 bg-slate-50 px-6 py-6 sm:px-8">
                                                <div className="flex justify-between text-lg font-bold text-slate-900 mb-6">
                                                    <p>Total a Pagar</p>
                                                    <p>{formatCurrency(cartTotal())}</p>
                                                </div>
                                                <div className="mt-6">
                                                    <button
                                                        onClick={handleGoToCheckout}
                                                        className="btn-primary w-full flex items-center justify-center py-3.5 text-lg"
                                                    >
                                                        <span>Ir al Checkout</span>
                                                        <ArrowRight className="ml-2 w-5 h-5" />
                                                    </button>
                                                </div>
                                                <div className="mt-6 flex justify-center text-center text-sm text-slate-500">
                                                    <p>
                                                        o{' '}
                                                        <button
                                                            type="button"
                                                            className="font-medium text-brand-500 hover:text-brand-600 transition"
                                                            onClick={() => setIsCartOpen(false)}
                                                        >
                                                            Continuar comprando
                                                            <span aria-hidden="true"> &rarr;</span>
                                                        </button>
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
