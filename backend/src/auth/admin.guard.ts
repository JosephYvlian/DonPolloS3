import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RolUsuario } from '../usuarios/usuario.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    if (user.rol !== RolUsuario.ADMINISTRADOR) {
      throw new ForbiddenException('No tienes permisos de administrador para realizar esta acción');
    }

    return true;
  }
}
