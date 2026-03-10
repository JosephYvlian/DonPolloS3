import { Repository, DataSource } from 'typeorm';
import { Pedido } from './pedido.entity';
export declare class OrdersService {
    private readonly pedidoRepository;
    private dataSource;
    constructor(pedidoRepository: Repository<Pedido>, dataSource: DataSource);
    createPedidoTransaction(usuarioId: number, items: {
        productoId: number;
        cantidad: number;
    }[], direccionEntrega: string): Promise<{
        message: string;
        pedidoId: number;
    }>;
    findPedidosByUsuario(usuarioId: number): Promise<Pedido[]>;
}
