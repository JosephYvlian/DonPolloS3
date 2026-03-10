import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() body: any) {
        if (!body.correo || !body.passwordHash || !body.nombreCompleto || !body.telefono) {
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

    @Post('forgot-password')
    async forgotPassword(@Body() body: any) {
        if (!body.correo) {
            throw new BadRequestException('El correo es requerido');
        }
        return this.authService.requestPasswordReset(body.correo);
    }

    @Post('reset-password')
    async resetPassword(@Body() body: any) {
        if (!body.token || !body.newPassword) {
            throw new BadRequestException('El token y la nueva contraseña son requeridos');
        }
        return this.authService.resetPassword(body.token, body.newPassword);
    }
}
