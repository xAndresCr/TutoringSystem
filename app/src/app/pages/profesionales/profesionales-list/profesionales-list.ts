import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PerfilProfesionalService } from '../../../../core/services/perfil-profesional.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PerfilProfesional } from '../../../../core/models/perfil.profesional.model';
import { Modalidad } from '../../../../core/models/enums.model';

type ModalidadFiltro = Modalidad | 'todos';
type DisponibilidadFiltro = 'todos' | 'true' | 'false';

@Component({
  selector: 'app-profesionales-list',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './profesionales-list.html',
  styleUrl: './profesionales-list.css',
})
export class ProfesionalesList implements OnInit {
  private profesionalService = inject(PerfilProfesionalService);
  private notif = inject(NotificationService);

  profesionales = signal<PerfilProfesional[]>([]);
  loading = signal(false);
  search = signal('');
  modalidadFiltro = signal<ModalidadFiltro>('todos');
  disponibilidadFiltro = signal<DisponibilidadFiltro>('todos');
  displayedColumns = ['nombre', 'titulo', 'modalidad', 'tarifa', 'disponibilidad', 'acciones'];

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);

    const filtros: { search?: string; modalidad?: Modalidad; disponibilidad?: boolean } = {};
    const s = this.search().trim();
    if (s) filtros.search = s;
    if (this.modalidadFiltro() !== 'todos') filtros.modalidad = this.modalidadFiltro() as Modalidad;
    if (this.disponibilidadFiltro() !== 'todos') {
      filtros.disponibilidad = this.disponibilidadFiltro() === 'true';
    }

    this.profesionalService.listar(filtros).subscribe({
      next: (res) => {
        this.profesionales.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notif.error('No se pudieron cargar los profesionales');
      },
    });
  }

  cambiarDisponibilidad(profesional: PerfilProfesional): void {
    const accion = profesional.disponibilidad ? 'marcar como NO disponible' : 'marcar como disponible';
    if (!confirm(`¿Deseas ${accion} a este profesional?`)) return;

    this.profesionalService.cambiarDisponibilidad(profesional.idPerfilProfesional).subscribe({
      next: (res) => {
        this.notif.success(
          `Profesional ${res.data.disponibilidad ? 'disponible' : 'no disponible'}`
        );
        this.cargar();
      },
      error: () => this.notif.error('No se pudo cambiar la disponibilidad'),
    });
  }
}
