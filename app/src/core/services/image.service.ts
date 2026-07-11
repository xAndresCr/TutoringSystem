import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ApiResponse } from '../models/api-response.model';
import { ImageUploadResponse } from '../models/image.model';

@Injectable({ providedIn: 'root' })
export class ImageService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/images`;

  /** Sube una imagen (campo 'image'). Si se pasa previousFileName, el backend borra la anterior. */
  upload(file: File, previousFileName?: string | null) {
    const formData = new FormData();
    formData.append('image', file);
    if (previousFileName) {
      formData.append('previousFileName', previousFileName);
    }
    return this.http.post<ImageUploadResponse>(`${this.apiUrl}/upload`, formData);
  }

  /** URL pública para mostrar la imagen en un <img>. */
  getImageUrl(imageName?: string | null): string {
    if (!imageName) return '';
    return `${environment.imageUrl}/${imageName}`;
  }

  listar() {
    return this.http.get<ApiResponse<string[]>>(`${this.apiUrl}/files`);
  }
}