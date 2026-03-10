import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/axios';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
    const [formData, setFormData] = useState({
        nombreCompleto: '',
        correo: '',
        passwordHash: '',
        telefono: '',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/register', formData);
            toast.success('¡Cuenta creada exitosamente! Ahora por favor inicia sesión.');
            navigate('/login');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Error al compilar el registro. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in flex flex-col justify-center items-center px-4 py-8">
            <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-soft border border-surface-border">
                <div className="flex flex-col items-center mb-8">
                    <div className="mb-6 flex justify-center">
                        <img src="https://res.cloudinary.com/dvpt0r0wz/image/upload/v1741581139/donpollo/logo.png" alt="Don Pollo Logo" className="h-24 w-auto drop-shadow-md" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Crear Cuenta</h2>
                    <p className="text-slate-500 mt-2 text-center text-sm font-medium">Únete a cientos de clientes satisfechos.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label htmlFor="nombreCompleto" className="label-primary">Tu Nombre Completo</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                id="nombreCompleto"
                                type="text"
                                value={formData.nombreCompleto}
                                onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                                className="input-field pl-11"
                                placeholder="Juan Pérez"
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="correo" className="label-primary">Correo Electrónico</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                id="correo"
                                type="email"
                                value={formData.correo}
                                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                                className="input-field pl-11"
                                placeholder="tu@correo.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="passwordHash" className="label-primary">Contraseña Segura</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                id="passwordHash"
                                type="password"
                                value={formData.passwordHash}
                                onChange={(e) => setFormData({ ...formData, passwordHash: e.target.value })}
                                className="input-field pl-11"
                                placeholder="Mínimo 6 caracteres"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="telefono" className="label-primary">Tu Teléfono</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                id="telefono"
                                type="tel"
                                value={formData.telefono}
                                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                className="input-field pl-11"
                                placeholder="320 123 4567"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading || !formData.correo || !formData.passwordHash || !formData.nombreCompleto || !formData.telefono}
                            className="w-full btn-primary py-3.5 flex items-center justify-center text-lg"
                        >
                            {loading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Creando cuenta...</span>
                                </div>
                            ) : (
                                <>
                                    <UserPlus className="mr-2 w-5 h-5" />
                                    <span>Unirme a Don Pollo</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-500 font-medium">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/login" className="text-brand-600 font-bold hover:text-brand-700 hover:underline transition">
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
