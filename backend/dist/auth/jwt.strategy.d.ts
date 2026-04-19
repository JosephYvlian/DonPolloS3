import { Strategy } from 'passport-jwt';
import { Usuario } from '../usuarios/usuario.entity';
import { Repository } from 'typeorm';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly usuarioRepository;
    constructor(usuarioRepository: Repository<Usuario>);
    validate(payload: any): Promise<{
        id: any;
        correo: any;
        rol: any;
    }>;
}
export {};
