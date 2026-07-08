import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Usuario } from '../../../../core/models/usuario.model';
import { Rol } from '../../../../core/models/enums.model';

type RolFiltro = Rol | 'todos';

@Component({
  selector: 'app-usuarios-list',
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
  templateUrl: './usuarios-list.html',
  styleUrl: './usuarios-list.css',
})
export class UsuariosList implements OnInit {
  private usuarioService = inject(UsuarioService);
  private notif = inject(NotificationService);

  usuarios = signal<Usuario[]>([]);
  loading = signal(false);
  search = signal('');
  rolFiltro = signal<RolFiltro>('todos');
  displayedColumns = ['nombre', 'correo', 'rol', 'estado', 'acciones'];

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);

    const filtros: { search?: string; rol?: Rol } = {};
    const s = this.search().trim();
    if (s) filtros.search = s;
    if (this.rolFiltro() !== 'todos') filtros.rol = this.rolFiltro() as Rol;

    this.usuarioService.listar(filtros).subscribe({
      next: (res) => {
        this.usuarios.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notif.error('No se pudieron cargar los usuarios');
      },
    });
  }

  cambiarEstado(usuario: Usuario): void {
    const accion = usuario.estado ? 'desactivar' : 'activar';
    if (!confirm(`¿Seguro que deseas ${accion} a ${usuario.nombre} ${usuario.apellidos}?`)) {
      return;
    }

    this.usuarioService.cambiarEstado(usuario.idUsuario).subscribe({
      next: (res) => {
        this.notif.success(`Usuario ${res.data.estado ? 'activado' : 'desactivado'}`);
        this.cargar();
      },
      error: () => this.notif.error('No se pudo cambiar el estado'),
    });
  }
}
