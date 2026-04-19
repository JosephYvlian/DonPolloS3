import { Usuario } from '../usuarios/usuario.entity';
export declare class Tarjeta {
    id: number;
    usuarioId: number;
    usuario: Usuario;
    numeroTarjeta: string;
    fechaExpiracion: string;
    cvv: string;
    nombreTitular: string;
    esPorDefecto: boolean;
}
