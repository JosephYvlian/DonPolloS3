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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pedido = exports.MetodoPago = exports.EstadoPedido = void 0;
const typeorm_1 = require("typeorm");
const usuario_entity_1 = require("../usuarios/usuario.entity");
const detalle_pedido_entity_1 = require("./detalle-pedido.entity");
var EstadoPedido;
(function (EstadoPedido) {
    EstadoPedido["PAGO_PENDIENTE"] = "Pago Pendiente";
    EstadoPedido["PAGO_RECHAZADO"] = "Pago Rechazado";
    EstadoPedido["PAGO_EXITOSO"] = "Pago Exitoso";
    EstadoPedido["PEDIDO_RECIBIDO"] = "Pedido Recibido";
    EstadoPedido["EN_PREPARACION"] = "En Preparaci\u00F3n";
    EstadoPedido["PEDIDO_EN_CAMINO"] = "Pedido en Camino";
    EstadoPedido["PEDIDO_ENTREGADO"] = "Pedido Entregado";
    EstadoPedido["EN_CAMINO"] = "En camino";
    EstadoPedido["ENTREGADO"] = "Entregado";
})(EstadoPedido || (exports.EstadoPedido = EstadoPedido = {}));
var MetodoPago;
(function (MetodoPago) {
    MetodoPago["TARJETA"] = "TARJETA";
    MetodoPago["PSE"] = "PSE";
    MetodoPago["EFECTIVO"] = "EFECTIVO";
    MetodoPago["MERCADOPAGO"] = "MERCADOPAGO";
})(MetodoPago || (exports.MetodoPago = MetodoPago = {}));
let Pedido = class Pedido {
    id;
    usuarioId;
    usuario;
    fechaPedido;
    direccionEntrega;
    total;
    estado;
    metodoPago;
    estadoEntrega;
    montoEfectivo;
    detalles;
};
exports.Pedido = Pedido;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Pedido.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'usuario_id' }),
    __metadata("design:type", Number)
], Pedido.prototype, "usuarioId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario),
    (0, typeorm_1.JoinColumn)({ name: 'usuario_id' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], Pedido.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Pedido.prototype, "fechaPedido", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Pedido.prototype, "direccionEntrega", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Pedido.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EstadoPedido,
        default: EstadoPedido.PAGO_PENDIENTE,
    }),
    __metadata("design:type", String)
], Pedido.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MetodoPago,
        default: MetodoPago.EFECTIVO,
    }),
    __metadata("design:type", String)
], Pedido.prototype, "metodoPago", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, default: null }),
    __metadata("design:type", Object)
], Pedido.prototype, "estadoEntrega", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Pedido.prototype, "montoEfectivo", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => detalle_pedido_entity_1.DetallePedido, (detalle) => detalle.pedido, { cascade: true }),
    __metadata("design:type", Array)
], Pedido.prototype, "detalles", void 0);
exports.Pedido = Pedido = __decorate([
    (0, typeorm_1.Entity)('pedidos')
], Pedido);
//# sourceMappingURL=pedido.entity.js.map