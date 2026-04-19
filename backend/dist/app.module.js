"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const usuario_entity_1 = require("./usuarios/usuario.entity");
const producto_entity_1 = require("./productos/producto.entity");
const pedido_entity_1 = require("./pedidos/pedido.entity");
const detalle_pedido_entity_1 = require("./pedidos/detalle-pedido.entity");
const auth_module_1 = require("./auth/auth.module");
const products_module_1 = require("./productos/products.module");
const orders_module_1 = require("./pedidos/orders.module");
const direccion_entity_1 = require("./direcciones/direccion.entity");
const direcciones_module_1 = require("./direcciones/direcciones.module");
const mailer_module_1 = require("./mailer/mailer.module");
const usuarios_module_1 = require("./usuarios/usuarios.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: 5432,
                username: process.env.DB_USER || 'donpollo_user',
                password: process.env.DB_PASSWORD || 'donpollo_password',
                database: process.env.DB_NAME || 'donpollo_db',
                entities: [usuario_entity_1.Usuario, producto_entity_1.Producto, pedido_entity_1.Pedido, detalle_pedido_entity_1.DetallePedido, direccion_entity_1.Direccion],
                synchronize: true,
            }),
            auth_module_1.AuthModule,
            products_module_1.ProductsModule,
            orders_module_1.OrdersModule,
            direcciones_module_1.DireccionesModule,
            mailer_module_1.MailerModule,
            usuarios_module_1.UsuariosModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map