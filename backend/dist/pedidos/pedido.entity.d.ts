import { Usuario } from '../usuarios/usuario.entity';
import { DetallePedido } from './detalle-pedido.entity';
export declare enum EstadoPedido {
    PAGO_PENDIENTE = "Pago Pendiente",
    PAGO_RECHAZADO = "Pago Rechazado",
    PAGO_EXITOSO = "Pago Exitoso",
    PEDIDO_RECIBIDO = "Pedido Recibido",
    EN_PREPARACION = "En Preparaci\u00F3n",
    PEDIDO_EN_CAMINO = "Pedido en Camino",
    PEDIDO_ENTREGADO = "Pedido Entregado",
    EN_CAMINO = "En camino",
    ENTREGADO = "Entregado"
}
export declare enum MetodoPago {
    TARJETA = "TARJETA",
    PSE = "PSE",
    EFECTIVO = "EFECTIVO",
    MERCADOPAGO = "MERCADOPAGO"
}
export declare class Pedido {
    id: number;
    usuarioId: number;
    usuario: Usuario;
    fechaPedido: Date;
    direccionEntrega: string;
    total: number;
    estado: EstadoPedido;
    metodoPago: MetodoPago;
    estadoEntrega: string | null;
    montoEfectivo: number | null;
    detalles: DetallePedido[];
}
