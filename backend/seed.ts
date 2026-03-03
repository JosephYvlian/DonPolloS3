import { Connection, createConnection } from 'typeorm';
import { Producto, EstadoProducto } from './src/productos/producto.entity';
import { Usuario, RolUsuario } from './src/usuarios/usuario.entity';
import { Pedido } from './src/pedidos/pedido.entity';
import { DetallePedido } from './src/pedidos/detalle-pedido.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
    const connection = await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'donpollo_user',
        password: 'donpollo_password',
        database: 'donpollo_db',
        entities: [Usuario, Producto, Pedido, DetallePedido],
    });

    const repProd = connection.getRepository(Producto);

    // Seed sample products
    const count = await repProd.count();
    if (count === 0) {
        console.log('Seeding products...');
        await repProd.save([
            {
                nombre: 'Pollo Entero Premium',
                descripcion: 'Pollo entero fresco, criado sin antibióticos. Peso aprox: 2.5kg.',
                precio: 15.99,
                stockDisponible: 50,
                estado: EstadoProducto.ACTIVO,
                imagenUrl: 'https://images.unsplash.com/photo-1590772718105-0988cc652a92?auto=format&fit=crop&q=80&w=600&h=400'
            },
            {
                nombre: 'Pechugas Fileteadas (1kg)',
                descripcion: 'Pechugas de pollo tiernas y sin hueso, ideales para la plancha.',
                precio: 8.50,
                stockDisponible: 100,
                estado: EstadoProducto.ACTIVO,
                imagenUrl: 'https://images.unsplash.com/photo-1604544079836-eebbf95610bc?auto=format&fit=crop&q=80&w=600&h=400'
            },
            {
                nombre: 'Alitas Picantes (Pack 12 uds)',
                descripcion: 'Alitas marinadas con salsa buffalo secreta. Listas para hornear.',
                precio: 6.99,
                stockDisponible: 30,
                estado: EstadoProducto.ACTIVO,
                imagenUrl: 'https://images.unsplash.com/photo-1524114664604-cd8133cd67ad?auto=format&fit=crop&q=80&w=600&h=400'
            },
            {
                nombre: 'Muslos de Pollo (2kg)',
                descripcion: 'Muslos carnosos y jugosos perfectos para guisos y parrillas.',
                precio: 12.00,
                stockDisponible: 45,
                estado: EstadoProducto.ACTIVO,
                imagenUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=600&h=400'
            }
        ]);
        console.log('Products seeded successfully.');
    } else {
        console.log('Products already seeded.');
    }

    await connection.close();
}

seed().catch(err => console.error(err));
