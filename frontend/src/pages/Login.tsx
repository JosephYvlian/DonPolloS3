import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/axios';
import { useStore } from '../store/useStore';
import { Store, ArrowRight, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { setUser } = useStore();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { correo, password });
            setUser(response.data.user, response.data.access_token);
            toast.success(`¡Bienvenido de nuevo, ${response.data.user.nombreCompleto.split(' ')[0]}!`);
            navigate('/');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in flex flex-col justify-center items-center min-h-[70vh] px-4">
            <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-soft border border-surface-border">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-brand-50 text-brand-500 rounded-2xl flex items-center justify-center mb-4">
                        <Store className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Iniciar Sesión</h2>
                    <p className="text-slate-500 mt-2 text-center text-sm font-medium">Ingresa para realizar y ver tus pedidos.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
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
                                autoComplete="email"
                                autoFocus
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="label-primary">Contraseña</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field pl-11"
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading || !correo || !password}
                            className="w-full btn-primary py-3.5 flex items-center justify-center text-lg"
                        >
                            {loading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Iniciando...</span>
                                </div>
                            ) : (
                                <>
                                    <span>Entrar a mi cuenta</span>
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-500 font-medium">
                        ¿Eres nuevo en Don Pollo?{' '}
                        <Link to="/register" className="text-brand-600 font-bold hover:text-brand-700 hover:underline transition">
                            Crea una cuenta ahora
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
