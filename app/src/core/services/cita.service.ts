import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ApiResponse } from '../models/api-response.model';
import { Cita, CitaCreateDto, CitaUpdateDto } from '../models/cita.model';
import { EstadoCita } from '../models/enums.model';

@Injectable({ providedIn: 'root' })
export class CitaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/citas`;

  listar(filtros?: { estado?: EstadoCita; idProfesional?: number; fechaInicio?: string; fechaFin?: string }) {
    let params: any = {};
    if (filtros?.estado) params['estado'] = filtros.estado;
    if (filtros?.idProfesional) params['idProfesional'] = filtros.idProfesional;
    if (filtros?.fechaInicio) params['fechaInicio'] = filtros.fechaInicio;
    if (filtros?.fechaFin) params['fechaFin'] = filtros.fechaFin;
    return this.http.get<ApiResponse<Cita[]>>(this.apiUrl, { params });
  }

  obtenerPorId(id: number) {
    return this.http.get<ApiResponse<Cita>>(`${this.apiUrl}/${id}`);
  }

  crear(data: CitaCreateDto) {
    return this.http.post<ApiResponse<Cita>>(this.apiUrl, data);
  }

  actualizarEstado(id: number, data: CitaUpdateDto) {
    return this.http.patch<ApiResponse<Cita>>(`${this.apiUrl}/${id}/estado`, data);
  }
}