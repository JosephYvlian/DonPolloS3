import { Repository } from 'typeorm';
import { Tarjeta } from './tarjeta.entity';
export declare class TarjetasService {
    private tarjetasRepository;
    constructor(tarjetasRepository: Repository<Tarjeta>);
    findAllByUsuario(usuarioId: number): Promise<Tarjeta[]>;
    create(usuarioId: number, data: Partial<Tarjeta>): Promise<Tarjeta>;
    remove(usuarioId: number, id: number): Promise<void>;
}
