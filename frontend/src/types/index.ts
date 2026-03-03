export interface Usuario {
    id: number;
    nombreCompleto: string;
    correo: string;
    rol: 'CLIENTE' | 'ADMINISTRADOR';
}

export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stockDisponible: number;
    imagenUrl: string;
    estado: 'ACTIVO' | 'INACTIVO';
}

export interface Pedido {
    id: number;
    fechaPedido: string;
    total: number;
    estado: string;
    detalles: any[];
}
