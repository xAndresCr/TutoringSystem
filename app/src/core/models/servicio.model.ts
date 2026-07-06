import { Modalidad } from './enums.model';
import { Categoria } from './categoria.models';
import { Especialidad } from './especialidad.model';
import { PerfilProfesional } from './perfil.profesional.model';

export interface Servicio {
  idServicio: number;
  nombre: string;
  descripcion: string;
  precio: number | string;
  duracionMinutos: number;
  estado: boolean;
  fechaCreacion: string;
  modalidad: Modalidad;
  idProfesional: number;
  profesional?: PerfilProfesional;
  idCategoria: number;
  categoria?: Categoria;
  especialidades?: EspecialidadServicio[];
}

export interface EspecialidadServicio {
  idEspecialidad: number;
  idServicio: number;
  especialidad?: Especialidad;
}

export interface ServicioCreateDto {
  nombre: string;
  descripcion: string;
  precio: number;
  duracionMinutos: number;
  estado: boolean;
  modalidad: Modalidad;
  idProfesional: number;
  idCategoria: number;
  especialidades?: number[]; // ids de especialidades
}

export interface ServicioUpdateDto {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  duracionMinutos?: number;
  estado?: boolean;
  modalidad?: Modalidad;
  idProfesional?: number;
  idCategoria?: number;
  especialidades?: number[];
}