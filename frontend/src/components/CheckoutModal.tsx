import React, { useState } from 'react';
import { CreditCard, Banknote, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatCurrency';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalAmount: number;
    onPaymentSuccess: (metodoPago: string, montoEfectivo: number | null) => void;
}

export default function CheckoutModal({ isOpen, onClose, totalAmount, onPaymentSuccess }: CheckoutModalProps) {
    const [paymentMethod, setPaymentMethod] = useState<'MERCADOPAGO' | 'EFECTIVO'>('MERCADOPAGO');
    const [loading, setLoading] = useState(false);
    
    // Formulario Efectivo
    const [cashAmount, setCashAmount] = useState<string>('');

    if (!isOpen) return null;

    const handleSimulatePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (paymentMethod === 'EFECTIVO') {
            const amount = parseFloat(cashAmount);
            if (!amount || amount < totalAmount) {
                toast.error(`El pago debe ser mayor o igual al total (${formatCurrency(totalAmount)})`);
                return;
            }
        }

        setLoading(true);

        if (paymentMethod === 'MERCADOPAGO') {
            toast('Preparando pago seguro... 💳', { icon: '⏳', duration: 1500 });
        } else if (paymentMethod === 'EFECTIVO') {
            toast('Confirmando método de pago en efectivo... 📄', { icon: '⏳', duration: 1500 });
        }

        setTimeout(() => {
            setLoading(false);
            if (paymentMethod === 'EFECTIVO') {
                const amount = parseFloat(cashAmount);
                const change = amount - totalAmount;
                if (change > 0) {
                    toast.success(`Pago en efectivo confirmado. El repartidor debe devolverte ${formatCurrency(change)} de cambio.`);
                } else {
                    toast.success('Pago exacto en efectivo confirmado.');
                }
            }
            
            // Pasar la info al Cart.tsx
            const montoEfectivoParsed = paymentMethod === 'EFECTIVO' ? parseFloat(cashAmount) : null;
            onPaymentSuccess(paymentMethod, montoEfectivoParsed);

        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
                    <h2 className="text-xl font-bold text-gray-800">Método de Pago</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition rounded-full p-1 hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {/* Selectores de método */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('MERCADOPAGO')}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${paymentMethod === 'MERCADOPAGO' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                        >
                            <CreditCard className="w-6 h-6 mb-2" />
                            <span className="text-xs font-semibold">Mercado Pago</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('EFECTIVO')}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${paymentMethod === 'EFECTIVO' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                        >
                            <Banknote className="w-6 h-6 mb-2" />
                            <span className="text-xs font-semibold">Efectivo</span>
                        </button>
                    </div>

                    <form onSubmit={handleSimulatePayment}>
                        <div className="min-h-[180px]">
                            {/* Formulario Mercado Pago */}
                            {paymentMethod === 'MERCADOPAGO' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start text-sm mb-4">
                                        <CreditCard className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 opacity-70" />
                                        <p>Serás redirigido al portal seguro de <strong>Mercado Pago</strong> donde podrás pagar con tarjeta de crédito, débito o tu saldo disponible.</p>
                                    </div>
                                    <div className="flex justify-center p-6">
                                        <img src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.1/mercadopago/logo__large.png" alt="Mercado Pago" className="h-10 opacity-90" />
                                    </div>
                                </div>
                            )}

                            {/* Formulario Efectivo */}
                            {paymentMethod === 'EFECTIVO' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg flex items-start text-sm mb-6">
                                        <Banknote className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 opacity-70" />
                                        <p>El pago lo realizarás al momento de recibir tu pedido. El total a pagar es <strong>{formatCurrency(totalAmount)}</strong>.</p>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            ¿Con cuánto vas a pagar? <br/>
                                            <span className="text-xs font-normal text-slate-500">Esto nos ayuda a llevarte el cambio exacto.</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                                            <input
                                                type="number"
                                                placeholder="Ej. 50000"
                                                value={cashAmount}
                                                onChange={(e) => setCashAmount(e.target.value)}
                                                className="input-field pl-8 font-medium text-lg"
                                            />
                                        </div>
                                    </div>

                                    {cashAmount && parseFloat(cashAmount) > totalAmount && (
                                        <div className="mt-4 p-4 border border-slate-100 bg-slate-50 rounded-xl flex justify-between items-center">
                                            <span className="text-slate-600 text-sm font-medium">Cambio a devolver:</span>
                                            <span className="text-emerald-600 font-bold text-xl">
                                                {formatCurrency(parseFloat(cashAmount) - totalAmount)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary py-2.5 px-6 flex items-center shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                                {loading ? 'Procesando...' : (paymentMethod === 'MERCADOPAGO' ? 'Ir a pagar' : `Confirmar ${formatCurrency(totalAmount)}`)}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
