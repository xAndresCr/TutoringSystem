import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ApiResponse } from '../models/api-response.model';
import { Servicio, ServicioCreateDto, ServicioUpdateDto } from '../models/servicio.model';
import { Modalidad } from '../models/enums.model';

@Injectable({ providedIn: 'root' })
export class ServicioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/servicios`;

  listar(filtros?: { search?: string; idCategoria?: number; modalidad?: Modalidad; precioMin?: number; precioMax?: number }) {
    let params: any = {};
    if (filtros?.search) params['search'] = filtros.search;
    if (filtros?.idCategoria) params['idCategoria'] = filtros.idCategoria;
    if (filtros?.modalidad) params['modalidad'] = filtros.modalidad;
    if (filtros?.precioMin) params['precioMin'] = filtros.precioMin;
    if (filtros?.precioMax) params['precioMax'] = filtros.precioMax;
    return this.http.get<ApiResponse<Servicio[]>>(this.apiUrl, { params });
  }

  obtenerPorId(id: number) {
    return this.http.get<ApiResponse<Servicio>>(`${this.apiUrl}/${id}`);
  }

  crear(data: ServicioCreateDto) {
  return this.http.post<ApiResponse<Servicio>>(this.apiUrl, data);
}

  actualizar(id: number, data: ServicioUpdateDto) {
    return this.http.put<ApiResponse<Servicio>>(`${this.apiUrl}/${id}`, data);
  }

  cambiarEstado(id: number) {
    return this.http.patch<ApiResponse<Servicio>>(`${this.apiUrl}/${id}/estado`, {});
  }
}