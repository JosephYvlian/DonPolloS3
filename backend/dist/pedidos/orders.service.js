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
    async createPedidoTransaction(usuarioId, items, direccionEntrega) {
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
            }
            const nuevoPedido = new pedido_entity_1.Pedido();
            nuevoPedido.usuarioId = usuarioId;
            nuevoPedido.estado = pedido_entity_1.EstadoPedido.RECIBIDO;
            nuevoPedido.total = totalPedido;
            nuevoPedido.direccionEntrega = direccionEntrega;
            const savedPedido = await queryRunner.manager.save(nuevoPedido);
            for (const detalle of detallesToSave) {
                detalle.pedidoId = savedPedido.id;
                await queryRunner.manager.save(detalle);
            }
            await queryRunner.commitTransaction();
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pedido_entity_1.Pedido)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], OrdersService);
//# sourceMappingURL=orders.service.js.map