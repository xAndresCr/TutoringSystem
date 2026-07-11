import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ServicioService } from '../../../../core/services/servicio.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Servicio } from '../../../../core/models/servicio.model';

@Component({
  selector: 'app-servicio-detail',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './servicio-detail.html',
  styleUrl: './servicio-detail.css',
})
export class ServicioDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private servicioService = inject(ServicioService);
  private notif = inject(NotificationService);

  servicio = signal<Servicio | null>(null);
  loading = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.notif.error('Servicio no válido');
      return;
    }
    this.loading.set(true);
    this.servicioService.obtenerPorId(id).subscribe({
      next: (res) => {
        this.servicio.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notif.error('No se pudo cargar el servicio');
      },
    });
  }
}
