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
exports.TarjetasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tarjeta_entity_1 = require("./tarjeta.entity");
let TarjetasService = class TarjetasService {
    tarjetasRepository;
    constructor(tarjetasRepository) {
        this.tarjetasRepository = tarjetasRepository;
    }
    async findAllByUsuario(usuarioId) {
        return this.tarjetasRepository.find({ where: { usuarioId } });
    }
    async create(usuarioId, data) {
        const existing = await this.findAllByUsuario(usuarioId);
        const isDefecto = data.esPorDefecto || existing.length === 0;
        const tarjeta = this.tarjetasRepository.create({
            usuarioId,
            ...data,
            esPorDefecto: isDefecto,
        });
        if (isDefecto && existing.length > 0) {
            await this.tarjetasRepository.update({ usuarioId }, { esPorDefecto: false });
        }
        return this.tarjetasRepository.save(tarjeta);
    }
    async remove(usuarioId, id) {
        const result = await this.tarjetasRepository.delete({ id, usuarioId });
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Tarjeta no encontrada');
        }
    }
};
exports.TarjetasService = TarjetasService;
exports.TarjetasService = TarjetasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tarjeta_entity_1.Tarjeta)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TarjetasService);
//# sourceMappingURL=tarjetas.service.js.map