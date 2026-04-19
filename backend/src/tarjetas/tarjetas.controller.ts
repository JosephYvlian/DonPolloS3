import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { TarjetasService } from './tarjetas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tarjetas')
@UseGuards(JwtAuthGuard)
export class TarjetasController {
    constructor(private readonly tarjetasService: TarjetasService) { }

    @Get()
    getTarjetas(@Request() req: any) {
        return this.tarjetasService.findAllByUsuario(req.user.id);
    }

    @Post()
    createTarjeta(@Request() req: any, @Body() data: any) {
        return this.tarjetasService.create(req.user.id, data);
    }

    @Delete(':id')
    deleteTarjeta(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
        return this.tarjetasService.remove(req.user.id, id);
    }
}
