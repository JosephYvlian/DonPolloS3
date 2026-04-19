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
exports.DetallePedido = void 0;
const typeorm_1 = require("typeorm");
const pedido_entity_1 = require("./pedido.entity");
const producto_entity_1 = require("../productos/producto.entity");
let DetallePedido = class DetallePedido {
    id;
    pedidoId;
    pedido;
    productoId;
    producto;
    cantidad;
    precioUnitario;
};
exports.DetallePedido = DetallePedido;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DetallePedido.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pedido_id' }),
    __metadata("design:type", Number)
], DetallePedido.prototype, "pedidoId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pedido_entity_1.Pedido, (pedido) => pedido.detalles, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'pedido_id' }),
    __metadata("design:type", pedido_entity_1.Pedido)
], DetallePedido.prototype, "pedido", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'producto_id' }),
    __metadata("design:type", Number)
], DetallePedido.prototype, "productoId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => producto_entity_1.Producto),
    (0, typeorm_1.JoinColumn)({ name: 'producto_id' }),
    __metadata("design:type", producto_entity_1.Producto)
], DetallePedido.prototype, "producto", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], DetallePedido.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], DetallePedido.prototype, "precioUnitario", void 0);
exports.DetallePedido = DetallePedido = __decorate([
    (0, typeorm_1.Entity)('detalle_pedidos')
], DetallePedido);
//# sourceMappingURL=detalle-pedido.entity.js.map