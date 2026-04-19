import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAllActivos(): Promise<import("./producto.entity").Producto[]>;
    create(productoData: any, file?: Express.Multer.File): Promise<import("./producto.entity").Producto>;
    update(id: string, productoData: any, file?: Express.Multer.File): Promise<import("./producto.entity").Producto>;
    remove(id: string): Promise<void>;
}
