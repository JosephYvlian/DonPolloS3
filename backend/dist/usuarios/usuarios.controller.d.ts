import { UsuariosService } from './usuarios.service';
export declare class UsuariosController {
    private readonly usuariosService;
    constructor(usuariosService: UsuariosService);
    getProfile(req: any): Promise<Partial<import("./usuario.entity").Usuario>>;
    updateProfile(req: any, body: {
        nombreCompleto?: string;
        telefono?: string;
    }): Promise<Partial<import("./usuario.entity").Usuario>>;
}
