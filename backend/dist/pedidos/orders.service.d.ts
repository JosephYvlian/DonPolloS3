import { Repository, DataSource } from 'typeorm';
import { Pedido, EstadoPedido, MetodoPago } from './pedido.entity';
export declare class OrdersService {
    private readonly pedidoRepository;
    private dataSource;
    constructor(pedidoRepository: Repository<Pedido>, dataSource: DataSource);
    createPedidoTransaction(usuarioId: number, items: {
        productoId: number;
        cantidad: number;
    }[], direccionEntrega: string, metodoPago: MetodoPago, montoEfectivo?: number): Promise<{
        message: string;
        pedidoId: number;
        init_point: string | undefined;
    } | {
        message: string;
        pedidoId: number;
        init_point?: undefined;
    }>;
    findPedidosByUsuario(usuarioId: number): Promise<Pedido[]>;
    findAllPedidosAdmin(): Promise<Pedido[]>;
    updatePedidoStatus(id: number, estado: EstadoPedido): Promise<Pedido>;
    updatePedidoEntregaStatus(id: number, estadoEntrega: string): Promise<Pedido>;
    handleWebhook(body: any): Promise<{
        received: boolean;
    }>;
}
