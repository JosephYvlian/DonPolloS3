import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/axios';
import { Mail, ArrowLeft, Store } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
    const [correo, setCorreo] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { correo });
            setSent(true);
            toast.success('Si el correo existe, hemos enviado un código de recuperación.');
        } catch (err: any) {
            toast.error('Error al solicitar la recuperación de contraseña.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in flex flex-col justify-center items-center py-12 px-4">
            <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-soft border border-surface-border text-center">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 bg-brand-50 text-brand-500 rounded-2xl flex items-center justify-center mb-4">
                        <Store className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Recuperar Contraseña</h2>
                    <p className="text-slate-500 mt-2 text-sm font-medium">Ingresa tu correo y te enviaremos un código.</p>
                </div>

                {!sent ? (
                    <form onSubmit={handleSubmit} className="space-y-5 text-left">
                        <div>
                            <label htmlFor="correo" className="label-primary">Correo Electrónico</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="correo"
                                    type="email"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                    className="input-field pl-11"
                                    placeholder="tu@correo.com"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading || !correo}
                                className="w-full btn-primary py-3.5 flex items-center justify-center text-lg"
                            >
                                {loading ? 'Enviando...' : 'Enviar Código'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-100">
                            Revisa tu bandeja de entrada o la carpeta de spam.
                        </div>
                        <Link to="/reset-password" className="w-full btn-primary py-3.5 flex items-center justify-center text-lg">
                            Ya tengo mi código
                        </Link>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-slate-100">
                    <Link to="/login" className="flex items-center justify-center text-sm font-medium text-slate-500 hover:text-brand-600 transition">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}
