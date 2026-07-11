import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PerfilProfesionalService } from '../../../../core/services/perfil-profesional.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PerfilProfesional } from '../../../../core/models/perfil.profesional.model';
import { ImageService } from '../../../../core/services/image.service';

@Component({
  selector: 'app-profesional-detail',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './profesional-detail.html',
  styleUrl: './profesional-detail.css',
})
export class ProfesionalDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private profesionalService = inject(PerfilProfesionalService);
  private notif = inject(NotificationService);
  private imageService = inject(ImageService);
  profesional = signal<PerfilProfesional | null>(null);
  loading = signal(false);

  imageUrl(fileName?: string | null): string {
    return this.imageService.getImageUrl(fileName);
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.notif.error('Profesional no válido');
      return;
    }

    

    this.loading.set(true);
    this.profesionalService.obtenerPorId(id).subscribe({
      next: (res) => {
        this.profesional.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notif.error('No se pudo cargar el profesional');
      },
    });

  }
  
}
