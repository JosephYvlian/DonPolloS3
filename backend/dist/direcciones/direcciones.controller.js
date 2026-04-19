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
exports.DireccionesController = void 0;
const common_1 = require("@nestjs/common");
const direcciones_service_1 = require("./direcciones.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let DireccionesController = class DireccionesController {
    direccionesService;
    constructor(direccionesService) {
        this.direccionesService = direccionesService;
    }
    async create(req, body) {
        try {
            return await this.direccionesService.create(req.user.id, body);
        }
        catch (e) {
            console.error('DIRECCIONES_CREATE_ERROR:', e);
            throw e;
        }
    }
    async findAll(req) {
        return this.direccionesService.findAllByUsuario(req.user.id);
    }
    async update(req, id, body) {
        return this.direccionesService.update(+id, req.user.id, body);
    }
    async delete(req, id) {
        return this.direccionesService.delete(+id, req.user.id);
    }
};
exports.DireccionesController = DireccionesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DireccionesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DireccionesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], DireccionesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DireccionesController.prototype, "delete", null);
exports.DireccionesController = DireccionesController = __decorate([
    (0, common_1.Controller)('direcciones'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [direcciones_service_1.DireccionesService])
], DireccionesController);
//# sourceMappingURL=direcciones.controller.js.map