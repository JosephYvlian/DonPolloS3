import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuarios/usuario.entity';
import { Producto } from './productos/producto.entity';
import { Pedido } from './pedidos/pedido.entity';
import { DetallePedido } from './pedidos/detalle-pedido.entity';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './productos/products.module';
import { OrdersModule } from './pedidos/orders.module';
import { Direccion } from './direcciones/direccion.entity';
import { DireccionesModule } from './direcciones/direcciones.module';
import { MailerModule } from './mailer/mailer.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: process.env.DB_USER || 'donpollo_user',
      password: process.env.DB_PASSWORD || 'donpollo_password',
      database: process.env.DB_NAME || 'donpollo_db',
      entities: [Usuario, Producto, Pedido, DetallePedido, Direccion],
      synchronize: true, // Auto-create tables in dev
    }),
    AuthModule,
    ProductsModule,
    OrdersModule,
    DireccionesModule,
    MailerModule,
    UsuariosModule,
  ],
})
export class AppModule { }
