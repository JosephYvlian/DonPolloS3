export declare enum RolUsuario {
    CLIENTE = "CLIENTE",
    ADMINISTRADOR = "ADMINISTRADOR"
}
export declare class Usuario {
    id: number;
    nombreCompleto: string;
    correo: string;
    telefono: string;
    direccion: string;
    passwordHash: string;
    resetPasswordToken: string | null;
    resetPasswordExpires: Date | null;
    rol: RolUsuario;
}
