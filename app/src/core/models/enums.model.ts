export type Rol = 'ADMINISTRADOR' | 'PROFESIONAL' | 'CLIENTE';
export type Modalidad = 'VIRTUAL' | 'PRESENCIAL' | 'MIXTA';
export type EstadoCita = 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'CANCELADA' | 'COMPLETADA';

export interface RolOption {
  value: Rol;
  label: string;
}

export interface ModalidadOption {
  value: Modalidad;
  label: string;
}