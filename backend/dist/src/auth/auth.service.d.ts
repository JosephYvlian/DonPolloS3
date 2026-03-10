import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '../mailer/mailer.service';
export declare class AuthService {
    private readonly usuarioRepository;
    private readonly jwtService;
    private readonly mailerService;
    constructor(usuarioRepository: Repository<Usuario>, jwtService: JwtService, mailerService: MailerService);
    register(data: any): Promise<any>;
    validateUser(correo: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: any;
    }>;
    requestPasswordReset(correo: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}
