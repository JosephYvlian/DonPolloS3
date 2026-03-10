import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async getProfile(usuarioId: number): Promise<Partial<Usuario>> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
      select: ['id', 'nombreCompleto', 'correo', 'telefono', 'direccion', 'rol'],
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return usuario;
  }

  async updateProfile(usuarioId: number, data: { nombreCompleto?: string; telefono?: string }): Promise<Partial<Usuario>> {
    const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
    
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (data.nombreCompleto) usuario.nombreCompleto = data.nombreCompleto;
    if (data.telefono) usuario.telefono = data.telefono;

    await this.usuarioRepository.save(usuario);

    const { passwordHash, resetPasswordToken, resetPasswordExpires, ...result } = usuario;
    return result;
  }
}
