import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
export declare class UsuariosService {
    private readonly usuarioRepository;
    constructor(usuarioRepository: Repository<Usuario>);
    getProfile(usuarioId: number): Promise<Partial<Usuario>>;
    updateProfile(usuarioId: number, data: {
        nombreCompleto?: string;
        telefono?: string;
    }): Promise<Partial<Usuario>>;
}
