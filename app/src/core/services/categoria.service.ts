import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ApiResponse } from '../models/api-response.model';
import { Categoria } from '../models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/categorias`;

  listar(filtros?: { search?: string; estado?: boolean }) {
    let params: any = {};
    if (filtros?.search) params['search'] = filtros.search;
    if (filtros?.estado !== undefined) params['estado'] = filtros.estado;
    return this.http.get<ApiResponse<Categoria[]>>(this.apiUrl, { params });
  }

  cambiarEstado(id: number) {
    return this.http.patch<ApiResponse<Categoria>>(`${this.apiUrl}/${id}/estado`, {});
  }
}