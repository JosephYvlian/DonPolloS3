import { useState, useEffect } from 'react';
import { api } from '../api/axios';
import { useStore } from '../store/useStore';
import { User, MapPin, Plus, Trash2, Edit2, ShieldCheck, Check, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

interface Direccion {
    id: number;
    direccion: string;
    detalles: string;
    ciudad: string;
    esPorDefecto: boolean;
}

interface Tarjeta {
    id: number;
    numeroTarjeta: string;
    fechaExpiracion: string;
    cvv: string;
    nombreTitular: string;
    esPorDefecto: boolean;
}

export default function Profile() {
    const { user, setUser } = useStore();
    const [loading, setLoading] = useState(false);
    
    // Perfil
    const [nombreCompleto, setNombreCompleto] = useState(user?.nombreCompleto || '');
    const [telefono, setTelefono] = useState(user?.telefono || '');

    // Direcciones
    const [direcciones, setDirecciones] = useState<Direccion[]>([]);
    const [loadingDir, setLoadingDir] = useState(true);
    const [showDirForm, setShowDirForm] = useState(false);
    const [editDirId, setEditDirId] = useState<number | null>(null);
    const [dirForm, setDirForm] = useState({ direccion: '', detalles: '', ciudad: '', esPorDefecto: false });

    // Tarjetas
    const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
    const [loadingTarjetas, setLoadingTarjetas] = useState(true);
    const [showTarjetaForm, setShowTarjetaForm] = useState(false);
    const [tarjetaForm, setTarjetaForm] = useState({ numeroTarjeta: '', fechaExpiracion: '', cvv: '', nombreTitular: '', esPorDefecto: false });

    useEffect(() => {
        if (!user) return;
        setNombreCompleto(user.nombreCompleto || '');
        setTelefono(user.telefono || '');
        fetchDirecciones();
        fetchTarjetas();
    }, [user]);

    const fetchDirecciones = async () => {
        try {
            const res = await api.get('/direcciones');
            setDirecciones(res.data);
        } catch (err) {
            toast.error('Error al cargar direcciones');
        } finally {
            setLoadingDir(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put('/usuarios/profile', { nombreCompleto, telefono });
            setUser(res.data, useStore.getState().token!); // keep token
            toast.success('Perfil actualizado correctamente');
        } catch (err) {
            toast.error('Error al actualizar el perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveDireccion = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editDirId) {
                await api.put(`/direcciones/${editDirId}`, dirForm);
                toast.success('Dirección actualizada');
            } else {
                await api.post('/direcciones', dirForm);
                toast.success('Dirección agregada');
            }
            fetchDirecciones();
            setShowDirForm(false);
            setEditDirId(null);
            setDirForm({ direccion: '', detalles: '', ciudad: '', esPorDefecto: false });
        } catch (err) {
            toast.error('Error al guardar la dirección');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDireccion = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar esta dirección?')) return;
        try {
            await api.delete(`/direcciones/${id}`);
            toast.success('Dirección eliminada');
            fetchDirecciones();
        } catch (err) {
            toast.error('Error al eliminar dirección');
        }
    };

    const openEditForm = (dir: Direccion) => {
        setDirForm({
            direccion: dir.direccion,
            detalles: dir.detalles || '',
            ciudad: dir.ciudad || '',
            esPorDefecto: dir.esPorDefecto,
        });
        setEditDirId(dir.id);
        setShowDirForm(true);
    };

    const fetchTarjetas = async () => {
        try {
            const res = await api.get('/tarjetas');
            setTarjetas(res.data);
        } catch (err) {
            toast.error('Error al cargar tarjetas');
        } finally {
            setLoadingTarjetas(false);
        }
    };

    const handleValidarFecha = (exp: string) => {
        if (exp.length !== 5) return true; // Todavía escribiendo
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

    const handleSaveTarjeta = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (tarjetaForm.numeroTarjeta.length < 16) {
            toast.error('El número de tarjeta debe tener 16 dígitos');
            return;
        }
        if (tarjetaForm.fechaExpiracion.length !== 5 || !handleValidarFecha(tarjetaForm.fechaExpiracion)) {
            toast.error('La fecha de espiración es inválida o ha vencido');
            return;
        }
        if (tarjetaForm.cvv.length < 3) {
            toast.error('El CVV debe tener 3 dígitos');
            return;
        }

        setLoading(true);
        try {
            await api.post('/tarjetas', tarjetaForm);
            toast.success('Tarjeta agregada');
            fetchTarjetas();
            setShowTarjetaForm(false);
            setTarjetaForm({ numeroTarjeta: '', fechaExpiracion: '', cvv: '', nombreTitular: '', esPorDefecto: false });
        } catch (err) {
            toast.error('Error al guardar la tarjeta');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTarjeta = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar esta tarjeta?')) return;
        try {
            await api.delete(`/tarjetas/${id}`);
            toast.success('Tarjeta eliminada');
            fetchTarjetas();
        } catch (err) {
            toast.error('Error al eliminar tarjeta');
        }
    };

    const handleFormatoExpiracion = (val: string) => {
        // Solo digitos
        let v = val.replace(/\D/g, '');
        // Limite del mes
        if (v.length >= 2) {
            let mes = parseInt(v.substring(0, 2), 10);
            if (mes > 12) v = '12' + v.substring(2);
            if (mes === 0) v = '01' + v.substring(2);
        }
        // Auto slashes
        if (v.length >= 3) {
            return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
        }
        return v;
    };

    if (!user) {
        return <div className="p-8 text-center text-slate-500">Cargando perfil...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-8 flex items-center">
                <ShieldCheck className="w-8 h-8 mr-3 text-brand-500" />
                Mi Perfil
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {/* Datos Personales */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-soft border border-surface-border">
                        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                            <User className="w-5 h-5 mr-2 text-brand-500" />
                            Datos Personales
                        </h2>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="label-primary">Nombre Completo</label>
                                <input
                                    type="text"
                                    value={nombreCompleto}
                                    onChange={(e) => setNombreCompleto(e.target.value)}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="label-primary">Teléfono</label>
                                <input
                                    type="tel"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="label-primary">Correo Electrónico</label>
                                <input
                                    type="email"
                                    value={user.correo}
                                    disabled
                                    className="input-field bg-slate-50 text-slate-500 cursor-not-allowed"
                                />
                                <p className="text-xs text-slate-400 mt-1">El correo no puede modificarse.</p>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-2.5 mt-2"
                            >
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Columna Derecha: Direcciones y Tarjetas */}
                <div className="md:col-span-2 space-y-8">
                    {/* Direcciones */}
                    <div className="bg-white p-6 rounded-3xl shadow-soft border border-surface-border">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-brand-500" />
                                Mis Direcciones
                            </h2>
                            {!showDirForm && (
                                <button
                                    onClick={() => {
                                        setDirForm({ direccion: '', detalles: '', ciudad: '', esPorDefecto: false });
                                        setEditDirId(null);
                                        setShowDirForm(true);
                                    }}
                                    className="flex items-center text-sm font-medium text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Nueva
                                </button>
                            )}
                        </div>

                        {showDirForm && (
                            <form onSubmit={handleSaveDireccion} className="bg-slate-50 p-5 rounded-2xl mb-6 border border-slate-100 animate-fade-in">
                                <h3 className="font-bold text-slate-700 mb-4">{editDirId ? 'Editar Dirección' : 'Nueva Dirección'}</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="label-primary text-sm">Dirección Principal</label>
                                        <input
                                            type="text"
                                            value={dirForm.direccion}
                                            onChange={(e) => setDirForm({ ...dirForm, direccion: e.target.value })}
                                            placeholder="Calle 123 #45-67"
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="label-primary text-sm">Detalles (Opcional)</label>
                                            <input
                                                type="text"
                                                value={dirForm.detalles}
                                                onChange={(e) => setDirForm({ ...dirForm, detalles: e.target.value })}
                                                placeholder="Apto, Casa, etc."
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="label-primary text-sm">Ciudad</label>
                                            <input
                                                type="text"
                                                value={dirForm.ciudad}
                                                onChange={(e) => setDirForm({ ...dirForm, ciudad: e.target.value })}
                                                placeholder="Bogotá"
                                                className="input-field"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <label className="flex items-center space-x-2 cursor-pointer mt-2">
                                        <input
                                            type="checkbox"
                                            checked={dirForm.esPorDefecto}
                                            onChange={(e) => setDirForm({ ...dirForm, esPorDefecto: e.target.checked })}
                                            className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4"
                                        />
                                        <span className="text-sm text-slate-600 font-medium">Establecer como dirección por defecto</span>
                                    </label>
                                    <div className="flex space-x-3 pt-2">
                                        <button type="submit" disabled={loading} className="btn-primary py-2 px-4 flex-1">
                                            {loading ? 'Guardando...' : 'Guardar Dirección'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowDirForm(false)}
                                            className="bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold hover:bg-slate-300 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {loadingDir ? (
                            <div className="flex justify-center py-8">
                                <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : direcciones.length === 0 && !showDirForm ? (
                            <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                <p className="text-slate-500 font-medium">No tienes direcciones guardadas.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {direcciones.map(dir => (
                                    <div key={dir.id} className={`p-4 rounded-2xl border flex justify-between items-center transition-all ${dir.esPorDefecto ? 'border-brand-200 bg-brand-50/30' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                                        <div>
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h4 className="font-bold text-slate-800">{dir.direccion}</h4>
                                                {dir.esPorDefecto && (
                                                    <span className="bg-brand-100 text-brand-700 text-xs px-2 py-0.5 rounded-full font-bold flex items-center">
                                                        <Check className="w-3 h-3 mr-1" />
                                                        Principal
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-500">
                                                {dir.ciudad} {dir.detalles && `• ${dir.detalles}`}
                                            </p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => openEditForm(dir)}
                                                className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteDireccion(dir.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Tarjetas de Pago */}
                    <div className="bg-white p-6 rounded-3xl shadow-soft border border-surface-border">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center">
                                <CreditCard className="w-5 h-5 mr-2 text-brand-500" />
                                Mis Tarjetas de Pago
                            </h2>
                            {!showTarjetaForm && (
                                <button
                                    onClick={() => {
                                        setTarjetaForm({ numeroTarjeta: '', fechaExpiracion: '', cvv: '', nombreTitular: '', esPorDefecto: false });
                                        setShowTarjetaForm(true);
                                    }}
                                    className="flex items-center text-sm font-medium text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Nueva
                                </button>
                            )}
                        </div>

                        {showTarjetaForm && (
                            <form onSubmit={handleSaveTarjeta} className="bg-slate-50 p-5 rounded-2xl mb-6 border border-slate-100 animate-fade-in">
                                <h3 className="font-bold text-slate-700 mb-4">Nueva Tarjeta</h3>
                                <div className="h-40 bg-gradient-to-tr from-slate-800 to-slate-900 rounded-xl p-6 text-white relative shadow-md overflow-hidden mb-6">
                                    <div className="absolute top-4 right-6 text-white opacity-80 text-xl font-bold italic">
                                        PAY
                                    </div>
                                    <div className="mt-12 text-xl tracking-[0.2em] font-mono opacity-90">
                                        {tarjetaForm.numeroTarjeta || '•••• •••• •••• ••••'}
                                    </div>
                                    <div className="flex justify-between mt-6 text-sm opacity-80 font-mono">
                                        <span>{tarjetaForm.nombreTitular || 'TITULAR'}</span>
                                        <span>{tarjetaForm.fechaExpiracion || 'MM/YY'}</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="label-primary text-sm">Número de Tarjeta</label>
                                        <input
                                            type="text"
                                            value={tarjetaForm.numeroTarjeta}
                                            onChange={(e) => setTarjetaForm({ ...tarjetaForm, numeroTarjeta: e.target.value.replace(/\D/g, '').substring(0, 16) })}
                                            placeholder="1234123412341234"
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="label-primary text-sm">Expiración (MM/YY)</label>
                                            <input
                                                type="text"
                                                value={tarjetaForm.fechaExpiracion}
                                                onChange={(e) => setTarjetaForm({ ...tarjetaForm, fechaExpiracion: handleFormatoExpiracion(e.target.value) })}
                                                placeholder="MM/YY"
                                                className="input-field"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="label-primary text-sm">CVV</label>
                                            <input
                                                type="text"
                                                value={tarjetaForm.cvv}
                                                onChange={(e) => setTarjetaForm({ ...tarjetaForm, cvv: e.target.value.replace(/\D/g, '').substring(0, 3) })}
                                                placeholder="123"
                                                className="input-field"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="label-primary text-sm">Titular de la Tarjeta</label>
                                        <input
                                            type="text"
                                            value={tarjetaForm.nombreTitular}
                                            onChange={(e) => setTarjetaForm({ ...tarjetaForm, nombreTitular: e.target.value.replace(/[0-9]/g, '').toUpperCase() })}
                                            placeholder="NOMBRE APELLIDO"
                                            className="input-field uppercase"
                                            required
                                        />
                                    </div>
                                    <label className="flex items-center space-x-2 cursor-pointer mt-2">
                                        <input
                                            type="checkbox"
                                            checked={tarjetaForm.esPorDefecto}
                                            onChange={(e) => setTarjetaForm({ ...tarjetaForm, esPorDefecto: e.target.checked })}
                                            className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4"
                                        />
                                        <span className="text-sm text-slate-600 font-medium">Establecer como tarjeta por defecto</span>
                                    </label>
                                    <div className="flex space-x-3 pt-2">
                                        <button type="submit" disabled={loading} className="btn-primary py-2 px-4 flex-1">
                                            {loading ? 'Guardando...' : 'Guardar Tarjeta'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowTarjetaForm(false)}
                                            className="bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold hover:bg-slate-300 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {loadingTarjetas ? (
                            <div className="flex justify-center py-8">
                                <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : tarjetas.length === 0 && !showTarjetaForm ? (
                            <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                <p className="text-slate-500 font-medium">No tienes tarjetas guardadas.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {tarjetas.map(tar => (
                                    <div key={tar.id} className={`p-4 rounded-2xl border flex justify-between items-center transition-all ${tar.esPorDefecto ? 'border-brand-200 bg-brand-50/30' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                                        <div>
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h4 className="font-bold text-slate-800">•••• •••• •••• {tar.numeroTarjeta.slice(-4)}</h4>
                                                {tar.esPorDefecto && (
                                                    <span className="bg-brand-100 text-brand-700 text-xs px-2 py-0.5 rounded-full font-bold flex items-center">
                                                        <Check className="w-3 h-3 mr-1" />
                                                        Principal
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-500">
                                                Expira: {tar.fechaExpiracion} • {tar.nombreTitular}
                                            </p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleDeleteTarjeta(tar.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
