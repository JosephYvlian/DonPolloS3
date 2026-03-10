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
exports.Direccion = void 0;
const typeorm_1 = require("typeorm");
const usuario_entity_1 = require("../usuarios/usuario.entity");
let Direccion = class Direccion {
    id;
    usuarioId;
    usuario;
    direccion;
    detalles;
    ciudad;
    esPorDefecto;
};
exports.Direccion = Direccion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Direccion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'usuario_id' }),
    __metadata("design:type", Number)
], Direccion.prototype, "usuarioId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario),
    (0, typeorm_1.JoinColumn)({ name: 'usuario_id' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], Direccion.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Direccion.prototype, "direccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Direccion.prototype, "detalles", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Direccion.prototype, "ciudad", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Direccion.prototype, "esPorDefecto", void 0);
exports.Direccion = Direccion = __decorate([
    (0, typeorm_1.Entity)('direcciones')
], Direccion);
//# sourceMappingURL=direccion.entity.js.map