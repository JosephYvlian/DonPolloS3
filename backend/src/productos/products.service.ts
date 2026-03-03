import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto, EstadoProducto } from './producto.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Producto)
        private readonly productoRepository: Repository<Producto>,
    ) { }

    async findAllActivos(): Promise<Producto[]> {
        return this.productoRepository.find({
            where: { estado: EstadoProducto.ACTIVO },
        });
    }
}
