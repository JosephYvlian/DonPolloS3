import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createPedido(body: any, req: any): Promise<{
        message: string;
        pedidoId: number;
        init_point: string | undefined;
    } | {
        message: string;
        pedidoId: number;
        init_point?: undefined;
    }>;
    getMisPedidos(req: any): Promise<import("./pedido.entity").Pedido[]>;
    getAllPedidos(): Promise<import("./pedido.entity").Pedido[]>;
    updatePedidoStatus(id: string, estado: string): Promise<import("./pedido.entity").Pedido>;
    updatePedidoEntregaStatus(id: string, estadoEntrega: string): Promise<import("./pedido.entity").Pedido>;
    handleWebhook(body: any, req: any): Promise<{
        received: boolean;
    }>;
}
