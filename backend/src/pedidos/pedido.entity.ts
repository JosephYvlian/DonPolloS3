import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { DetallePedido } from './detalle-pedido.entity';

export enum EstadoPedido {
    // Estados de Facturación / Pago
    PAGO_PENDIENTE = 'Pago Pendiente',
    PAGO_RECHAZADO = 'Pago Rechazado',
    PAGO_EXITOSO = 'Pago Exitoso',
    // Estados de Entrega / Logística
    PEDIDO_RECIBIDO = 'Pedido Recibido',
    EN_PREPARACION = 'En Preparación',
    PEDIDO_EN_CAMINO = 'Pedido en Camino',
    PEDIDO_ENTREGADO = 'Pedido Entregado',
    // Legados (mantener para compatibilidad con registros existentes)
    EN_CAMINO = 'En camino',
    ENTREGADO = 'Entregado',
}

export enum MetodoPago {
    TARJETA = 'TARJETA',
    PSE = 'PSE',
    EFECTIVO = 'EFECTIVO',
    MERCADOPAGO = 'MERCADOPAGO',
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
        default: EstadoPedido.PAGO_PENDIENTE,
    })
    estado: EstadoPedido;

    @Column({
        type: 'enum',
        enum: MetodoPago,
        default: MetodoPago.EFECTIVO,
    })
    metodoPago: MetodoPago;

    @Column({ type: 'varchar', nullable: true, default: null })
    estadoEntrega: string | null;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    montoEfectivo: number | null;

    @OneToMany(() => DetallePedido, (detalle) => detalle.pedido, { cascade: true })
    detalles: DetallePedido[];
}
