export interface Categoria {
  idCategoria: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
}

export interface CategoriaCreateDto {
  nombre: string;
  descripcion: string;
}

export interface CategoriaUpdateDto {
  nombre?: string;
  descripcion?: string;
}