import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Pedido } from './pedido.entity';
import { Producto } from '../productos/producto.entity';

@Entity('detalle_pedidos')
export class DetallePedido {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'pedido_id' })
    pedidoId: number;

    @ManyToOne(() => Pedido, (pedido) => pedido.detalles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'pedido_id' })
    pedido: Pedido;

    @Column({ name: 'producto_id' })
    productoId: number;

    @ManyToOne(() => Producto)
    @JoinColumn({ name: 'producto_id' })
    producto: Producto;

    @Column('int')
    cantidad: number;

    @Column('decimal', { precision: 10, scale: 2 })
    precioUnitario: number;
}
