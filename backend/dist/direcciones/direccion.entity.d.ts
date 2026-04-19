import { Usuario } from '../usuarios/usuario.entity';
export declare class Direccion {
    id: number;
    usuarioId: number;
    usuario: Usuario;
    direccion: string;
    detalles: string;
    ciudad: string;
    esPorDefecto: boolean;
}
