import { Component, computed, inject, signal } from '@angular/core';
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
import { Servicio } from '../../../../core/models/servicio.model';
import { Categoria } from '../../../../core/models/categoria.model';
import { Modalidad } from '../../../../core/models/enums.model';
import { ServicioService } from '../../../../core/services/servicio.service';
import { CategoriaService } from '../../../../core/services/categoria.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-servicio-list',
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
  templateUrl: './servicio-list.html',
  styleUrl: './servicio-list.css',
})
export class ServicioList {
  private readonly servicioService = inject(ServicioService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly notification = inject(NotificationService);

  servicios = signal<Servicio[]>([]);
  categorias = signal<Categoria[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  search = signal('');
  filtroCategoria = signal<number | null>(null);
  filtroModalidad = signal<Modalidad | 'todos'>('todos');
  precioMin = signal<number | null>(null);
  precioMax = signal<number | null>(null);

  displayedColumns = ['nombre', 'profesional', 'categoria', 'precio', 'modalidad', 'estado', 'acciones'];

  modalidades: Modalidad[] = ['VIRTUAL', 'PRESENCIAL', 'MIXTA'];
  modalidadLabels: Record<Modalidad, string> = {
    VIRTUAL: 'Virtual',
    PRESENCIAL: 'Presencial',
    MIXTA: 'Mixta',
  };

  serviciosFiltrados = computed(() => {
    const texto = this.search().trim().toLowerCase();
    const categoria = this.filtroCategoria();
    const modalidad = this.filtroModalidad();
    const min = this.precioMin();
    const max = this.precioMax();

    return this.servicios().filter((s) => {
      const coincideTexto = !texto || s.nombre.toLowerCase().includes(texto);
      const coincideCategoria = !categoria || s.idCategoria === categoria;
      const coincideModalidad = modalidad === 'todos' || s.modalidad === modalidad;
      const precio = Number(s.precio);
      const coincideMin = min === null || precio >= min;
      const coincideMax = max === null || precio <= max;
      return coincideTexto && coincideCategoria && coincideModalidad && coincideMin && coincideMax;
    });
  });

  total = computed(() => this.serviciosFiltrados().length);

  ngOnInit(): void {
    this.cargar();
    this.cargarCategorias();
  }

  cargar(): void {
    this.loading.set(true);
    this.error.set(null);
    this.servicioService.listar().subscribe({
      next: (res) => {
        this.servicios.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los servicios.');
        this.loading.set(false);
      },
    });
  }

  cargarCategorias(): void {
    this.categoriaService.listar({ estado: true }).subscribe({
      next: (res) => this.categorias.set(res.data),
      error: () => {},
    });
  }

  cambiarEstado(servicio: Servicio): void {
    this.servicioService.cambiarEstado(servicio.idServicio).subscribe({
      next: (res) => {
        this.servicios.update((lista) =>
          lista.map((s) => s.idServicio === servicio.idServicio ? res.data : s)
        );
        this.notification.success(
          `Servicio ${res.data.estado ? 'activado' : 'desactivado'} correctamente`
        );
      },
      error: () => this.notification.error('No se pudo cambiar el estado.'),
    });
  }

  toNumber(val: any): number | null {
    const n = Number(val);
    return isNaN(n) || val === '' || val === null ? null : n;
  }
  
  getModalidadLabel(modalidad: string): string {
  return this.modalidadLabels[modalidad as Modalidad] ?? modalidad;
}

  limpiarFiltros(): void {
    this.search.set('');
    this.filtroCategoria.set(null);
    this.filtroModalidad.set('todos');
    this.precioMin.set(null);
    this.precioMax.set(null);
  }
}