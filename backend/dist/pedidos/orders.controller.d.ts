import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createPedido(body: any, req: any): Promise<{
        message: string;
        pedidoId: number;
    }>;
    getMisPedidos(req: any): Promise<import("./pedido.entity").Pedido[]>;
}
