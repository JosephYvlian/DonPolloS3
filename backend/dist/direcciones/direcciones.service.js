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
exports.DireccionesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const direccion_entity_1 = require("./direccion.entity");
let DireccionesService = class DireccionesService {
    direccionRepository;
    constructor(direccionRepository) {
        this.direccionRepository = direccionRepository;
    }
    async create(usuarioId, data) {
        if (data.esPorDefecto) {
            await this.direccionRepository.update({ usuarioId }, { esPorDefecto: false });
        }
        const nuevaDireccion = this.direccionRepository.create({ ...data, usuarioId });
        const saved = await this.direccionRepository.save(nuevaDireccion);
        return Array.isArray(saved) ? saved[0] : saved;
    }
    async findAllByUsuario(usuarioId) {
        return this.direccionRepository.find({ where: { usuarioId } });
    }
    async update(id, usuarioId, data) {
        const direccion = await this.direccionRepository.findOne({ where: { id, usuarioId } });
        if (!direccion) {
            throw new common_1.NotFoundException('Dirección no encontrada');
        }
        if (data.esPorDefecto) {
            await this.direccionRepository.update({ usuarioId }, { esPorDefecto: false });
        }
        Object.assign(direccion, data);
        return this.direccionRepository.save(direccion);
    }
    async delete(id, usuarioId) {
        const result = await this.direccionRepository.delete({ id, usuarioId });
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Dirección no encontrada');
        }
    }
};
exports.DireccionesService = DireccionesService;
exports.DireccionesService = DireccionesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(direccion_entity_1.Direccion)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DireccionesService);
//# sourceMappingURL=direcciones.service.js.map