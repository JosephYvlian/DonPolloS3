import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { api } from '../api/axios';
import { Trash2 } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

export default function Cart() {
    const { cart, removeFromCart, cartTotal, clearCart, user } = useStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const items = cart.map((item) => ({
                productoId: item.producto.id,
                cantidad: item.cantidad,
            }));

            await api.post('/pedidos', { items });
            clearCart();
            navigate('/orders');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al procesar el pedido. Verifica el stock.');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h2>
                <button onClick={() => navigate('/')} className="btn-primary">
                    Ver Catálogo
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Carrito de Compras</h1>
            {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <ul className="divide-y divide-gray-100">
                    {cart.map((item) => (
                        <li key={item.producto.id} className="p-6 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                    {item.producto.imagenUrl ? (
                                        <img src={item.producto.imagenUrl} alt={item.producto.nombre} className="w-full h-full object-cover rounded-lg" />
                                    ) : (
                                        <span className="text-gray-400 text-xs">IMG</span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800">{item.producto.nombre}</h3>
                                    <p className="text-gray-500 text-sm">Cantidad: {item.cantidad}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-6">
                                <span className="font-semibold text-gray-800">
                                    {formatCurrency(item.producto.precio * item.cantidad)}
                                </span>
                                <button
                                    onClick={() => removeFromCart(item.producto.id)}
                                    className="text-red-400 hover:text-red-600 transition p-2"
                                    title="Eliminar del carrito"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="bg-gray-50 p-6 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-lg font-medium text-gray-600">Total</span>
                        <span className="text-3xl font-bold text-gray-900">{formatCurrency(cartTotal())}</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg shadow transition"
                    >
                        {loading ? 'Procesando...' : 'Confirmar Pedido'}
                    </button>
                </div>
            </div>
        </div>
    );
}
