import { Repository } from 'typeorm';
import { Producto } from './producto.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
export declare class ProductsService {
    private readonly productoRepository;
    private readonly cloudinaryService;
    constructor(productoRepository: Repository<Producto>, cloudinaryService: CloudinaryService);
    findAllActivos(): Promise<Producto[]>;
    create(productoData: Partial<Producto>, file?: Express.Multer.File): Promise<Producto>;
    update(id: number, productoData: Partial<Producto>, file?: Express.Multer.File): Promise<Producto>;
    delete(id: number): Promise<void>;
}
