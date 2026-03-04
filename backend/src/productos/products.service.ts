import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto, EstadoProducto } from './producto.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Producto)
        private readonly productoRepository: Repository<Producto>,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    async findAllActivos(): Promise<Producto[]> {
        return this.productoRepository.find({
            where: { estado: EstadoProducto.ACTIVO },
        });
    }

    async create(
        productoData: Partial<Producto>,
        file?: Express.Multer.File,
    ): Promise<Producto> {
        let imagenUrl = productoData.imagenUrl;

        if (file) {
            try {
                const uploadResult = await this.cloudinaryService.uploadImage(file);
                imagenUrl = uploadResult.secure_url;
            } catch (error: any) {
                console.error('Cloudinary Create Error:', error);
                throw new BadRequestException('Error uploading image to Cloudinary');
            }
        }

        const newProducto = this.productoRepository.create({
            ...productoData,
            imagenUrl,
        });

        return this.productoRepository.save(newProducto);
    }

    async update(
        id: number,
        productoData: Partial<Producto>,
        file?: Express.Multer.File,
    ): Promise<Producto> {
        const producto = await this.productoRepository.findOne({ where: { id } });
        if (!producto) {
            throw new NotFoundException(`Producto with ID ${id} not found`);
        }

        let imagenUrl = productoData.imagenUrl || producto.imagenUrl;

        if (file) {
            try {
                const uploadResult = await this.cloudinaryService.uploadImage(file);
                imagenUrl = uploadResult.secure_url;
            } catch (error: any) {
                console.error('Cloudinary Update Error:', error);
                throw new BadRequestException('Error uploading image to Cloudinary');
            }
        }

        await this.productoRepository.update(id, {
            ...productoData,
            imagenUrl,
        });

        const updatedProducto = await this.productoRepository.findOne({ where: { id } });
        if (!updatedProducto) {
            throw new NotFoundException(`Producto with ID ${id} not found after update`);
        }
        return updatedProducto;
    }
}
