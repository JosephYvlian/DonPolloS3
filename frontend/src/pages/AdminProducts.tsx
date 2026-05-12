import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { api } from '../api/axios';
import { useNavigate } from 'react-router-dom';
import type { Producto } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import { Package, Plus, Edit2, Trash2, Image as ImageIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProducts() {
    const { user } = useStore();
    const navigate = useNavigate();
    
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loadingProductos, setLoadingProductos] = useState(true);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [prodForm, setProdForm] = useState({
        nombre: '', descripcion: '', precio: '', stockDisponible: '', estado: 'ACTIVO'
    });
    const [prodImage, setProdImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!user || user.rol !== 'ADMINISTRADOR') {
            navigate('/');
            toast.error('Acceso denegado. Se requieren permisos de administrador.');
            return;
        }
        fetchProductos();
    }, [user, navigate]);

    const fetchProductos = async () => {
        setLoadingProductos(true);
        try {
            const res = await api.get('/productos');
            setProductos(res.data);
        } catch (err) {
            toast.error('Error al cargar productos');
        } finally {
            setLoadingProductos(false);
        }
    };

    const handleOpenModal = (producto?: Producto) => {
        if (producto) {
            setEditingProduct(producto);
            setProdForm({
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                precio: producto.precio.toString(),
                stockDisponible: producto.stockDisponible.toString(),
                estado: producto.estado
            });
            setImagePreview(producto.imagenUrl);
        } else {
            setEditingProduct(null);
            setProdForm({ nombre: '', descripcion: '', precio: '', stockDisponible: '', estado: 'ACTIVO' });
            setImagePreview('');
        }
        setProdImage(null);
        setIsProductModalOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProdImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSaveProducto = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('nombre', prodForm.nombre);
            formData.append('descripcion', prodForm.descripcion);
            formData.append('precio', prodForm.precio);
            formData.append('stockDisponible', prodForm.stockDisponible);
            formData.append('estado', prodForm.estado);
            
            if (prodImage) {
                formData.append('imagen', prodImage);
            }

            if (editingProduct) {
                await api.put(`/productos/${editingProduct.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Producto actualizado');
            } else {
                await api.post('/productos', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Producto creado');
            }
            setIsProductModalOpen(false);
            fetchProductos();
        } catch (err) {
            toast.error('Error al guardar el producto');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteProducto = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;
        try {
            await api.delete(`/productos/${id}`);
            toast.success('Producto eliminado');
            fetchProductos();
        } catch (err) {
            toast.error('Error al eliminar producto');
        }
    };

    if (!user || user.rol !== 'ADMINISTRADOR') return null;

    return (
        <div className="max-w-7xl mx-auto py-8">
            <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-xl shadow-sm flex justify-center items-center mr-4">
                    <Package className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Gestión de Productos</h1>
                    <p className="text-slate-500">Administra el inventario y catálogo de la tienda</p>
                </div>
            </div>

            <div className="animate-fade-in space-y-6">
                <div className="flex justify-end items-center">
                    <button onClick={() => handleOpenModal()} className="btn-primary flex items-center py-2 text-sm">
                        <Plus className="w-4 h-4 mr-2" /> Nuevo Producto
                    </button>
                </div>

                {loadingProductos ? (
                    <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-slate-200 border-t-brand-500 rounded-full animate-spin"></div></div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-soft border border-surface-border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Producto</th>
                                        <th className="px-6 py-4">Precio</th>
                                        <th className="px-6 py-4">Stock</th>
                                        <th className="px-6 py-4">Estado</th>
                                        <th className="px-6 py-4 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {productos.map(p => (
                                        <tr key={p.id} className="hover:bg-slate-50/50 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <img src={p.imagenUrl || 'https://via.placeholder.com/40'} alt={p.nombre} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                                                    <div>
                                                        <p className="font-bold text-slate-800">{p.nombre}</p>
                                                        <p className="text-xs text-slate-500 w-48 truncate">{p.descripcion}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-700">{formatCurrency(p.precio)}</td>
                                            <td className="px-6 py-4 font-medium text-slate-600">{p.stockDisponible}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-bold rounded-md ${p.estado === 'ACTIVO' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                    {p.estado}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button onClick={() => handleOpenModal(p)} className="p-2 text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition" title="Editar"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDeleteProducto(p.id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {productos.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No hay productos en el catálogo.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL DE PRODUCTO */}
            {isProductModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-bold text-lg text-slate-800">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                            <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 bg-white rounded-lg shadow-sm border border-slate-100"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="overflow-y-auto p-6">
                            <form id="productForm" onSubmit={handleSaveProducto} className="space-y-4">
                                <div>
                                    <label className="label-primary">Nombre del Producto</label>
                                    <input type="text" required value={prodForm.nombre} onChange={e => setProdForm({...prodForm, nombre: e.target.value})} className="input-field" />
                                </div>
                                <div>
                                    <label className="label-primary">Descripción</label>
                                    <textarea required value={prodForm.descripcion} onChange={e => setProdForm({...prodForm, descripcion: e.target.value})} className="input-field min-h-[80px]" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label-primary">Precio (COP)</label>
                                        <input type="number" required min="0" value={prodForm.precio} onChange={e => setProdForm({...prodForm, precio: e.target.value})} className="input-field" />
                                    </div>
                                    <div>
                                        <label className="label-primary">Stock Disponible</label>
                                        <input type="number" required min="0" value={prodForm.stockDisponible} onChange={e => setProdForm({...prodForm, stockDisponible: e.target.value})} className="input-field" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label-primary">Estado</label>
                                        <select value={prodForm.estado} onChange={e => setProdForm({...prodForm, estado: e.target.value})} className="input-field">
                                            <option value="ACTIVO">ACTIVO</option>
                                            <option value="INACTIVO">INACTIVO</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label-primary">Imagen</label>
                                        <button 
                                            type="button" 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full flex justify-center items-center px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600 transition"
                                        >
                                            <ImageIcon className="w-5 h-5 mr-2" />
                                            {prodImage ? 'Cambiar' : 'Subir'}
                                        </button>
                                        <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                                    </div>
                                </div>
                                {imagePreview && (
                                    <div className="mt-4 flex justify-center">
                                        <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-xl border border-slate-200 shadow-sm" />
                                    </div>
                                )}
                            </form>
                        </div>
                        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3">
                            <button type="button" onClick={() => setIsProductModalOpen(false)} className="btn-secondary py-2">Cancelar</button>
                            <button type="submit" form="productForm" disabled={isSaving} className="btn-primary py-2">
                                {isSaving ? 'Guardando...' : 'Guardar Producto'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
