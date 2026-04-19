import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Pedido, EstadoPedido, MetodoPago } from './pedido.entity';
import { DetallePedido } from './detalle-pedido.entity';
import { Producto, EstadoProducto } from '../productos/producto.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Pedido)
        private readonly pedidoRepository: Repository<Pedido>,
        private dataSource: DataSource,
    ) { }

    async createPedidoTransaction(usuarioId: number, items: { productoId: number; cantidad: number }[], direccionEntrega: string, metodoPago: MetodoPago, montoEfectivo?: number) {
        if (!direccionEntrega) {
            throw new BadRequestException('La dirección de entrega es obligatoria');
        }

        if (!items || items.length === 0) {
            throw new BadRequestException('El pedido debe tener al menos un producto');
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            let totalPedido = 0;
            const detallesToSave = [];

            for (const item of items) {
                // Bloqueo pesimista para evitar race conditions
                const producto = await queryRunner.manager.findOne(Producto, {
                    where: { id: item.productoId },
                    lock: { mode: 'pessimistic_write' },
                });

                if (!producto || producto.estado !== EstadoProducto.ACTIVO) {
                    throw new BadRequestException(`Producto ${item.productoId} no está disponible o no existe`);
                }

                if (producto.stockDisponible < item.cantidad) {
                    throw new BadRequestException(`Stock insuficiente para el producto ${producto.nombre}`);
                }

                producto.stockDisponible -= item.cantidad;
                await queryRunner.manager.save(producto);

                totalPedido += producto.precio * item.cantidad;

                const detalle = new DetallePedido();
                detalle.productoId = producto.id;
                detalle.cantidad = item.cantidad;
                detalle.precioUnitario = producto.precio;
                detallesToSave.push(detalle);
            }

            const nuevoPedido = new Pedido();
            nuevoPedido.usuarioId = usuarioId;
            nuevoPedido.total = totalPedido;
            nuevoPedido.direccionEntrega = direccionEntrega;
            
            // Set payment fields and calculate status
            nuevoPedido.metodoPago = metodoPago || MetodoPago.EFECTIVO;
            
            if (nuevoPedido.metodoPago === MetodoPago.EFECTIVO) {
                nuevoPedido.montoEfectivo = montoEfectivo || null;
                nuevoPedido.estado = EstadoPedido.PENDIENTE_POR_PAGO;
            } else if (nuevoPedido.metodoPago === MetodoPago.TARJETA || nuevoPedido.metodoPago === MetodoPago.PSE) {
                nuevoPedido.estado = EstadoPedido.EN_VERIFICACION;
            } else {
                nuevoPedido.estado = EstadoPedido.RECIBIDO;
            }

            const savedPedido = await queryRunner.manager.save(nuevoPedido);

            for (const detalle of detallesToSave) {
                detalle.pedidoId = savedPedido.id;
                await queryRunner.manager.save(detalle);
            }

            await queryRunner.commitTransaction();
            return { message: 'Pedido creado exitosamente', pedidoId: savedPedido.id };
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async findPedidosByUsuario(usuarioId: number) {
        return this.pedidoRepository.find({
            where: { usuarioId },
            relations: ['detalles', 'detalles.producto'],
            order: { fechaPedido: 'DESC' },
        });
    }
}
