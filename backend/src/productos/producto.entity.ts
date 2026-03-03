import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum EstadoProducto {
    ACTIVO = 'ACTIVO',
    INACTIVO = 'INACTIVO',
}

@Entity('productos')
export class Producto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column('text')
    descripcion: string;

    @Column('decimal', { precision: 10, scale: 2 })
    precio: number;

    @Column('int')
    stockDisponible: number;

    @Column({ nullable: true })
    imagenUrl: string;

    @Column({
        type: 'enum',
        enum: EstadoProducto,
        default: EstadoProducto.ACTIVO,
    })
    estado: EstadoProducto;
}
