import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { useStore } from '../store/useStore';
import { useNavigate, Link } from 'react-router-dom';
import type { Pedido } from '../types';
import { Package, Calendar, Clock, ShoppingBag, FileText, MapPin, X, Truck, ChefHat, Inbox, CheckCircle2, PackageCheck, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatCurrency';
import InvoiceModal from '../components/InvoiceModal';

// ─── Tracking steps definition ────────────────────────────────────────────────
const TRACKING_STEPS = [
    {
        key: 'Pedido Recibido',
        label: 'Pedido Recibido',
        description: 'Hemos recibido tu pedido y está siendo procesado.',
        icon: Inbox,
    },
    {
        key: 'En Preparación',
        label: 'En Preparación',
        description: 'Nuestro equipo está preparando tu pedido con cuidado.',
        icon: ChefHat,
    },
    {
        key: 'Pedido en Camino',
        label: 'En Camino',
        description: 'Tu pedido está en camino. ¡Pronto llegará!',
        icon: Truck,
    },
    {
        key: 'Pedido Entregado',
        label: 'Entregado',
        description: '¡Pedido entregado! Gracias por tu compra.',
        icon: CheckCircle2,
    },
];

function getStepIndex(estadoEntrega: string | null | undefined): number {
    if (!estadoEntrega) return -1;
    return TRACKING_STEPS.findIndex(s => s.key === estadoEntrega);
}

// ─── Tracking Modal ────────────────────────────────────────────────────────────
function TrackingModal({ pedido, onClose }: { pedido: any; onClose: () => void }) {
    const currentIndex = getStepIndex((pedido as any).estadoEntrega);
    const hasTracking = currentIndex >= 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-brand-500 to-orange-400">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                            <PackageCheck className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg leading-tight">
                                Seguimiento de Pedido
                            </h3>
                            <p className="text-white/70 text-xs font-medium">
                                #{pedido.id.toString().padStart(5, '0')} · {new Date(pedido.fechaPedido).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/70 hover:text-white p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {/* Estado de pago */}
                    <div className="flex items-center gap-3 mb-6 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                        <CreditCard className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <div className="flex items-center justify-between w-full">
                            <span className="text-sm text-slate-500 font-medium">Estado de pago</span>
                            <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full uppercase ${
                                pedido.estado === 'Pago Exitoso'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : pedido.estado === 'Pago Rechazado'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-amber-100 text-amber-700'
                            }`}>
                                {pedido.estado}
                            </span>
                        </div>
                    </div>

                    {/* Timeline */}
                    {!hasTracking ? (
                        <div className="flex flex-col items-center py-8 text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <Truck className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="font-semibold text-slate-600 mb-1">Seguimiento no disponible aún</p>
                            <p className="text-sm text-slate-400 max-w-xs">
                                El seguimiento se activará una vez que tu pago sea confirmado y el pedido entre en preparación.
                            </p>
                        </div>
                    ) : (
                        <div className="relative">
                            <p className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-5">
                                Estado de tu pedido
                            </p>
                            <ol className="relative space-y-0">
                                {TRACKING_STEPS.map((step, index) => {
                                    const isDone = index <= currentIndex;
                                    const isActive = index === currentIndex;
                                    const isLast = index === TRACKING_STEPS.length - 1;
                                    const Icon = step.icon;

                                    return (
                                        <li key={step.key} className="flex gap-4">
                                            {/* Line + circle */}
                                            <div className="flex flex-col items-center">
                                                <div className={`
                                                    w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all duration-300
                                                    ${isActive
                                                        ? 'bg-brand-500 text-white shadow-lg shadow-brand-200 ring-4 ring-brand-100'
                                                        : isDone
                                                        ? 'bg-emerald-500 text-white'
                                                        : 'bg-slate-100 text-slate-300'
                                                    }
                                                `}>
                                                    {isDone && !isActive
                                                        ? <CheckCircle2 className="w-5 h-5" />
                                                        : <Icon className="w-4 h-4" />
                                                    }
                                                </div>
                                                {!isLast && (
                                                    <div className={`w-0.5 flex-1 my-1 min-h-[2rem] transition-all duration-300 ${
                                                        index < currentIndex ? 'bg-emerald-400' : 'bg-slate-100'
                                                    }`} />
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className={`pb-6 ${isLast ? '' : ''}`}>
                                                <p className={`font-bold text-sm leading-tight ${
                                                    isActive ? 'text-brand-600' : isDone ? 'text-slate-700' : 'text-slate-300'
                                                }`}>
                                                    {step.label}
                                                    {isActive && (
                                                        <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-brand-100 text-brand-600 px-2 py-0.5 rounded-full">
                                                            <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
                                                            Ahora
                                                        </span>
                                                    )}
                                                </p>
                                                <p className={`text-xs mt-0.5 ${
                                                    isDone ? 'text-slate-500' : 'text-slate-300'
                                                }`}>
                                                    {step.description}
                                                </p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ol>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 pb-6">
                    <div className="flex items-start gap-2 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                        <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Dirección de entrega</p>
                            <p className="text-sm font-semibold text-slate-700">{pedido.direccionEntrega || 'No especificada'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Orders Page ──────────────────────────────────────────────────────────
export default function Orders() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState<Pedido | null>(null);
    const [trackingPedido, setTrackingPedido] = useState<any | null>(null);
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
        <>
            <div className="animate-fade-in max-w-4xl mx-auto print:hidden">
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
                                {/* Header */}
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
                                            <span className="text-lg font-black text-slate-900 leading-none">{formatCurrency(pedido.total)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Items */}
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
                                                        <span className="text-xs text-slate-500 font-medium"> Precio Unitario: {formatCurrency(detalle.precioUnitario)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-6 text-right">
                                                    <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">x{detalle.cantidad}</span>
                                                    <span className="text-base sm:text-lg font-bold text-slate-700 w-20">
                                                        {formatCurrency(detalle.precioUnitario * detalle.cantidad)}
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Dirección + Botón tracking */}
                                {pedido.direccionEntrega && (
                                    <div className="bg-white px-5 sm:px-6 py-4 border-t border-surface-border flex items-center justify-between gap-4">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-slate-50 p-2 rounded-lg text-slate-400 flex-shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Entregar a</p>
                                                <p className="text-sm font-medium text-slate-700">{pedido.direccionEntrega}</p>
                                            </div>
                                        </div>

                                        {/* Botón seguimiento */}
                                        <button
                                            onClick={() => setTrackingPedido(pedido)}
                                            className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white text-sm font-bold rounded-xl shadow-sm shadow-brand-200 transition-all duration-150"
                                        >
                                            <Truck className="w-4 h-4" />
                                            <span className="hidden sm:inline">Rastrear pedido</span>
                                            <span className="sm:hidden">Rastrear</span>
                                        </button>
                                    </div>
                                )}

                                {/* Footer factura */}
                                <div className="bg-slate-50 p-3 flex justify-center border-t border-surface-border">
                                    <button
                                        onClick={() => setSelectedInvoice(pedido)}
                                        className="text-sm text-brand-600 font-bold flex items-center hover:text-brand-700 transition group p-2"
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        Ver Factura
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modales */}
            <InvoiceModal
                isOpen={!!selectedInvoice}
                onClose={() => setSelectedInvoice(null)}
                pedido={selectedInvoice}
            />

            {trackingPedido && (
                <TrackingModal
                    pedido={trackingPedido}
                    onClose={() => setTrackingPedido(null)}
                />
            )}
        </>
    );
}
