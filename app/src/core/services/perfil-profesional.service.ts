import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ApiResponse } from '../models/api-response.model';
import { PerfilProfesional, PerfilProfesionalCreateDto, PerfilProfesionalUpdateDto } from '../models/perfil.profesional.model';
import { Modalidad } from '../models/enums.model';

@Injectable({ providedIn: 'root' })
export class PerfilProfesionalService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/profesionales`;

  listar(filtros?: { search?: string; modalidad?: Modalidad; disponibilidad?: boolean }) {
    let params: any = {};
    if (filtros?.search) params['search'] = filtros.search;
    if (filtros?.modalidad) params['modalidad'] = filtros.modalidad;
    if (filtros?.disponibilidad !== undefined) params['disponibilidad'] = filtros.disponibilidad;
    return this.http.get<ApiResponse<PerfilProfesional[]>>(this.apiUrl, { params });
  }

  obtenerPorId(id: number) {
    return this.http.get<ApiResponse<PerfilProfesional>>(`${this.apiUrl}/${id}`);
  }

  getImageUrl(imageName: string): string {
    return `${environment.imageUrl}/${imageName}`;
  }

  crear(data: PerfilProfesionalCreateDto) {
    return this.http.post<ApiResponse<PerfilProfesional>>(this.apiUrl, data);
  }

  actualizar(id: number, data: PerfilProfesionalUpdateDto) {
    return this.http.put<ApiResponse<PerfilProfesional>>(`${this.apiUrl}/${id}`, data);
  }

  cambiarDisponibilidad(id: number) {
    return this.http.patch<ApiResponse<PerfilProfesional>>(`${this.apiUrl}/${id}/disponibilidad`, {});
  }
}