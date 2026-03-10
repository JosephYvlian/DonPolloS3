export declare enum EstadoProducto {
    ACTIVO = "ACTIVO",
    INACTIVO = "INACTIVO"
}
export declare class Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stockDisponible: number;
    imagenUrl: string;
    estado: EstadoProducto;
}
