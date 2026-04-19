import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarjeta } from './tarjeta.entity';

@Injectable()
export class TarjetasService {
    constructor(
        @InjectRepository(Tarjeta)
        private tarjetasRepository: Repository<Tarjeta>,
    ) { }

    async findAllByUsuario(usuarioId: number): Promise<Tarjeta[]> {
        return this.tarjetasRepository.find({ where: { usuarioId } });
    }

    async create(usuarioId: number, data: Partial<Tarjeta>): Promise<Tarjeta> {
        const existing = await this.findAllByUsuario(usuarioId);
        
        const isDefecto = data.esPorDefecto || existing.length === 0;

        const tarjeta = this.tarjetasRepository.create({
            usuarioId,
            ...data,
            esPorDefecto: isDefecto,
        });

        if (isDefecto && existing.length > 0) {
            await this.tarjetasRepository.update({ usuarioId }, { esPorDefecto: false });
        }

        return this.tarjetasRepository.save(tarjeta);
    }

    async remove(usuarioId: number, id: number): Promise<void> {
        const result = await this.tarjetasRepository.delete({ id, usuarioId });
        if (result.affected === 0) {
            throw new NotFoundException('Tarjeta no encontrada');
        }
    }
}
