import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Especialidad } from '../../../../core/models/especialidad.model';
import { EspecialidadService } from '../../../../core/services/especialidad.service';
import { NotificationService, ToastType } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-especialidades-list',
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './especialidades-list.html',
  styleUrl: './especialidades-list.css',
})
export class EspecialidadesList {
  private readonly especialidadService = inject(EspecialidadService);
  private readonly notification = inject(NotificationService);

  especialidades = signal<Especialidad[]>([]);
  search = signal('');
  filtroEstado = signal<string>('todos');
  loading = signal(false);
  error = signal<string | null>(null);

  displayedColumns = ['nombre', 'estado', 'acciones'];

  especialidadesFiltradas = computed(() => {
    const texto = this.search().trim().toLowerCase();
    const estado = this.filtroEstado();

    return this.especialidades().filter((e) => {
      const coincideTexto = !texto || e.nombre.toLowerCase().includes(texto);
      const coincideEstado =
        estado === 'todos' ||
        (estado === 'activo' && e.estado) ||
        (estado === 'inactivo' && !e.estado);
      return coincideTexto && coincideEstado;
    });
  });

  total = computed(() => this.especialidadesFiltradas().length);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.error.set(null);
    this.especialidadService.listar().subscribe({
      next: (res) => {
        this.especialidades.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las especialidades.');
        this.loading.set(false);
      },
    });
  }

  cambiarEstado(especialidad: Especialidad): void {
    this.especialidadService.cambiarEstado(especialidad.idEspecialidad).subscribe({
      next: (res) => {
        // Actualiza solo el registro modificado sin recargar todo
        this.especialidades.update((lista) =>
          lista.map((e) =>
            e.idEspecialidad === especialidad.idEspecialidad ? res.data : e
          )
        );
        this.notification.success(
          `Especialidad ${res.data.estado ? 'activada' : 'desactivada'} correctamente`
        );
      },
      error: () => {
        this.notification.show({
          message: 'No se pudo cambiar el estado.',
          type: ToastType.Error,
        });
      },
    });
  }

  limpiarFiltros(): void {
    this.search.set('');
    this.filtroEstado.set('todos');
  }
}