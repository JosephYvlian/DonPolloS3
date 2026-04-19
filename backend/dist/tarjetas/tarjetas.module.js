"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TarjetasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const tarjeta_entity_1 = require("./tarjeta.entity");
const tarjetas_controller_1 = require("./tarjetas.controller");
const tarjetas_service_1 = require("./tarjetas.service");
let TarjetasModule = class TarjetasModule {
};
exports.TarjetasModule = TarjetasModule;
exports.TarjetasModule = TarjetasModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([tarjeta_entity_1.Tarjeta])],
        controllers: [tarjetas_controller_1.TarjetasController],
        providers: [tarjetas_service_1.TarjetasService],
        exports: [tarjetas_service_1.TarjetasService],
    })
], TarjetasModule);
//# sourceMappingURL=tarjetas.module.js.map