import { Controller, Post, Get, Put, Param, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { OrdersService } from './orders.service';

@Controller('pedidos')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createPedido(@Body() body: any, @Request() req: any) {
        // payload expect: { items: [{ productoId: 1, cantidad: 2 }], direccionEntrega: '...', metodoPago: '...', montoEfectivo: 100 }
        return this.ordersService.createPedidoTransaction(req.user.id, body.items, body.direccionEntrega, body.metodoPago, body.montoEfectivo);
    }

    @Get('mis-pedidos')
    @UseGuards(JwtAuthGuard)
    async getMisPedidos(@Request() req: any) {
        return this.ordersService.findPedidosByUsuario(req.user.id);
    }

    @Get('all')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async getAllPedidos() {
        return this.ordersService.findAllPedidosAdmin();
    }

    @Put(':id/estado')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async updatePedidoStatus(@Param('id') id: string, @Body('estado') estado: string) {
        return this.ordersService.updatePedidoStatus(+id, estado as any);
    }

    @Put(':id/estado-entrega')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async updatePedidoEntregaStatus(@Param('id') id: string, @Body('estadoEntrega') estadoEntrega: string) {
        return this.ordersService.updatePedidoEntregaStatus(+id, estadoEntrega);
    }

    @Post('webhook')
    async handleWebhook(@Body() body: any) {
        return this.ordersService.handleWebhook(body);
    }
}
