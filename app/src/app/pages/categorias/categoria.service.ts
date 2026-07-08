import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Categoria } from './categoria.model';

// El backend responde con { success, data }
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/categorias`;

  listar(filtros?: { search?: string; estado?: boolean }): Observable<Categoria[]> {
    let params = new HttpParams();
    if (filtros?.search) params = params.set('search', filtros.search);
    if (filtros?.estado !== undefined) params = params.set('estado', String(filtros.estado));

    return this.http
      .get<ApiResponse<Categoria[]>>(this.baseUrl, { params })
      .pipe(map((res) => res.data));
  }

  cambiarEstado(idCategoria: number): Observable<Categoria> {
    return this.http
      .patch<ApiResponse<Categoria>>(`${this.baseUrl}/${idCategoria}/estado`, {})
      .pipe(map((res) => res.data));
  }
}
