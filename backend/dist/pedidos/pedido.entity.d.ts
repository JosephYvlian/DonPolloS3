import { Usuario } from '../usuarios/usuario.entity';
import { DetallePedido } from './detalle-pedido.entity';
export declare enum EstadoPedido {
    RECIBIDO = "RECIBIDO",
    PROCESANDO = "PROCESANDO",
    ENVIADO = "ENVIADO",
    ENTREGADO = "ENTREGADO",
    PAGADO = "PAGADO",
    PENDIENTE_PAGO_ENTREGA = "PENDIENTE_PAGO_ENTREGA",
    EN_VERIFICACION = "En Verificaci\u00F3n",
    PENDIENTE_POR_PAGO = "Pendiente por pago"
}
export declare enum MetodoPago {
    TARJETA = "TARJETA",
    PSE = "PSE",
    EFECTIVO = "EFECTIVO"
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
    montoEfectivo: number | null;
    detalles: DetallePedido[];
}
