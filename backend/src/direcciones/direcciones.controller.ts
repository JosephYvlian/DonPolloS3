import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { DireccionesService } from './direcciones.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('direcciones')
@UseGuards(JwtAuthGuard)
export class DireccionesController {
  constructor(private readonly direccionesService: DireccionesService) {}

  @Post()
  async create(@Request() req: any, @Body() body: any) {
    try {
      return await this.direccionesService.create(req.user.id, body);
    } catch (e) {
      console.error('DIRECCIONES_CREATE_ERROR:', e);
      throw e;
    }
  }

  @Get()
  async findAll(@Request() req: any) {
    return this.direccionesService.findAllByUsuario(req.user.id);
  }

  @Put(':id')
  async update(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    return this.direccionesService.update(+id, req.user.id, body);
  }

  @Delete(':id')
  async delete(@Request() req: any, @Param('id') id: string) {
    return this.direccionesService.delete(+id, req.user.id);
  }
}
