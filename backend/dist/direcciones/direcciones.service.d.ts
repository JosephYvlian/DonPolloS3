import { Repository } from 'typeorm';
import { Direccion } from './direccion.entity';
export declare class DireccionesService {
    private readonly direccionRepository;
    constructor(direccionRepository: Repository<Direccion>);
    create(usuarioId: number, data: any): Promise<Direccion>;
    findAllByUsuario(usuarioId: number): Promise<Direccion[]>;
    update(id: number, usuarioId: number, data: any): Promise<Direccion>;
    delete(id: number, usuarioId: number): Promise<void>;
}
