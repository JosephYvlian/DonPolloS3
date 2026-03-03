import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService } from './orders.service';

@Controller('pedidos')
@UseGuards(JwtAuthGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    async createPedido(@Body() body: any, @Request() req: any) {
        // payload expect: { items: [{ productoId: 1, cantidad: 2 }] }
        return this.ordersService.createPedidoTransaction(req.user.id, body.items);
    }

    @Get('mis-pedidos')
    async getMisPedidos(@Request() req: any) {
        return this.ordersService.findPedidosByUsuario(req.user.id);
    }
}
