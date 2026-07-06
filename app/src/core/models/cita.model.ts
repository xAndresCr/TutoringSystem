import { EstadoCita, Modalidad } from './enums.model';
import { PerfilProfesional } from './perfil.profesional.model';
import { Servicio } from './servicio.model';
import { Usuario } from './usuario.model';

export interface Cita {
  idCita: number;
  fechaCreacion: string;
  fechaSolicitada: string;
  horaInicio: string;
  horaFinalizacion: string;
  descripcionCita: string;
  comentarioProfesional?: string | null;
  montoTotal: number | string;
  modalidad: Modalidad;
  estado: EstadoCita;
  idCliente: number;
  cliente?: Usuario;
  idProfesional: number;
  profesional?: PerfilProfesional;
  idServicio: number;
  servicio?: Servicio;
}

export interface CitaCreateDto {
  fechaSolicitada: string;
  horaInicio: string;
  horaFinalizacion: string;
  descripcionCita: string;
  modalidad: Modalidad;
  montoTotal: number;
  idCliente: number;
  idProfesional: number;
  idServicio: number;
}

export interface CitaUpdateDto {
  comentarioProfesional?: string;
  estado?: EstadoCita;
}