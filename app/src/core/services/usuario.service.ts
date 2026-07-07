import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ApiResponse } from '../models/api-response.model';
import { Usuario } from '../models/usuario.model';
import { Rol } from '../models/enums.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/usuarios`;

  listar(filtros?: { search?: string; rol?: Rol }) {
    let params: any = {};
    if (filtros?.search) params['search'] = filtros.search;
    if (filtros?.rol) params['rol'] = filtros.rol;
    return this.http.get<ApiResponse<Usuario[]>>(this.apiUrl, { params });
  }

  cambiarEstado(id: number) {
    return this.http.patch<ApiResponse<Usuario>>(`${this.apiUrl}/${id}/estado`, {});
  }
}