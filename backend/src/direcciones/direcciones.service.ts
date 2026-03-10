import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Direccion } from './direccion.entity';

@Injectable()
export class DireccionesService {
  constructor(
    @InjectRepository(Direccion)
    private readonly direccionRepository: Repository<Direccion>,
  ) {}

  async create(usuarioId: number, data: any): Promise<Direccion> {
    if (data.esPorDefecto) {
      await this.direccionRepository.update({ usuarioId }, { esPorDefecto: false });
    }
    const nuevaDireccion = this.direccionRepository.create({ ...data, usuarioId });
    const saved = await this.direccionRepository.save(nuevaDireccion);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async findAllByUsuario(usuarioId: number): Promise<Direccion[]> {
    return this.direccionRepository.find({ where: { usuarioId } });
  }

  async update(id: number, usuarioId: number, data: any): Promise<Direccion> {
    const direccion = await this.direccionRepository.findOne({ where: { id, usuarioId } });
    if (!direccion) {
      throw new NotFoundException('Dirección no encontrada');
    }
    if (data.esPorDefecto) {
      await this.direccionRepository.update({ usuarioId }, { esPorDefecto: false });
    }
    Object.assign(direccion, data);
    return this.direccionRepository.save(direccion);
  }

  async delete(id: number, usuarioId: number): Promise<void> {
    const result = await this.direccionRepository.delete({ id, usuarioId });
    if (result.affected === 0) {
      throw new NotFoundException('Dirección no encontrada');
    }
  }
}
