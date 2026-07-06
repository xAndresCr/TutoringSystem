export interface Especialidad {
  idEspecialidad: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
}

export interface EspecialidadCreateDto {
  nombre: string;
  descripcion: string;
}

export interface EspecialidadUpdateDto {
  nombre?: string;
  descripcion?: string;
}