import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, RolUsuario } from '../usuarios/usuario.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
        private readonly jwtService: JwtService,
    ) { }

    async register(data: any): Promise<any> {
        const existing = await this.usuarioRepository.findOne({ where: { correo: data.correo } });
        if (existing) {
            throw new ConflictException('El correo ya está registrado');
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(data.passwordHash, salt);

        const newUser = this.usuarioRepository.create({
            ...data,
            passwordHash: hash,
            rol: RolUsuario.CLIENTE,
        });

        const saved = await this.usuarioRepository.save(newUser);
        const savedUser = Array.isArray(saved) ? saved[0] : saved;
        const { passwordHash, ...result } = savedUser;
        return result;
    }

    async validateUser(correo: string, pass: string): Promise<any> {
        const user = await this.usuarioRepository.findOne({ where: { correo } });
        if (user && await bcrypt.compare(pass, user.passwordHash)) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { correo: user.correo, sub: user.id, rol: user.rol };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }
}
