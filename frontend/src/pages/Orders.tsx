import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { useStore } from '../store/useStore';
import { useNavigate, Link } from 'react-router-dom';
import type { Pedido } from '../types';
import { Package, Calendar, Clock, ChevronRight, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Orders() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchPedidos = async () => {
            try {
                const response = await api.get('/pedidos/mis-pedidos');
                setPedidos(response.data);
            } catch (err) {
                console.error('Error fetching pedidos', err);
                toast.error('Ocurrió un error cargando tus pedidos pasados.');
            } finally {
                setLoading(false);
            }
        };
        fetchPedidos();
    }, [user, navigate]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-brand-500 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">Buscando el historial de tus pedidos...</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="flex items-center space-x-3 mb-8 md:mb-10">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex justify-center items-center text-slate-700">
                    <Package className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Mis Pedidos</h1>
                    <p className="text-slate-500 font-medium text-sm">Historial completo de tus compras en Don Pollo.</p>
                </div>
            </div>

            {pedidos.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-soft border border-surface-border p-12 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                        <ShoppingBag className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Aún no has hecho pedidos</h3>
                    <p className="text-slate-500 mb-8 max-w-sm">Explora nuestro catálogo para encontrar el pollo más fresco de la región.</p>
                    <Link to="/" className="btn-primary">
                        Ver Catálogo de Productos
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {pedidos.map((pedido) => (
                        <div key={pedido.id} className="bg-white rounded-2xl shadow-soft border border-surface-border overflow-hidden hover:shadow-md transition-shadow">
                            {/* Header Título del Pedido */}
                            <div className="bg-slate-50 p-5 sm:px-6 border-b border-surface-border flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                                <div className="flex flex-col space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pedido</span>
                                        <span className="text-base font-bold text-slate-800">#{pedido.id.toString().padStart(5, '0')}</span>
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm text-slate-500 font-medium">
                                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5 opacity-70" /> {new Date(pedido.fechaPedido).toLocaleDateString()}</span>
                                        <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5 opacity-70" /> {new Date(pedido.fechaPedido).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 w-full sm:w-auto justify-between sm:justify-start">
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs text-slate-400 font-semibold mb-0.5">Estado actual</span>
                                        <span className="px-2.5 py-0.5 bg-brand-50 text-brand-700 text-xs font-extrabold rounded-md uppercase border border-brand-100/50">
                                            {pedido.estado}
                                        </span>
                                    </div>
                                    <div className="w-px h-8 bg-slate-100"></div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs text-slate-400 font-semibold mb-0.5">Total pagado</span>
                                        <span className="text-lg font-black text-slate-900 leading-none">${Number(pedido.total).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Cuerpo / Items del Pedido */}
                            <div className="p-1">
                                <ul className="divide-y divide-slate-50">
                                    {pedido.detalles?.map((detalle: any) => (
                                        <li key={detalle.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50/50 transition duration-150">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200/60 flex-shrink-0">
                                                    {detalle.producto?.imagenUrl ? (
                                                        <img src={detalle.producto.imagenUrl} alt={detalle.producto?.nombre} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 font-medium">No Img</div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-800 text-sm sm:text-base">{detalle.producto?.nombre || 'Producto Desconocido'}</span>
                                                    <span className="text-xs text-slate-500 font-medium"> Precio Unitario: ${Number(detalle.precioUnitario).toFixed(2)}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-6 text-right">
                                                <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">x{detalle.cantidad}</span>
                                                <span className="text-base sm:text-lg font-bold text-slate-700 w-20">
                                                    ${(detalle.precioUnitario * detalle.cantidad).toFixed(2)}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-slate-50 p-3 flex justify-center border-t border-surface-border">
                                <button className="text-sm text-brand-600 font-bold flex items-center hover:text-brand-700 transition group p-2">
                                    Ver recibo detallado <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
