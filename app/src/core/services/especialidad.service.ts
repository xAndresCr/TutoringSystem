import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ApiResponse } from '../models/api-response.model';
import { Especialidad } from '../models/especialidad.model';

@Injectable({ providedIn: 'root' })
export class EspecialidadService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/especialidades`;

  listar(filtros?: { search?: string; estado?: boolean }) {
    let params: any = {};
    if (filtros?.search) params['search'] = filtros.search;
    if (filtros?.estado !== undefined) params['estado'] = filtros.estado;
    return this.http.get<ApiResponse<Especialidad[]>>(this.apiUrl, { params });
  }

  cambiarEstado(id: number) {
    return this.http.patch<ApiResponse<Especialidad>>(`${this.apiUrl}/${id}/estado`, {});
  }
}
