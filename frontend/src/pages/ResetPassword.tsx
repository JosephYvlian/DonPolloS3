import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/axios';
import { Lock, Hash, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResetPassword() {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/reset-password', { token, newPassword });
            toast.success('¡Contraseña actualizada! Ya puedes iniciar sesión.');
            navigate('/login');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Error al restablecer la contraseña. Verifica tu código.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in flex flex-col justify-center items-center py-12 px-4">
            <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-soft border border-surface-border text-center">
                <div className="flex flex-col items-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Nueva Contraseña</h2>
                    <p className="text-slate-500 mt-2 text-sm font-medium">Ingresa el código que recibiste y tu nueva contraseña.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 text-left">
                    <div>
                        <label htmlFor="token" className="label-primary">Código de Recuperación</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Hash className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                id="token"
                                type="text"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                className="input-field pl-11"
                                placeholder="123456"
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="newPassword" className="label-primary">Nueva Contraseña Segura</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="input-field pl-11"
                                placeholder="Mínimo 6 caracteres"
                                minLength={6}
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading || !token || !newPassword}
                            className="w-full btn-primary py-3.5 flex items-center justify-center text-lg"
                        >
                            {loading ? 'Actualizando...' : 'Restablecer Contraseña'}
                        </button>
                    </div>
                </form>

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
