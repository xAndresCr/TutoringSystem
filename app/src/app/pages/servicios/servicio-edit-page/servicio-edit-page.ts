import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Categoria } from '../../../../core/models/categoria.model';
import { Especialidad } from '../../../../core/models/especialidad.model';
import { PerfilProfesional } from '../../../../core/models/perfil.profesional.model';
import { Modalidad } from '../../../../core/models/enums.model';
import { ServicioService } from '../../../../core/services/servicio.service';
import { CategoriaService } from '../../../../core/services/categoria.service';
import { EspecialidadService } from '../../../../core/services/especialidad.service';
import { PerfilProfesionalService } from '../../../../core/services/perfil-profesional.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-servicio-edit-page',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './servicio-edit-page.html',
  styleUrl: './servicio-edit-page.css',
})
export class ServicioEditPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly servicioService = inject(ServicioService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly especialidadService = inject(EspecialidadService);
  private readonly profesionalService = inject(PerfilProfesionalService);
  private readonly notification = inject(NotificationService);

  categorias = signal<Categoria[]>([]);
  especialidades = signal<Especialidad[]>([]);
  profesionales = signal<PerfilProfesional[]>([]);
  cargando = signal(true);
  guardando = signal(false);
  error = signal<string | null>(null);

  idServicio!: number;
  especialidadesSeleccionadas = signal<number[]>([]);

  modalidades: Modalidad[] = ['VIRTUAL', 'PRESENCIAL', 'MIXTA'];
  modalidadLabels: Record<Modalidad, string> = {
    VIRTUAL: 'Virtual',
    PRESENCIAL: 'Presencial',
    MIXTA: 'Mixta',
  };

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
    precio: [null as number | null, [Validators.required, Validators.min(1)]],
    duracionMinutos: [null as number | null, [Validators.required, Validators.min(1)]],
    modalidad: ['' as Modalidad | '', Validators.required],
    estado: [true],
    idProfesional: [null as number | null, Validators.required],
    idCategoria: [null as number | null, Validators.required],
  });

  ngOnInit(): void {
    this.idServicio = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarDatos();
  }

  cargarDatos(): void {
    // Cargar selectores en paralelo
    this.categoriaService.listar({ estado: true }).subscribe({
      next: (res) => this.categorias.set(res.data),
    });
    this.especialidadService.listar({ estado: true }).subscribe({
      next: (res) => this.especialidades.set(res.data),
    });
    this.profesionalService.listar().subscribe({
      next: (res) => this.profesionales.set(res.data),
    });

    // Cargar datos del servicio a editar
    this.servicioService.obtenerPorId(this.idServicio).subscribe({
      next: (res) => {
        const s = res.data;
        this.form.patchValue({
          nombre: s.nombre,
          descripcion: s.descripcion,
          precio: Number(s.precio),
          duracionMinutos: s.duracionMinutos,
          modalidad: s.modalidad,
          estado: s.estado,
          // Se usa el id escalar; si no viniera, se toma del objeto relacionado
          idProfesional: s.idProfesional ?? s.profesional?.idPerfilProfesional ?? null,
          idCategoria: s.idCategoria ?? s.categoria?.idCategoria ?? null,
        });

        // Cargar especialidades seleccionadas
        const ids = s.especialidades
          ?.map((e: any) => e.especialidad?.idEspecialidad)
          .filter(Boolean) ?? [];
        this.especialidadesSeleccionadas.set(ids);

        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el servicio.');
        this.cargando.set(false);
      },
    });
  }

  toggleEspecialidad(id: number): void {
    this.especialidadesSeleccionadas.update((sel) =>
      sel.includes(id) ? sel.filter((e) => e !== id) : [...sel, id]
    );
  }

  estaSeleccionada(id: number): boolean {
    return this.especialidadesSeleccionadas().includes(id);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    const v = this.form.value;

    this.servicioService.actualizar(this.idServicio, {
      nombre: v.nombre!,
      descripcion: v.descripcion!,
      precio: v.precio!,
      duracionMinutos: v.duracionMinutos!,
      modalidad: v.modalidad as Modalidad,
      estado: v.estado ?? true,
      idProfesional: v.idProfesional!,
      idCategoria: v.idCategoria!,
      especialidadIds: this.especialidadesSeleccionadas(),
    }).subscribe({
      next: () => {
        this.notification.success('Servicio actualizado correctamente.', null, 3000, '/admin/servicios');
      },
      error: () => {
        this.notification.error('No se pudo actualizar el servicio.');
        this.guardando.set(false);
      },
    });
  }

  hasError(campo: string, error: string): boolean {
    const control = this.form.get(campo);
    return !!(control?.hasError(error) && control?.touched);
  }
}