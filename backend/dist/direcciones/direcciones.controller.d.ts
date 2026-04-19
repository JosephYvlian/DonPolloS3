import { DireccionesService } from './direcciones.service';
export declare class DireccionesController {
    private readonly direccionesService;
    constructor(direccionesService: DireccionesService);
    create(req: any, body: any): Promise<import("./direccion.entity").Direccion>;
    findAll(req: any): Promise<import("./direccion.entity").Direccion[]>;
    update(req: any, id: string, body: any): Promise<import("./direccion.entity").Direccion>;
    delete(req: any, id: string): Promise<void>;
}
