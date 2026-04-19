import React, { useState, useEffect } from 'react';
import { CreditCard, Landmark, Banknote, X, Loader2, Check } from 'lucide-react';
import { api } from '../api/axios';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatCurrency';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalAmount: number;
    onPaymentSuccess: (metodoPago: string, montoEfectivo: number | null) => void;
}

export default function CheckoutModal({ isOpen, onClose, totalAmount, onPaymentSuccess }: CheckoutModalProps) {
    const [paymentMethod, setPaymentMethod] = useState<'TARJETA' | 'PSE' | 'EFECTIVO'>('TARJETA');
    const [loading, setLoading] = useState(false);
    
    // Formulario de Tarjeta
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardName, setCardName] = useState('');

    // Formulario PSE
    const [bank, setBank] = useState('');
    const [docType, setDocType] = useState('CC');
    const [docNumber, setDocNumber] = useState('');

    // Formulario Efectivo
    const [cashAmount, setCashAmount] = useState<string>('');

    // Tarjetas Guardadas
    const [savedCards, setSavedCards] = useState<any[]>([]);
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchSavedCards();
        }
    }, [isOpen]);

    const fetchSavedCards = async () => {
        try {
            const res = await api.get('/tarjetas');
            setSavedCards(res.data);
            if (res.data.length > 0) {
                const defaultCard = res.data.find((c: any) => c.esPorDefecto) || res.data[0];
                setSelectedCardId(defaultCard.id);
            }
        } catch (err) {
            console.error('Error fetching cards', err);
        }
    };

    if (!isOpen) return null;

    const handleValidarFecha = (exp: string) => {
        if (exp.length !== 5) return true;
        const [mm, yy] = exp.split('/');
        const mes = parseInt(mm, 10);
        const anio = parseInt(yy, 10);
        const currentYear = parseInt(new Date().getFullYear().toString().slice(2));
        const currentMonth = new Date().getMonth() + 1;

        if (anio < currentYear || (anio === currentYear && mes < currentMonth)) {
            return false;
        }
        return true;
    };

    const handleFormatoExpiracion = (val: string) => {
        let v = val.replace(/\D/g, '');
        if (v.length >= 2) {
            let mes = parseInt(v.substring(0, 2), 10);
            if (mes > 12) v = '12' + v.substring(2);
            if (mes === 0) v = '01' + v.substring(2);
        }
        if (v.length >= 3) {
            return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
        }
        return v;
    };

    const handleSimulatePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (paymentMethod === 'TARJETA') {
            if (selectedCardId === null) {
                if (cardNumber.length < 16) {
                    toast.error('El número de tarjeta debe tener 16 dígitos');
                    return;
                }
                if (expiry.length !== 5 || !handleValidarFecha(expiry)) {
                    toast.error('La fecha de expiración es inválida o la tarjeta ha vencido');
                    return;
                }
                if (cvv.length < 3) {
                    toast.error('El CVV debe tener 3 dígitos');
                    return;
                }
                if (!cardName) {
                    toast.error('Por favor ingresa el nombre del titular');
                    return;
                }
            } else {
                // Se usó una tarjeta guardada, podemos requerir CVV por seguridad si quisiéramos,
                // Pero por fluidez asumiremos validación superada.
            }
        } else if (paymentMethod === 'PSE') {
            if (!bank || !docNumber) {
                toast.error('Completa los datos para PSE');
                return;
            }
        } else if (paymentMethod === 'EFECTIVO') {
            const amount = parseFloat(cashAmount);
            if (!amount || amount < totalAmount) {
                toast.error(`El pago debe ser mayor o igual al total (${formatCurrency(totalAmount)})`);
                return;
            }
        }

        setLoading(true);

        // Simulando procesamiento según el método
        if (paymentMethod === 'TARJETA') {
            toast('Procesando pago con tarjeta... 🤔', { icon: '⏳', duration: 2000 });
        } else if (paymentMethod === 'PSE') {
            toast('Redirigiendo a la pasarela bancaria... 🏦', { icon: '⏳', duration: 2000 });
        } else if (paymentMethod === 'EFECTIVO') {
            toast('Confirmando método de pago en efectivo... 📄', { icon: '⏳', duration: 1500 });
        }

        setTimeout(() => {
            setLoading(false);
            if (paymentMethod === 'TARJETA') {
                toast.success('¡Pago Procesado Exitosamente!');
            } else if (paymentMethod === 'PSE') {
                toast.success('¡Transferencia Exitosa!');
            } else {
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

        }, 2000);
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
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <button
                            onClick={() => setPaymentMethod('TARJETA')}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${paymentMethod === 'TARJETA' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                        >
                            <CreditCard className="w-6 h-6 mb-2" />
                            <span className="text-xs font-semibold">Tarjeta</span>
                        </button>
                        <button
                            onClick={() => setPaymentMethod('PSE')}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${paymentMethod === 'PSE' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                        >
                            <Landmark className="w-6 h-6 mb-2" />
                            <span className="text-xs font-semibold">PSE</span>
                        </button>
                        <button
                            onClick={() => setPaymentMethod('EFECTIVO')}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${paymentMethod === 'EFECTIVO' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                        >
                            <Banknote className="w-6 h-6 mb-2" />
                            <span className="text-xs font-semibold">Efectivo</span>
                        </button>
                    </div>

                    <form onSubmit={handleSimulatePayment}>
                        <div className="min-h-[220px]">
                            {/* Formulario Tarjeta */}
                            {paymentMethod === 'TARJETA' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    {savedCards.length > 0 && (
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Selecciona un método de pago</label>
                                            <div className="space-y-2">
                                                {savedCards.map(tarjeta => (
                                                    <label 
                                                        key={tarjeta.id} 
                                                        className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedCardId === tarjeta.id ? 'border-brand-500 bg-brand-50/50' : 'border-slate-200 hover:border-slate-300'}`}
                                                        onClick={() => setSelectedCardId(tarjeta.id)}
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedCardId === tarjeta.id ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-300'}`}>
                                                                {selectedCardId === tarjeta.id && <Check className="w-3 h-3" />}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-800 text-sm">•••• •••• •••• {tarjeta.numeroTarjeta.slice(-4)}</p>
                                                                <p className="text-xs text-slate-500">{tarjeta.nombreTitular} • Exp. {tarjeta.fechaExpiracion}</p>
                                                            </div>
                                                        </div>
                                                        <CreditCard className="w-5 h-5 text-slate-400" />
                                                    </label>
                                                ))}
                                                <label 
                                                    className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedCardId === null ? 'border-brand-500 bg-brand-50/50' : 'border-slate-200 hover:border-slate-300'}`}
                                                    onClick={() => {
                                                        setSelectedCardId(null);
                                                        setCardNumber('');
                                                        setExpiry('');
                                                        setCvv('');
                                                        setCardName('');
                                                    }}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedCardId === null ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-300'}`}>
                                                            {selectedCardId === null && <Check className="w-3 h-3" />}
                                                        </div>
                                                        <p className="font-bold text-slate-800 text-sm">Usar una nueva tarjeta</p>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {(selectedCardId === null || savedCards.length === 0) ? (
                                        <>
                                            <div className="h-40 bg-gradient-to-tr from-slate-800 to-slate-900 rounded-xl p-6 text-white relative shadow-md overflow-hidden">
                                                <div className="absolute top-4 right-6 text-white opacity-80 text-xl font-bold italic">
                                                    PAY
                                                </div>
                                                <div className="mt-12 text-xl tracking-[0.2em] font-mono opacity-90">
                                                    {cardNumber || '•••• •••• •••• ••••'}
                                                </div>
                                                <div className="flex justify-between mt-6 text-sm opacity-80 font-mono">
                                                    <span>{cardName || 'TITULAR'}</span>
                                                    <span>{expiry || 'MM/YY'}</span>
                                                </div>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Número de Tarjeta"
                                                value={cardNumber}
                                                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                                                className="input-field"
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="MM/YY"
                                                    value={expiry}
                                                    onChange={(e) => setExpiry(handleFormatoExpiracion(e.target.value))}
                                                    className="input-field"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="CVV"
                                                    value={cvv}
                                                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                                    className="input-field"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Nombre del Titular"
                                                value={cardName}
                                                onChange={(e) => setCardName(e.target.value.replace(/[0-9]/g, '').toUpperCase())}
                                                className="input-field uppercase"
                                            />
                                        </>
                                    ) : (() => {
                                        const tarj = savedCards.find(c => c.id === selectedCardId);
                                        return tarj && (
                                            <div className="h-40 bg-gradient-to-tr from-slate-800 to-slate-900 rounded-xl p-6 text-white relative shadow-md overflow-hidden opacity-90 transition-opacity">
                                                <div className="absolute top-4 right-6 text-white opacity-80 text-xl font-bold italic">
                                                    PAY
                                                </div>
                                                <div className="mt-12 text-xl tracking-[0.2em] font-mono opacity-90">
                                                    •••• •••• •••• {tarj.numeroTarjeta.slice(-4)}
                                                </div>
                                                <div className="flex justify-between mt-6 text-sm opacity-80 font-mono">
                                                    <span>{tarj.nombreTitular}</span>
                                                    <span>{tarj.fechaExpiracion}</span>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}

                            {/* Formulario PSE */}
                            {paymentMethod === 'PSE' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start text-sm mb-4">
                                        <Landmark className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 opacity-70" />
                                        <p>Se te redirigirá al portal de tu banco de manera segura para completar el pago.</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Selecciona tu Banco</label>
                                        <select
                                            value={bank}
                                            onChange={(e) => setBank(e.target.value)}
                                            className="input-field"
                                        >
                                            <option value="">Seleccione un banco...</option>
                                            <option value="Bancolombia">Bancolombia</option>
                                            <option value="Davivienda">Davivienda</option>
                                            <option value="Nequi">Nequi</option>
                                            <option value="Banco de Bogotá">Banco de Bogotá</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-1">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                                            <select
                                                value={docType}
                                                onChange={(e) => setDocType(e.target.value)}
                                                className="input-field"
                                            >
                                                <option value="CC">CC</option>
                                                <option value="CE">CE</option>
                                                <option value="NIT">NIT</option>
                                            </select>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Documento</label>
                                            <input
                                                type="text"
                                                placeholder="Número"
                                                value={docNumber}
                                                onChange={(e) => setDocNumber(e.target.value.replace(/\D/g, ''))}
                                                className="input-field"
                                            />
                                        </div>
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
                                {loading ? 'Procesando...' : `Pagar ${formatCurrency(totalAmount)}`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
