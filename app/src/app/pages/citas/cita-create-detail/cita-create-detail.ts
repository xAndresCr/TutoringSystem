import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CitaService } from '../../../../core/services/cita.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Cita } from '../../../../core/models/cita.model';
import { EstadoCita } from '../../../../core/models/enums.model';

@Component({
  selector: 'app-cita-create-detail',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './cita-create-detail.html',
  styleUrl: './cita-create-detail.css',
})
export class CitaCreateDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private citaService = inject(CitaService);
  private notif = inject(NotificationService);

  cita = signal<Cita | null>(null);
  loading = signal(false);

  estadoLabels: Record<EstadoCita, string> = {
    PENDIENTE: 'Pendiente',
    ACEPTADA: 'Aceptada',
    RECHAZADA: 'Rechazada',
    CANCELADA: 'Cancelada',
    COMPLETADA: 'Completada',
  };

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.notif.error('Cita no válida');
      return;
    }
    this.loading.set(true);
    this.citaService.obtenerPorId(id).subscribe({
      next: (res) => {
        this.cita.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notif.error('No se pudo cargar la cita');
      },
    });
  }

  estadoClass(estado?: EstadoCita): string {
    return estado ? 'estado-' + estado.toLowerCase() : '';
  }

  formatFecha(iso?: string): string {
    return iso ? new Date(iso).toLocaleDateString('es-CR', { timeZone: 'UTC' }) : '—';
  }

  formatHora(iso?: string): string {
    return iso
      ? new Date(iso).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit', hour12: false })
      : '—';
  }
}
