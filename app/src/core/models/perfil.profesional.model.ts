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
  titulo: string;
  descripcion: string;
  annosExperiencia: number;
  tarifaBase: number;
  disponibilidad: boolean;
  imagen?: string | null;
  modalidad: Modalidad;
  provincia: string;
  canton: string;
  distrito: string;
  idUsuario: number;
  especialidades?: number[]; // ids de especialidades
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
  especialidades?: number[];
}