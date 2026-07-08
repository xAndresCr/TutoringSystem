import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { toast } from 'ngx-sonner';
import { CategoriaService } from '../categoria.service';
import { Categoria } from '../categoria.model';

type EstadoFiltro = 'todos' | 'true' | 'false';

@Component({
  selector: 'app-categorias-list',
  standalone: true,
  imports: [
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './categorias-list.html',
  styleUrl: './categorias-list.css',
})
export class CategoriasList implements OnInit {
  private categoriaService = inject(CategoriaService);

  categorias = signal<Categoria[]>([]);
  loading = signal(false);
  search = signal('');
  estadoFiltro = signal<EstadoFiltro>('todos');
  displayedColumns = ['nombre', 'descripcion', 'estado', 'acciones'];

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);

    const filtros: { search?: string; estado?: boolean } = {};
    const s = this.search().trim();
    if (s) filtros.search = s;
    if (this.estadoFiltro() !== 'todos') {
      filtros.estado = this.estadoFiltro() === 'true';
    }

    this.categoriaService.listar(filtros).subscribe({
      next: (data) => {
        this.categorias.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        toast.error('No se pudieron cargar las categorías');
      },
    });
  }

  cambiarEstado(categoria: Categoria): void {
    const accion = categoria.estado ? 'desactivar' : 'activar';
    if (!confirm(`¿Seguro que deseas ${accion} la categoría "${categoria.nombre}"?`)) {
      return;
    }

    this.categoriaService.cambiarEstado(categoria.idCategoria).subscribe({
      next: (actualizada) => {
        toast.success(`Categoría ${actualizada.estado ? 'activada' : 'desactivada'}`);
        // Recargamos para respetar el filtro de estado activo
        this.cargar();
      },
      error: () => toast.error('No se pudo cambiar el estado'),
    });
  }
}
