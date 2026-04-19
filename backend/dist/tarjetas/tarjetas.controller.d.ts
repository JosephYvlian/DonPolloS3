import { TarjetasService } from './tarjetas.service';
export declare class TarjetasController {
    private readonly tarjetasService;
    constructor(tarjetasService: TarjetasService);
    getTarjetas(req: any): Promise<import("./tarjeta.entity").Tarjeta[]>;
    createTarjeta(req: any, data: any): Promise<import("./tarjeta.entity").Tarjeta>;
    deleteTarjeta(req: any, id: number): Promise<void>;
}
