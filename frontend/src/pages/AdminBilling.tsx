import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { api } from '../api/axios';
import { useNavigate } from 'react-router-dom';
import type { Pedido } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import { Receipt, Eye, X, CreditCard, Banknote, CheckCircle2, XCircle, Clock, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

const ESTADOS_PAGO = [
    'Pago Pendiente',
    'Pago Rechazado',
    'Pago Exitoso',
];

const EstadoPagoBadge = ({ estado }: { estado: string }) => {
    switch (estado) {
        case 'Pago Pendiente':
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold whitespace-nowrap">
                    <Clock className="w-3 h-3" /> Pago Pendiente
                </span>
            );
        case 'Pago Rechazado':
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold whitespace-nowrap">
                    <XCircle className="w-3 h-3" /> Pago Rechazado
                </span>
            );
        case 'Pago Exitoso':
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold whitespace-nowrap">
                    <CheckCircle2 className="w-3 h-3" /> Pago Exitoso
                </span>
            );
        default:
            return (
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold whitespace-nowrap">
                    {estado}
                </span>
            );
    }
};

const MetodoPagoIcon = ({ metodo }: { metodo: string }) => {
    if (metodo === 'EFECTIVO') {
        return <span className="inline-flex items-center gap-1.5 text-slate-600 text-sm font-semibold"><Banknote className="w-4 h-4 text-emerald-600" /> Efectivo</span>;
    }
    return <span className="inline-flex items-center gap-1.5 text-slate-600 text-sm font-semibold"><CreditCard className="w-4 h-4 text-blue-600" /> Tarjeta</span>;
};

