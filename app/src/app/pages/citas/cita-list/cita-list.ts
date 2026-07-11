import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Cita } from '../../../../core/models/cita.model';
import { PerfilProfesional } from '../../../../core/models/perfil.profesional.model';
import { EstadoCita } from '../../../../core/models/enums.model';
import { CitaService } from '../../../../core/services/cita.service';
import { PerfilProfesionalService } from '../../../../core/services/perfil-profesional.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-cita-list',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  templateUrl: './cita-list.html',
  styleUrl: './cita-list.css',
})
export class CitaList implements OnInit {
  private readonly citaService = inject(CitaService);
  private readonly profesionalService = inject(PerfilProfesionalService);
  private readonly notification = inject(NotificationService);

  citas = signal<Cita[]>([]);
  profesionales = signal<PerfilProfesional[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Filtros combinables: estado, profesional y rango de fechas
  filtroEstado = signal<EstadoCita | 'todos'>('todos');
  filtroProfesional = signal<number | null>(null);
  fechaDesde = signal<string | null>(null);
  fechaHasta = signal<string | null>(null);

  displayedColumns = ['cliente', 'profesional', 'servicio', 'fecha', 'hora', 'estado', 'acciones'];

  estados: EstadoCita[] = ['PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'CANCELADA', 'COMPLETADA'];
  estadoLabels: Record<EstadoCita, string> = {
    PENDIENTE: 'Pendiente',
    ACEPTADA: 'Aceptada',
    RECHAZADA: 'Rechazada',
    CANCELADA: 'Cancelada',
    COMPLETADA: 'Completada',
  };

  citasFiltradas = computed(() => {
    const estado = this.filtroEstado();
    const prof = this.filtroProfesional();
    const desde = this.fechaDesde();
    const hasta = this.fechaHasta();

    return this.citas().filter((c) => {
      const coincideEstado = estado === 'todos' || c.estado === estado;
      const coincideProf = !prof || c.idProfesional === prof;
      const fecha = (c.fechaSolicitada ?? '').slice(0, 10); // 'YYYY-MM-DD'
      const coincideDesde = !desde || fecha >= desde;
      const coincideHasta = !hasta || fecha <= hasta;
      return coincideEstado && coincideProf && coincideDesde && coincideHasta;
    });
  });

  total = computed(() => this.citasFiltradas().length);

  ngOnInit(): void {
    this.cargar();
    this.cargarProfesionales();
  }

  cargar(): void {
    this.loading.set(true);
    this.error.set(null);
    this.citaService.listar().subscribe({
      next: (res) => {
        this.citas.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las citas.');
        this.loading.set(false);
      },
    });
  }

  cargarProfesionales(): void {
    this.profesionalService.listar().subscribe({
      next: (res) => this.profesionales.set(res.data),
      error: () => {},
    });
  }

  estadoClass(estado: string): string {
    return 'estado-' + String(estado).toLowerCase();
  }

  getEstadoLabel(estado: string): string {
    return this.estadoLabels[estado as EstadoCita] ?? estado;
  }

  // La fecha se guarda como fecha (medianoche UTC): se muestra en UTC para no
  // desplazar el día. La hora se guarda como instante local: se muestra en local.
  formatFecha(iso: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('es-CR', { timeZone: 'UTC' });
  }

  formatHora(iso: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleTimeString('es-CR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  limpiarFiltros(): void {
    this.filtroEstado.set('todos');
    this.filtroProfesional.set(null);
    this.fechaDesde.set(null);
    this.fechaHasta.set(null);
  }
}
