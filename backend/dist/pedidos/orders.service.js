"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mercadopago_1 = require("mercadopago");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pedido_entity_1 = require("./pedido.entity");
const detalle_pedido_entity_1 = require("./detalle-pedido.entity");
const producto_entity_1 = require("../productos/producto.entity");
let OrdersService = class OrdersService {
    pedidoRepository;
    dataSource;
    constructor(pedidoRepository, dataSource) {
        this.pedidoRepository = pedidoRepository;
        this.dataSource = dataSource;
    }
    async createPedidoTransaction(usuarioId, items, direccionEntrega, metodoPago, montoEfectivo) {
        if (!direccionEntrega) {
            throw new common_1.BadRequestException('La dirección de entrega es obligatoria');
        }
        if (!items || items.length === 0) {
            throw new common_1.BadRequestException('El pedido debe tener al menos un producto');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let totalPedido = 0;
            const detallesToSave = [];
            const itemsMp = [];
            for (const item of items) {
                const producto = await queryRunner.manager.findOne(producto_entity_1.Producto, {
                    where: { id: item.productoId },
                    lock: { mode: 'pessimistic_write' },
                });
                if (!producto || producto.estado !== producto_entity_1.EstadoProducto.ACTIVO) {
                    throw new common_1.BadRequestException(`Producto ${item.productoId} no está disponible o no existe`);
                }
                if (producto.stockDisponible < item.cantidad) {
                    throw new common_1.BadRequestException(`Stock insuficiente para el producto ${producto.nombre}`);
                }
                producto.stockDisponible -= item.cantidad;
                await queryRunner.manager.save(producto);
                totalPedido += producto.precio * item.cantidad;
                const detalle = new detalle_pedido_entity_1.DetallePedido();
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
            const nuevoPedido = new pedido_entity_1.Pedido();
            nuevoPedido.usuarioId = usuarioId;
            nuevoPedido.total = totalPedido;
            nuevoPedido.direccionEntrega = direccionEntrega;
            nuevoPedido.metodoPago = metodoPago || pedido_entity_1.MetodoPago.EFECTIVO;
            if (nuevoPedido.metodoPago === pedido_entity_1.MetodoPago.EFECTIVO) {
                nuevoPedido.montoEfectivo = montoEfectivo || null;
                nuevoPedido.estado = pedido_entity_1.EstadoPedido.PAGO_PENDIENTE;
            }
            else if (nuevoPedido.metodoPago === pedido_entity_1.MetodoPago.TARJETA || nuevoPedido.metodoPago === pedido_entity_1.MetodoPago.PSE || nuevoPedido.metodoPago === pedido_entity_1.MetodoPago.MERCADOPAGO) {
                nuevoPedido.estado = pedido_entity_1.EstadoPedido.PAGO_PENDIENTE;
            }
            else {
                nuevoPedido.estado = pedido_entity_1.EstadoPedido.PAGO_PENDIENTE;
            }
            const savedPedido = await queryRunner.manager.save(nuevoPedido);
            for (const detalle of detallesToSave) {
                detalle.pedidoId = savedPedido.id;
                await queryRunner.manager.save(detalle);
            }
            await queryRunner.commitTransaction();
            if (metodoPago === pedido_entity_1.MetodoPago.MERCADOPAGO) {
                try {
                    const client = new mercadopago_1.MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '' });
                    const preference = new mercadopago_1.Preference(client);
                    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
                    const backendUrl = process.env.VITE_API_URL || 'https://3.133.148.136.nip.io';
                    const response = await preference.create({
                        body: {
                            items: itemsMp,
                            back_urls: {
                                success: `${baseUrl}/orders?status=success`,
                                failure: `${baseUrl}/orders?status=failure`,
                                pending: `${baseUrl}/orders?status=pending`
                            },
                            auto_return: 'approved',
                            notification_url: `${backendUrl}/api/pedidos/webhook`,
                            external_reference: savedPedido.id.toString(),
                        }
                    });
                    return {
                        message: 'Pedido creado, redirigiendo a Mercado Pago',
                        pedidoId: savedPedido.id,
                        init_point: response.sandbox_init_point
                    };
                }
                catch (mpError) {
                    console.error('Error al crear preferencia de Mercado Pago:', mpError);
                    throw new common_1.BadRequestException('Error al inicializar la pasarela de pagos');
                }
            }
            return { message: 'Pedido creado exitosamente', pedidoId: savedPedido.id };
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findPedidosByUsuario(usuarioId) {
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
    async updatePedidoStatus(id, estado) {
        const pedido = await this.pedidoRepository.findOne({ where: { id } });
        if (!pedido) {
            throw new common_1.BadRequestException('Pedido no encontrado');
        }
        pedido.estado = estado;
        if (estado === pedido_entity_1.EstadoPedido.PAGO_EXITOSO && !pedido.estadoEntrega) {
            pedido.estadoEntrega = 'Pedido Recibido';
        }
        return this.pedidoRepository.save(pedido);
    }
    async updatePedidoEntregaStatus(id, estadoEntrega) {
        const pedido = await this.pedidoRepository.findOne({ where: { id } });
        if (!pedido) {
            throw new common_1.BadRequestException('Pedido no encontrado');
        }
        pedido.estadoEntrega = estadoEntrega;
        return this.pedidoRepository.save(pedido);
    }
    async handleWebhook(body) {
        if (body.type === 'payment' && body.data && body.data.id) {
            try {
                const client = new mercadopago_1.MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '' });
                const paymentClient = new mercadopago_1.Payment(client);
                const payment = await paymentClient.get({ id: body.data.id });
                const orderId = payment.external_reference;
                if (!orderId)
                    return { received: true };
                const pedido = await this.pedidoRepository.findOne({ where: { id: parseInt(orderId) } });
                if (!pedido)
                    return { received: true };
                if (payment.status === 'approved') {
                    pedido.estado = pedido_entity_1.EstadoPedido.PAGO_EXITOSO;
                    if (!pedido.estadoEntrega) {
                        pedido.estadoEntrega = 'Pedido Recibido';
                    }
                }
                else if (payment.status === 'rejected') {
                    pedido.estado = pedido_entity_1.EstadoPedido.PAGO_RECHAZADO;
                }
                await this.pedidoRepository.save(pedido);
            }
            catch (error) {
                console.error('Error procesando webhook de MP:', error);
            }
        }
        return { received: true };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pedido_entity_1.Pedido)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], OrdersService);
//# sourceMappingURL=orders.service.js.map