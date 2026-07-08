import { Modalidad } from './enums.model';
import { Especialidad } from './especialidad.model';
import { Servicio } from './servicio.model';
import { Usuario } from './usuario.model';

export interface PerfilProfesional {
  idPerfilProfesional: number;
  titulo: string;
  descripcion: string;
  annosExperiencia: number;
  tarifaBase: number | string;
  disponibilidad: boolean;
  imagen?: string | null;
  modalidad: Modalidad;
  provincia: string;
  canton: string;
  distrito: string;
  idUsuario: number;
  usuario?: Usuario;
  especialidades?: EspecialidadPerfil[];
  servicios?: Servicio[];
}

export interface EspecialidadPerfil {
  idEspecialidad: number;
  idPerfilProfesional: number;
  especialidad?: Especialidad;
}

export interface PerfilProfesionalCreateDto {
  // Datos del usuario (rol PROFESIONAL) — el backend crea usuario + perfil juntos (A2)
  nombre: string;
  apellidos: string;
  correo: string;
  telefono: string;
  password: string;
  // Datos del perfil
  titulo: string;
  descripcion: string;
  annosExperiencia: number;
  tarifaBase: number;
  disponibilidad?: boolean;
  imagen?: string | null;
  modalidad: Modalidad;
  provincia: string;
  canton: string;
  distrito: string;
  especialidadIds?: number[]; // ids de especialidades
}

export interface PerfilProfesionalUpdateDto {
  titulo?: string;
  descripcion?: string;
  annosExperiencia?: number;
  tarifaBase?: number;
  disponibilidad?: boolean;
  imagen?: string | null;
  modalidad?: Modalidad;
  provincia?: string;
  canton?: string;
  distrito?: string;
  especialidadIds?: number[];
}