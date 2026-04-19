import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';

@Entity('tarjetas')
export class Tarjeta {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'usuario_id' })
    usuarioId: number;

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'usuario_id' })
    usuario: Usuario;

    @Column()
    numeroTarjeta: string;

    @Column()
    fechaExpiracion: string;

    @Column()
    cvv: string;

    @Column()
    nombreTitular: string;

    @Column({ default: false })
    esPorDefecto: boolean;
}
