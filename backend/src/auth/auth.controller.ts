import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() body: any) {
        if (!body.correo || !body.passwordHash || !body.nombreCompleto) {
            throw new BadRequestException('Faltan campos obligatorios');
        }
        return this.authService.register(body);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: any) {
        if (!body.correo || !body.password) {
            throw new BadRequestException('Correo y contraseña requeridos');
        }
        const user = await this.authService.validateUser(body.correo, body.password);
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        return this.authService.login(user);
    }
}
