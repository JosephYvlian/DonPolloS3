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
exports.TarjetasController = void 0;
const common_1 = require("@nestjs/common");
const tarjetas_service_1 = require("./tarjetas.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let TarjetasController = class TarjetasController {
    tarjetasService;
    constructor(tarjetasService) {
        this.tarjetasService = tarjetasService;
    }
    getTarjetas(req) {
        return this.tarjetasService.findAllByUsuario(req.user.id);
    }
    createTarjeta(req, data) {
        return this.tarjetasService.create(req.user.id, data);
    }
    deleteTarjeta(req, id) {
        return this.tarjetasService.remove(req.user.id, id);
    }
};
exports.TarjetasController = TarjetasController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TarjetasController.prototype, "getTarjetas", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TarjetasController.prototype, "createTarjeta", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], TarjetasController.prototype, "deleteTarjeta", null);
exports.TarjetasController = TarjetasController = __decorate([
    (0, common_1.Controller)('tarjetas'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [tarjetas_service_1.TarjetasService])
], TarjetasController);
//# sourceMappingURL=tarjetas.controller.js.map