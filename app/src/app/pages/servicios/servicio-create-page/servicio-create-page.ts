import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
  selector: 'app-servicio-create-page',
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
    MatIconModule,
  ],
  templateUrl: './servicio-create-page.html',
  styleUrl: './servicio-create-page.css',
})
export class ServicioCreatePage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly servicioService = inject(ServicioService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly especialidadService = inject(EspecialidadService);
  private readonly profesionalService = inject(PerfilProfesionalService);
  private readonly notification = inject(NotificationService);

  categorias = signal<Categoria[]>([]);
  especialidades = signal<Especialidad[]>([]);
  profesionales = signal<PerfilProfesional[]>([]);
  guardando = signal(false);

  modalidades: Modalidad[] = ['VIRTUAL', 'PRESENCIAL', 'MIXTA'];
  modalidadLabels: Record<Modalidad, string> = {
    VIRTUAL: 'Virtual',
    PRESENCIAL: 'Presencial',
    MIXTA: 'Mixta',
  };

  // IDs de especialidades seleccionadas
  especialidadesSeleccionadas = signal<number[]>([]);

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
    this.cargarCategorias();
    this.cargarEspecialidades();
    this.cargarProfesionales();
  }

  cargarCategorias(): void {
    this.categoriaService.listar({ estado: true }).subscribe({
      next: (res) => this.categorias.set(res.data),
      error: () => this.notification.error('No se pudieron cargar las categorías.'),
    });
  }

  cargarEspecialidades(): void {
    this.especialidadService.listar({ estado: true }).subscribe({
      next: (res) => this.especialidades.set(res.data),
      error: () => this.notification.error('No se pudieron cargar las especialidades.'),
    });
  }

  cargarProfesionales(): void {
    this.profesionalService.listar({ disponibilidad: true }).subscribe({
      next: (res) => this.profesionales.set(res.data),
      error: () => this.notification.error('No se pudieron cargar los profesionales.'),
    });
  }

  toggleEspecialidad(id: number): void {
    this.especialidadesSeleccionadas.update((seleccionadas) =>
      seleccionadas.includes(id)
        ? seleccionadas.filter((e) => e !== id)
        : [...seleccionadas, id]
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
    const valores = this.form.value;

    this.servicioService.crear({
      nombre: valores.nombre!,
      descripcion: valores.descripcion!,
      precio: valores.precio!,
      duracionMinutos: valores.duracionMinutos!,
      modalidad: valores.modalidad as Modalidad,
      estado: valores.estado ?? true,
      idProfesional: valores.idProfesional!,
      idCategoria: valores.idCategoria!,
      especialidadIds: this.especialidadesSeleccionadas(),
    }).subscribe({
      next: () => {
        this.notification.success('Servicio creado correctamente.', null, 3000, '/admin/servicios');
      },
      error: () => {
        this.notification.error('No se pudo crear el servicio.');
        this.guardando.set(false);
      },
    });
  }

  // Helpers para mostrar errores en el template
  hasError(campo: string, error: string): boolean {
    const control = this.form.get(campo);
    return !!(control?.hasError(error) && control?.touched);
  }
}