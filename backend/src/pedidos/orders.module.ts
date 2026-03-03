import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './pedido.entity';
import { DetallePedido } from './detalle-pedido.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Producto } from '../productos/producto.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Pedido, DetallePedido, Producto])],
    controllers: [OrdersController],
    providers: [OrdersService],
})
export class OrdersModule { }
