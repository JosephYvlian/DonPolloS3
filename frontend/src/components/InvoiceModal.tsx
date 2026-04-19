import { X, Printer, FileText, CheckCircle2 } from 'lucide-react';
import type { Pedido } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import { useStore } from '../store/useStore';

interface InvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    pedido: Pedido | null;
}

export default function InvoiceModal({ isOpen, onClose, pedido }: InvoiceModalProps) {
    const { user } = useStore();

    if (!isOpen || !pedido) return null;

    // Constantes DIAN Simuladas
    const EMPRESA = "DON POLLO S.A.S";
    const NIT = "900.812.345-0";
    const RESOLUCION = "18762039481726 Autoriza prefijo FE del 1 al 100000";
    const FECHA_RESOLUCION = "2026-01-15";

    // Cálculos de impuestos (IVA 19%)
    // Típicamente los precios ya incluyen IVA, entonces fraccionamos
    const subtotal = pedido.total / 1.19;
    const iva = pedido.total - subtotal;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm print:bg-white print:p-0 print:block">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto print:shadow-none print:w-full print:max-w-none print:max-h-none print:h-auto animate-in zoom-in-95 duration-200">
                {/* Header Acciones (no se imprime) */}
                <div className="sticky top-0 bg-slate-100 flex justify-between items-center p-4 border-b border-slate-200 print:hidden z-10">
                    <h2 className="text-sm font-bold text-slate-700 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Visor de Factura Electrónica
                    </h2>
                    <div className="flex bg-white rounded-lg shadow-sm">
                        <button onClick={handlePrint} className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50 border-r border-slate-100 rounded-l-lg transition-colors">
                            <Printer className="w-4 h-4 mr-2" />
                            Imprimir
                        </button>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-r-lg transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* CUERPO DE LA FACTURA */}
                <div className="p-8 sm:p-12 bg-white print:p-0 text-slate-800 text-sm">
                    {/* Cabezote Forma DIAN */}
                    <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-800 pb-6 mb-6">
                        <div className="mb-4 sm:mb-0">
                            <h1 className="text-3xl font-black text-brand-600 tracking-tighter mb-1">DON POLLO</h1>
                            <p className="font-bold text-slate-700">{EMPRESA}</p>
                            <p className="text-xs text-slate-500">NIT: {NIT}</p>
                            <p className="text-xs text-slate-500">Régimen Común</p>
                            <p className="text-xs text-slate-500 mt-2">Calle Falsa 123, Bogotá D.C.</p>
                            <p className="text-xs text-slate-500">Tel: (601) 555-0192</p>
                        </div>
                        <div className="text-left sm:text-right flex flex-col space-y-1">
                            <div className="inline-block border-2 border-slate-800 p-2 text-center rounded bg-slate-50 mb-2">
                                <p className="font-bold text-xs uppercase tracking-widest text-slate-800">Factura Electrónica de Venta</p>
                                <p className="text-xl font-black text-brand-600 mt-1">FE - {pedido.id.toString().padStart(6, '0')}</p>
                            </div>
                            <p className="text-[10px] text-slate-400 w-full max-w-[200px]">Res. DIAN: {RESOLUCION}</p>
                            <p className="text-[10px] text-slate-400">Fecha Res: {FECHA_RESOLUCION}</p>
                        </div>
                    </div>

                    {/* Información del Cliente */}
                    <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-50/50 p-4 rounded-lg border border-slate-100">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Adquiriente</p>
                            <p className="font-bold text-slate-800">{user?.nombreCompleto || 'Cliente Frecuente'}</p>
                            <p className="text-slate-600">CC / NIT: 222222222</p>
                            <p className="text-slate-600">{user?.correo}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Detalles Emisión</p>
                            <p className="font-medium text-slate-800">Fecha: {new Date(pedido.fechaPedido).toLocaleDateString()}</p>
                            <p className="font-medium text-slate-800">Hora: {new Date(pedido.fechaPedido).toLocaleTimeString()}</p>
                            <p className="font-medium text-slate-800 break-words max-w-[200px] ml-auto">Destino: {pedido.direccionEntrega || 'Sede Local'}</p>
                        </div>
                    </div>

                    {/* Tabla de Conceptos */}
                    <div className="mb-8 overflow-hidden rounded-lg border border-slate-200">
                        <table className="w-full text-left">
                            <thead className="bg-slate-800 text-white text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="p-3">Cant</th>
                                    <th className="p-3">Descripción</th>
                                    <th className="p-3 text-right">Vr. Unit</th>
                                    <th className="p-3 text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {pedido.detalles?.map((item: any, i) => {
                                    const vrUnitarioNeto = item.precioUnitario / 1.19;
                                    const subNeto = vrUnitarioNeto * item.cantidad;
                                    
                                    return (
                                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-3 font-medium text-slate-700">{item.cantidad}</td>
                                            <td className="p-3 text-slate-800">{item.producto?.nombre}</td>
                                            <td className="p-3 text-right text-slate-600">{formatCurrency(vrUnitarioNeto)}</td>
                                            <td className="p-3 text-right font-medium text-slate-800">{formatCurrency(subNeto)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Totales y Método de Pago */}
                    <div className="flex flex-col sm:flex-row justify-between items-start">
                        {/* Detalles de Pago */}
                        <div className="w-full sm:w-1/2 mb-6 sm:mb-0 pr-4">
                            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                                <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 border-b pb-2">Información de Pago</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 font-medium">Método</span>
                                        <span className="font-bold text-slate-800">{pedido.metodoPago || 'EFECTIVO'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 font-medium">Estado</span>
                                        <span className="flex items-center font-bold text-emerald-600">
                                            {pedido.estado === 'PAGADO' || pedido.estado === 'ENTREGADO' ? (
                                                <><CheckCircle2 className="w-3 h-3 mr-1" /> Pagado Exitosamente</>
                                            ) : (
                                                'Pendiente de Pago'
                                            )}
                                        </span>
                                    </div>
                                    {pedido.metodoPago === 'EFECTIVO' && pedido.montoEfectivo && (
                                        <>
                                            <div className="flex justify-between mt-2 pt-2 border-t border-slate-200/60">
                                                <span className="text-slate-500 text-xs text-left">Efectivo Ingresado: <br/>{formatCurrency(pedido.montoEfectivo)}</span>
                                                <span className="text-slate-500 text-xs text-right">Cambio a retornar: <br/>{formatCurrency((pedido.montoEfectivo || 0) - pedido.total)}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            
                            <div className="mt-8 text-center sm:text-left">
                                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                                    Esta es una representación gráfica de la Factura Electrónica de Venta. <br/>
                                    CUFE: 6f8d38bfbd39fb2f6d28919aeddf...
                                </p>
                            </div>
                        </div>

                        {/* Liquidación */}
                        <div className="w-full sm:w-1/3 border border-slate-200 rounded-lg overflow-hidden">
                            <div className="p-4 space-y-3">
                                <div className="flex justify-between items-center text-slate-600">
                                    <span>Subtotal Venta</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-600">
                                    <span>IVA (19%)</span>
                                    <span>{formatCurrency(iva)}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-600">
                                    <span>Descuentos</span>
                                    <span>$0</span>
                                </div>
                            </div>
                            <div className="bg-slate-800 text-white p-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">Total a Pagar</span>
                                    <span className="text-xl font-black">{formatCurrency(pedido.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-12 text-center text-xs text-slate-400 border-t border-slate-200 pt-6 pb-2 print:pb-0">
                        Gracias por su compra en Don Pollo. Software autorizado.
                    </div>
                </div>
            </div>
        </div>
    );
}
