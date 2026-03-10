import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ShoppingCart, LogOut, Package, User } from 'lucide-react';
import clsx from 'clsx';

export default function Navbar() {
    const { user, cart, logout, setIsCartOpen } = useStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const cartItemsCount = cart.reduce((total, item) => total + item.cantidad, 0);

    return (
        <nav className="bg-white border-b border-surface-border shadow-sm sticky top-0 z-40 bg-opacity-90 backdrop-blur-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                <Link to="/" className="flex items-center transition group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded px-2 -ml-2 py-1">
                    <img src="https://res.cloudinary.com/dvpt0r0wz/image/upload/v1741581139/donpollo/logo.png" alt="Don Pollo" className="h-12 sm:h-14 w-auto scale-[1.3] md:scale-[1.5] origin-left group-hover:drop-shadow-md transition-all duration-300" />
                </Link>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        aria-label="Ver carrito"
                        className="group relative p-2 text-slate-500 hover:text-brand-600 transition flex items-center rounded-lg hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    >
                        <ShoppingCart className="w-6 h-6 transition-transform group-active:scale-95" />
                        {cartItemsCount > 0 && (
                            <span className={clsx(
                                "absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white transition-all duration-300 shadow-sm",
                                "bg-brand-500 animate-fade-in"
                            )}>
                                {cartItemsCount > 99 ? '99+' : cartItemsCount}
                            </span>
                        )}
                    </button>

                    <div className="w-px h-6 bg-slate-200 mx-1"></div>

                    {user ? (
                        <div className="flex items-center space-x-1 sm:space-x-3">
                            <Link
                                to="/profile"
                                className="hidden sm:flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                            >
                                <User className="w-5 h-5 mr-1.5 text-slate-400" />
                                <span>Mi Perfil</span>
                            </Link>
                            <Link
                                to="/orders"
                                className="hidden sm:flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                            >
                                <Package className="w-5 h-5 mr-1.5 text-slate-400" />
                                <span>Mis Pedidos</span>
                            </Link>
                            <div className="hidden md:flex items-center px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100">
                                <span className="text-sm font-semibold text-slate-700 truncate max-w-[150px]">{user.nombreCompleto}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                                title="Cerrar sesión"
                                aria-label="Cerrar sesión"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3 pl-2">
                            <Link
                                to="/login"
                                className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded px-2 py-1"
                            >
                                Entrar
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
