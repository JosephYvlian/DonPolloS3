import { Injectable, BadRequestException } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';
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
            const itemsMp = [];

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

                itemsMp.push({
                    id: producto.id.toString(),
                    title: producto.nombre,
                    quantity: item.cantidad,
                    unit_price: Number(producto.precio),
                });
            }

            const nuevoPedido = new Pedido();
            nuevoPedido.usuarioId = usuarioId;
            nuevoPedido.total = totalPedido;
            nuevoPedido.direccionEntrega = direccionEntrega;
            
            // Set payment fields and calculate status
            nuevoPedido.metodoPago = metodoPago || MetodoPago.EFECTIVO;
            
            if (nuevoPedido.metodoPago === MetodoPago.EFECTIVO) {
                nuevoPedido.montoEfectivo = montoEfectivo || null;
                nuevoPedido.estado = EstadoPedido.PAGO_PENDIENTE;
            } else if (nuevoPedido.metodoPago === MetodoPago.TARJETA || nuevoPedido.metodoPago === MetodoPago.PSE || nuevoPedido.metodoPago === MetodoPago.MERCADOPAGO) {
                nuevoPedido.estado = EstadoPedido.PAGO_PENDIENTE;
            } else {
                nuevoPedido.estado = EstadoPedido.PAGO_PENDIENTE;
            }

            const savedPedido = await queryRunner.manager.save(nuevoPedido);

            for (const detalle of detallesToSave) {
                detalle.pedidoId = savedPedido.id;
                await queryRunner.manager.save(detalle);
            }

            await queryRunner.commitTransaction();

            if (metodoPago === MetodoPago.MERCADOPAGO) {
                try {
                    const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '' });
                    const preference = new Preference(client);

                    const response = await preference.create({
                        body: {
                            items: itemsMp,
                            back_urls: {
                                success: 'http://localhost:5173/orders?status=success',
                                failure: 'http://localhost:5173/orders?status=failure',
                                pending: 'http://localhost:5173/orders?status=pending'
                            },
                            external_reference: savedPedido.id.toString(),
                        }
                    });

                    return { 
                        message: 'Pedido creado, redirigiendo a Mercado Pago', 
                        pedidoId: savedPedido.id,
                        init_point: response.sandbox_init_point 
                    };
                } catch (mpError) {
                    console.error('Error al crear preferencia de Mercado Pago:', mpError);
                    throw new BadRequestException('Error al inicializar la pasarela de pagos');
                }
            }

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

    async findAllPedidosAdmin() {
        return this.pedidoRepository.find({
            relations: ['usuario', 'detalles', 'detalles.producto'],
            order: { fechaPedido: 'DESC' },
        });
    }

    async updatePedidoStatus(id: number, estado: EstadoPedido) {
        const pedido = await this.pedidoRepository.findOne({ where: { id } });
        if (!pedido) {
            throw new BadRequestException('Pedido no encontrado');
        }
        pedido.estado = estado;
        // Al confirmar pago exitoso, iniciar automáticamente el flujo de entrega
        if (estado === EstadoPedido.PAGO_EXITOSO && !pedido.estadoEntrega) {
            pedido.estadoEntrega = 'Pedido Recibido';
        }
        return this.pedidoRepository.save(pedido);
    }

    async updatePedidoEntregaStatus(id: number, estadoEntrega: string) {
        const pedido = await this.pedidoRepository.findOne({ where: { id } });
        if (!pedido) {
            throw new BadRequestException('Pedido no encontrado');
        }
        pedido.estadoEntrega = estadoEntrega;
        return this.pedidoRepository.save(pedido);
    }
}
