import { Usuario } from '../usuarios/usuario.entity';
import { DetallePedido } from './detalle-pedido.entity';
export declare enum EstadoPedido {
    RECIBIDO = "RECIBIDO",
    PROCESANDO = "PROCESANDO",
    ENVIADO = "ENVIADO",
    ENTREGADO = "ENTREGADO"
}
export declare class Pedido {
    id: number;
    usuarioId: number;
    usuario: Usuario;
    fechaPedido: Date;
    direccionEntrega: string;
    total: number;
    estado: EstadoPedido;
    detalles: DetallePedido[];
}
