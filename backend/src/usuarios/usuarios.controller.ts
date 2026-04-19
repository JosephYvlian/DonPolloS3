import { Controller, Get, Put, Body, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('usuarios')
@UseGuards(JwtAuthGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get('profile')
  async getProfile(@Request() req: any) {
    return this.usuariosService.getProfile(req.user.id);
  }

  @Put('profile')
  async updateProfile(@Request() req: any, @Body() body: { nombreCompleto?: string; telefono?: string }) {
    if (body.telefono && !/^\d+$/.test(body.telefono)) {
      throw new BadRequestException('El teléfono solo debe contener números');
    }
    return this.usuariosService.updateProfile(req.user.id, body);
  }
}