export default function AdminBilling() {
    const { user } = useStore();
    const navigate = useNavigate();

    const [pedidos, setPedidos] = useState<(Pedido & { usuario?: { nombreCompleto: string; correo: string; telefono?: string } })[]>([]);
    const [loadingPedidos, setLoadingPedidos] = useState(true);
    const [selectedPedido, setSelectedPedido] = useState<any | null>(null);
    const [filterEstado, setFilterEstado] = useState<string>('Todos');
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        if (!user || user.rol !== 'ADMINISTRADOR') {
            navigate('/');
            toast.error('Acceso denegado. Se requieren permisos de administrador.');
            return;
        }
        fetchPedidos();
    }, [user, navigate]);

    const fetchPedidos = async () => {
        setLoadingPedidos(true);
        try {
            const res = await api.get('/pedidos/all');
            // Solo mostrar pedidos con estados de pago
            const pagoEstados = ['Pago Pendiente', 'Pago Rechazado', 'Pago Exitoso'];
            const filtered = res.data.filter((p: any) => pagoEstados.includes(p.estado));
            setPedidos(filtered);
        } catch {
            toast.error('Error al cargar los pedidos de facturación');
        } finally {
            setLoadingPedidos(false);
        }
    };

    const handleUpdateEstadoPago = async (id: number, nuevoEstado: string) => {
        try {
            await api.put(`/pedidos/${id}/estado`, { estado: nuevoEstado });
            toast.success('Estado de pago actualizado');
            // Si pago exitoso, el backend auto-asigna estadoEntrega = 'Pedido Recibido'
            const extraFields = nuevoEstado === 'Pago Exitoso'
                ? { estadoEntrega: 'Pedido Recibido' }
                : {};
            setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado: nuevoEstado, ...extraFields } : p));
            if (selectedPedido?.id === id) {
                setSelectedPedido({ ...selectedPedido, estado: nuevoEstado, ...extraFields });
            }
        } catch {
            toast.error('Error al actualizar el estado de pago');
        }
    };

    const pedidosFiltrados = pedidos.filter(p => {
        const matchesEstado = filterEstado === 'Todos' || p.estado === filterEstado;
        const search = searchTerm.toLowerCase().replace('#', '');
        const paddedId = p.id.toString().padStart(5, '0');
        const matchesSearch =
            p.id.toString().includes(search) ||
            paddedId.includes(search) ||
            (p as any).usuario?.correo?.toLowerCase().includes(search) ||
            (p as any).metodoPago?.toLowerCase().includes(search);

        return matchesEstado && matchesSearch;
    });

    if (!user || user.rol !== 'ADMINISTRADOR') return null;

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl shadow-sm flex justify-center items-center mr-4">
                    <Receipt className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Facturación</h1>
                    <p className="text-slate-500">Gestiona el estado de pago de todos los pedidos</p>
                </div>
            </div>

            {/* Filtros y Buscador */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-2 flex-wrap">
                    {['Todos', ...ESTADOS_PAGO].map(estado => (
                        <button
                            key={estado}
                            onClick={() => setFilterEstado(estado)}
                            className={`px-4 py-1.5 rounded-full text-sm font-bold transition border ${filterEstado === estado
                                ? 'bg-slate-800 text-white border-slate-800'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                                }`}
                        >
                            {estado}
                        </button>
                    ))}
                </div>

                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    />
                </div>
            </div>

            {/* Tabla */}
            <div className="animate-fade-in">
                {loadingPedidos ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-soft border border-surface-border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
                                    <tr>
                                        <th className="px-6 py-4">ID / Fecha</th>
                                        <th className="px-6 py-4">Cliente</th>
                                        <th className="px-6 py-4">Método de Pago</th>
                                        <th className="px-6 py-4">Monto</th>
                                        <th className="px-6 py-4">Estado de Pago</th>
                                        <th className="px-6 py-4 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {pedidosFiltrados.map(p => (
                                        <tr key={p.id} className="hover:bg-slate-50/50 transition">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-slate-800">#{p.id.toString().padStart(5, '0')}</p>
                                                <p className="text-xs text-slate-500">{new Date(p.fechaPedido).toLocaleString()}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-slate-700">{(p as any).usuario?.nombreCompleto || 'Desconocido'}</p>
                                                <p className="text-xs text-slate-500">{(p as any).usuario?.correo}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <MetodoPagoIcon metodo={(p as any).metodoPago || ''} />
                                            </td>
                                            <td className="px-6 py-4 font-black text-slate-800">{formatCurrency(p.total)}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <EstadoPagoBadge estado={p.estado} />
                                                    {(p as any).estadoEntrega && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                                                            <Truck className="w-3 h-3" /> En entrega
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setSelectedPedido(p)}
                                                    className="inline-flex items-center px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-sm font-semibold transition"
                                                >
                                                    <Eye className="w-4 h-4 mr-1.5" />
                                                    Gestionar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {pedidosFiltrados.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                                <Receipt className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                                <p className="font-semibold">No hay pedidos en este estado de pago.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL DE GESTIÓN DE PAGO */}
            {selectedPedido && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-emerald-50">
                            <div>
                                <h3 className="font-bold text-xl text-slate-800">
                                    Facturación — Pedido #{selectedPedido.id.toString().padStart(5, '0')}
                                </h3>
                                <p className="text-sm text-slate-500">{new Date(selectedPedido.fechaPedido).toLocaleString()}</p>
                            </div>
                            <button
                                onClick={() => setSelectedPedido(null)}
                                className="text-slate-400 hover:text-slate-600 p-2 bg-white rounded-lg shadow-sm border border-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="overflow-y-auto p-6 space-y-6">
                            {/* Control de estado de pago */}
                            <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                                <h4 className="font-bold text-slate-800 mb-1">Estado de Pago</h4>
                                <p className="text-sm text-slate-500 mb-4">Modifica el estado de pago de este pedido.</p>
                                <div className="flex flex-wrap gap-2">
                                    {ESTADOS_PAGO.map(est => (
                                        <button
                                            key={est}
                                            onClick={() => handleUpdateEstadoPago(selectedPedido.id, est)}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold transition border-2 ${selectedPedido.estado === est
                                                ? est === 'Pago Exitoso'
                                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                                    : est === 'Pago Rechazado'
                                                        ? 'bg-red-500 text-white border-red-500'
                                                        : 'bg-amber-500 text-white border-amber-500'
                                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                                                }`}
                                        >
                                            {est}
                                        </button>
                                    ))}
                                </div>
                                {selectedPedido.estadoEntrega && (
                                    <div className="mt-4 flex items-center gap-2 text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-4 py-2">
                                        <Truck className="w-4 h-4" />
                                        <span>Este pedido ya fue enviado a <strong>Gestión de Pedidos</strong> con estado: <strong>{selectedPedido.estadoEntrega}</strong></span>
                                    </div>
                                )}
                            </div>

                            {/* Info cliente */}
                            <div>
                                <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Información del Cliente</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-slate-500 mb-1">Nombre Completo</p>
                                        <p className="font-semibold text-slate-800">{selectedPedido.usuario?.nombreCompleto || 'Desconocido'}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 mb-1">Correo Electrónico</p>
                                        <p className="font-semibold text-slate-800">{selectedPedido.usuario?.correo || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Resumen financiero */}
                            <div>
                                <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Detalle de Pago</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div>
                                        <p className="text-slate-500 mb-1">Método de Pago</p>
                                        <MetodoPagoIcon metodo={selectedPedido.metodoPago || ''} />
                                    </div>
                                    <div>
                                        <p className="text-slate-500 mb-1">Total a Pagar</p>
                                        <p className="font-black text-xl text-slate-900">{formatCurrency(selectedPedido.total)}</p>
                                    </div>
                                    {selectedPedido.metodoPago === 'EFECTIVO' && selectedPedido.montoEfectivo && (
                                        <div className="col-span-2 pt-2 mt-2 border-t border-slate-200 flex justify-between">
                                            <span className="text-slate-600">Paga con: {formatCurrency(selectedPedido.montoEfectivo)}</span>
                                            <span className="font-bold text-slate-800">Cambio: {formatCurrency(selectedPedido.montoEfectivo - selectedPedido.total)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Productos */}
                            <div>
                                <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Artículos del Pedido</h4>
                                <div className="space-y-3">
                                    {selectedPedido.detalles?.map((detalle: any) => (
                                        <div key={detalle.id} className="flex justify-between items-center bg-white border border-slate-100 p-3 rounded-xl shadow-sm">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-500 overflow-hidden">
                                                    {detalle.producto?.imagenUrl ? (
                                                        <img src={detalle.producto.imagenUrl} alt={detalle.producto.nombre} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span>{detalle.cantidad}x</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800">{detalle.producto?.nombre || 'Producto no disponible'}</p>
                                                    <p className="text-xs text-slate-500">Cantidad: {detalle.cantidad} x {formatCurrency(detalle.precioUnitario)}</p>
                                                </div>
                                            </div>
                                            <p className="font-black text-slate-800">{formatCurrency(detalle.cantidad * detalle.precioUnitario)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                            <button onClick={() => setSelectedPedido(null)} className="btn-primary py-2 px-6">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
