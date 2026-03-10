import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { DetallePedido } from './detalle-pedido.entity';

export enum EstadoPedido {
    RECIBIDO = 'RECIBIDO',
    PROCESANDO = 'PROCESANDO',
    ENVIADO = 'ENVIADO',
    ENTREGADO = 'ENTREGADO',
}

@Entity('pedidos')
export class Pedido {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'usuario_id' })
    usuarioId: number;

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'usuario_id' })
    usuario: Usuario;

    @CreateDateColumn()
    fechaPedido: Date;

    @Column({ nullable: true })
    direccionEntrega: string;

    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @Column({
        type: 'enum',
        enum: EstadoPedido,
        default: EstadoPedido.RECIBIDO,
    })
    estado: EstadoPedido;

    @OneToMany(() => DetallePedido, (detalle) => detalle.pedido, { cascade: true })
    detalles: DetallePedido[];
}
