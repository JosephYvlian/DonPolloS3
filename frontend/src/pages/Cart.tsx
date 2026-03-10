import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { api } from '../api/axios';
import { Trash2, MapPin, Plus } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import toast from 'react-hot-toast';

interface Direccion {
    id: number;
    direccion: string;
    detalles: string;
    ciudad: string;
    esPorDefecto: boolean;
}

export default function Cart() {
    const { cart, removeFromCart, cartTotal, clearCart, user } = useStore();
    const [loading, setLoading] = useState(false);
    const [loadingDir, setLoadingDir] = useState(false);
    const [direcciones, setDirecciones] = useState<Direccion[]>([]);
    const [selectedDir, setSelectedDir] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchDirecciones();
        }
    }, [user]);

    const fetchDirecciones = async () => {
        setLoadingDir(true);
        try {
            const res = await api.get('/direcciones');
            setDirecciones(res.data);
            const porDefecto = res.data.find((d: Direccion) => d.esPorDefecto);
            if (porDefecto) setSelectedDir(porDefecto.id);
            else if (res.data.length > 0) setSelectedDir(res.data[0].id);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingDir(false);
        }
    };

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (!selectedDir) {
            toast.error('Por favor selecciona una dirección de entrega');
            return;
        }

        setLoading(true);

        try {
            const dirSeleccionada = direcciones.find(d => d.id === selectedDir);
            const direccionStr = `${dirSeleccionada?.direccion}, ${dirSeleccionada?.ciudad} ${dirSeleccionada?.detalles ? `(${dirSeleccionada.detalles})` : ''}`;

            const items = cart.map((item) => ({
                productoId: item.producto.id,
                cantidad: item.cantidad,
            }));

            await api.post('/pedidos', { items, direccionEntrega: direccionStr });
            clearCart();
            toast.success('¡Pedido confirmado exitosamente!');
            navigate('/orders');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Error al procesar el pedido. Verifica el stock.');
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
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Finalizar Compra</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-soft border border-surface-border p-6 overflow-hidden">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">Productos en tu Carrito</h2>
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
                </div>
                
                {user && (
                    <div className="bg-white rounded-2xl shadow-soft border border-surface-border p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-brand-500" />
                                Dirección de Entrega
                            </h2>
                            <button onClick={() => navigate('/profile')} className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center">
                                <Plus className="w-4 h-4 mr-1" />
                                Nueva
                            </button>
                        </div>
                        
                        {loadingDir ? (
                            <div className="text-sm text-slate-500 py-4">Cargando direcciones...</div>
                        ) : direcciones.length === 0 ? (
                            <div className="bg-brand-50 p-4 rounded-lg text-sm text-brand-700">
                                No tienes direcciones guardadas. <button onClick={() => navigate('/profile')} className="font-bold underline">Agrega una aquí</button> para poder realizar tu pedido.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {direcciones.map(dir => (
                                    <label key={dir.id} className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${selectedDir === dir.id ? 'border-brand-500 bg-brand-50/30 ring-1 ring-brand-500' : 'border-slate-200 hover:border-slate-300'}`}>
                                        <div className="flex-shrink-0 mt-0.5">
                                            <input 
                                                type="radio" 
                                                name="direccion" 
                                                value={dir.id}
                                                checked={selectedDir === dir.id}
                                                onChange={() => setSelectedDir(dir.id)}
                                                className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <span className="block text-sm font-bold text-slate-800">{dir.direccion}</span>
                                            <span className="block text-sm text-slate-500">{dir.ciudad} {dir.detalles && `• ${dir.detalles}`}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-soft border border-surface-border p-6 sticky top-24">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Resumen</h2>
                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between text-slate-600">
                            <span>Subtotal ({cart.length} items)</span>
                            <span>{formatCurrency(cartTotal())}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>Envío</span>
                            <span className="text-green-600 font-medium">Gratis</span>
                        </div>
                    </div>
                    <div className="border-t border-slate-100 pt-4 mb-6">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-slate-800">Total</span>
                            <span className="text-3xl font-bold text-brand-600">{formatCurrency(cartTotal())}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={loading || !!(user && (direcciones.length === 0 || !selectedDir))}
                        className="w-full btn-primary py-3.5 flex items-center justify-center text-lg"
                    >
                        {loading ? 'Procesando...' : 'Confirmar Pedido'}
                    </button>
                    {!user && (
                        <p className="text-sm text-center mt-3 text-slate-500">
                            Serás redirigido para iniciar sesión
                        </p>
                    )}
                </div>
            </div>
            </div>
        </div>
    );
}
