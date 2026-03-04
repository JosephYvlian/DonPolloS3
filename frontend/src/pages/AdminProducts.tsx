import React, { useEffect, useState } from 'react';
import { api } from '../api/axios';
import type { Producto } from '../types';
import toast from 'react-hot-toast';
import { Plus, Edit2, PackageOpen, Check, X } from 'lucide-react';
import clsx from 'clsx';
import { formatCurrency } from '../utils/formatCurrency';

export default function AdminProducts() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Form state
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [stockDisponible, setStockDisponible] = useState('');
    const [imagen, setImagen] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        setLoading(true);
        try {
            const response = await api.get('/productos');
            setProductos(response.data);
        } catch (err) {
            console.error('Error fetching productos', err);
            toast.error('Ocurrió un error al cargar los productos');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setNombre('');
        setDescripcion('');
        setPrecio('');
        setStockDisponible('');
        setImagen(null);
        setEditingId(null);
        setIsFormOpen(false);
    };

    const handleEdit = (producto: Producto) => {
        setNombre(producto.nombre);
        setDescripcion(producto.descripcion);
        setPrecio(producto.precio.toString());
        setStockDisponible(producto.stockDisponible.toString());
        setEditingId(producto.id);
        setIsFormOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImagen(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        formData.append('precio', precio);
        formData.append('stockDisponible', stockDisponible);
        if (imagen) {
            formData.append('imagen', imagen);
        }

        try {
            if (editingId) {
                await api.put(`/productos/${editingId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Producto actualizado exitosamente');
            } else {
                await api.post('/productos', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Producto creado exitosamente');
            }
            await fetchProductos();
            resetForm();
        } catch (err) {
            console.error('Error saving product', err);
            toast.error('Ocurrió un error al guardar el producto');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading && !productos.length) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-brand-500 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">Cargando inventario...</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8 md:mb-12">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">Administrar Productos</h1>
                    <p className="mt-2 text-lg text-slate-500 font-medium tracking-wide">Gestiona tu catálogo e imágenes.</p>
                </div>
                {!isFormOpen && (
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="bg-brand-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-brand-600 transition-colors flex items-center shadow-lg shadow-brand-500/30"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Nuevo Producto
                    </button>
                )}
            </div>

            {isFormOpen && (
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 md:p-8 mb-10 border border-slate-100 relative">
                    <button
                        onClick={resetForm}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-full transition-colors"
                        title="Cerrar"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                        {editingId ? <><Edit2 className="w-6 h-6 mr-3 text-brand-500" /> Editar Producto</> : <><PackageOpen className="w-6 h-6 mr-3 text-brand-500" /> Crear Nuevo Producto</>}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 col-span-1 md:col-span-2">
                                <label className="text-sm font-bold text-slate-700">Nombre del Producto</label>
                                <input
                                    type="text"
                                    required
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 outline-none transition-all placeholder:text-slate-400 font-medium"
                                    placeholder="Ej. Pollo Asado Familiar"
                                />
                            </div>

                            <div className="space-y-2 col-span-1 md:col-span-2">
                                <label className="text-sm font-bold text-slate-700">Descripción</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 outline-none transition-all resize-none placeholder:text-slate-400 font-medium"
                                    placeholder="Detalles sobre el producto..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Precio ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    required
                                    value={precio}
                                    onChange={(e) => setPrecio(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 outline-none transition-all placeholder:text-slate-400 font-medium"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Stock Inicial</label>
                                <input
                                    type="number"
                                    min="0"
                                    required
                                    value={stockDisponible}
                                    onChange={(e) => setStockDisponible(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 outline-none transition-all placeholder:text-slate-400 font-medium"
                                    placeholder="Cantidad disponible"
                                />
                            </div>

                            <div className="space-y-2 col-span-1 md:col-span-2">
                                <label className="text-sm font-bold text-slate-700">Imagen del Producto</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl bg-slate-50 hover:bg-slate-100 hover:border-brand-400 transition-colors cursor-pointer relative group">
                                    <div className="space-y-2 text-center">
                                        <PackageOpen className="mx-auto h-12 w-12 text-slate-400 group-hover:text-brand-500 transition-colors" />
                                        <div className="flex text-sm text-slate-600 justify-center">
                                            <span className="relative rounded-md font-bold text-brand-600 hover:text-brand-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-500">
                                                <span>Subir un archivo</span>
                                                <input
                                                    type="file"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                />
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            {imagen ? <span className="text-brand-600 font-bold">{imagen.name}</span> : "PNG, JPG, GIF hasta 10MB"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="mr-4 px-6 py-2.5 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={clsx(
                                    "px-8 py-2.5 text-white font-bold rounded-xl shadow-lg transition-all flex items-center",
                                    isSubmitting ? "bg-brand-400 cursor-wait" : "bg-brand-500 hover:bg-brand-600 shadow-brand-500/30 hover:shadow-brand-500/40"
                                )}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-5 h-5 mr-2" />
                                        {editingId ? 'Guardar Cambios' : 'Crear Producto'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Producto</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Precio</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
                            <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {productos.map((producto) => (
                            <tr key={producto.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            {producto.imagenUrl ? (
                                                <img className="h-10 w-10 rounded-lg object-cover" src={producto.imagenUrl} alt="" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                                    <PackageOpen className="h-5 w-5 text-slate-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-bold text-slate-900">{producto.nombre}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-slate-900">{formatCurrency(producto.precio)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={clsx(
                                        "px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full",
                                        producto.stockDisponible > 10 ? "bg-green-100 text-green-800" :
                                            producto.stockDisponible > 0 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                                    )}>
                                        {producto.stockDisponible}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(producto)}
                                        className="text-brand-600 hover:text-brand-900 bg-brand-50 hover:bg-brand-100 p-2 rounded-lg transition-colors inline-flex items-center"
                                    >
                                        <Edit2 className="w-4 h-4 mr-1" /> Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {productos.length === 0 && !loading && (
                    <div className="py-12 text-center text-slate-500">
                        No hay productos registrados.
                    </div>
                )}
            </div>
        </div>
    );
}
