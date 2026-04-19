import { Pedido } from './pedido.entity';
import { Producto } from '../productos/producto.entity';
export declare class DetallePedido {
    id: number;
    pedidoId: number;
    pedido: Pedido;
    productoId: number;
    producto: Producto;
    cantidad: number;
    precioUnitario: number;
}
