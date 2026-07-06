import { Rol } from './enums.model';

export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellidos: string;
  correo: string;
  telefono: string;
  rol: Rol;
  estado: boolean;
  fechaRegistro: string;
  fechaActualizacion: string;
}

export interface UsuarioCreateDto {
  nombre: string;
  apellidos: string;
  correo: string;
  password: string;
  telefono: string;
  rol: Rol;
}

export interface UsuarioUpdateDto {
  nombre?: string;
  apellidos?: string;
  correo?: string;
  password?: string;
  telefono?: string;
  rol?: Rol;
}