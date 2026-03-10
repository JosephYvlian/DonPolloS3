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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const producto_entity_1 = require("./producto.entity");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
let ProductsService = class ProductsService {
    productoRepository;
    cloudinaryService;
    constructor(productoRepository, cloudinaryService) {
        this.productoRepository = productoRepository;
        this.cloudinaryService = cloudinaryService;
    }
    async findAllActivos() {
        return this.productoRepository.find({
            where: { estado: producto_entity_1.EstadoProducto.ACTIVO },
        });
    }
    async create(productoData, file) {
        let imagenUrl = productoData.imagenUrl;
        if (file) {
            try {
                const uploadResult = await this.cloudinaryService.uploadImage(file);
                imagenUrl = uploadResult.secure_url;
            }
            catch (error) {
                console.error('Cloudinary Create Error:', error);
                throw new common_1.BadRequestException('Error uploading image to Cloudinary');
            }
        }
        const newProducto = this.productoRepository.create({
            ...productoData,
            imagenUrl,
        });
        return this.productoRepository.save(newProducto);
    }
    async update(id, productoData, file) {
        const producto = await this.productoRepository.findOne({ where: { id } });
        if (!producto) {
            throw new common_1.NotFoundException(`Producto with ID ${id} not found`);
        }
        let imagenUrl = productoData.imagenUrl || producto.imagenUrl;
        if (file) {
            try {
                const uploadResult = await this.cloudinaryService.uploadImage(file);
                imagenUrl = uploadResult.secure_url;
            }
            catch (error) {
                console.error('Cloudinary Update Error:', error);
                throw new common_1.BadRequestException('Error uploading image to Cloudinary');
            }
        }
        await this.productoRepository.update(id, {
            ...productoData,
            imagenUrl,
        });
        const updatedProducto = await this.productoRepository.findOne({ where: { id } });
        if (!updatedProducto) {
            throw new common_1.NotFoundException(`Producto with ID ${id} not found after update`);
        }
        return updatedProducto;
    }
    async delete(id) {
        const producto = await this.productoRepository.findOne({ where: { id } });
        if (!producto) {
            throw new common_1.NotFoundException(`Producto with ID ${id} not found`);
        }
        await this.productoRepository.update(id, { estado: producto_entity_1.EstadoProducto.INACTIVO });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(producto_entity_1.Producto)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        cloudinary_service_1.CloudinaryService])
], ProductsService);
//# sourceMappingURL=products.service.js.map