import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PerfilProfesionalService } from '../../../../core/services/perfil-profesional.service';
import { EspecialidadService } from '../../../../core/services/especialidad.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ImageService } from '../../../../core/services/image.service';
import { PerfilProfesionalCreateDto } from '../../../../core/models/perfil.profesional.model';
import { Especialidad } from '../../../../core/models/especialidad.model';

// Validador a nivel de formulario: la confirmación debe coincidir con la contraseña.
// Se expone como error del grupo ('passwordMismatch') para no mutar los errores del
// propio control (evita ciclos de validación). La plantilla lo muestra bajo el campo.
function coincidenciaPassword(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmar = group.get('confirmarPassword')?.value;

  // Si aún no se escribe la confirmación, deja que el validador 'required' actúe
  if (!confirmar) return null;

  return password === confirmar ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-profesional-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule, // ← nuevo (para el spinner de carga)
  ],
  templateUrl: './profesional-create.html',
  styleUrl: './profesional-create.css',
})
export class ProfesionalCreate implements OnInit {
  private fb = inject(FormBuilder);
  private profesionalService = inject(PerfilProfesionalService);
  private especialidadService = inject(EspecialidadService);
  private imageService = inject(ImageService); // ← nuevo
  private notif = inject(NotificationService);
  private router = inject(Router);

  guardando = signal(false);
  especialidades = signal<Especialidad[]>([]);
  subiendoImagen = signal(false);          // ← nuevo
  previewUrl = signal<string | null>(null); // ← nuevo

  form = this.fb.group({
    // Datos de usuario
    nombre: ['', [Validators.required, Validators.maxLength(45)]],
    apellidos: ['', [Validators.required, Validators.maxLength(90)]],
    correo: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    telefono: ['', [Validators.required, Validators.maxLength(20)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmarPassword: ['', [Validators.required]],
    // Datos del perfil
    titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
    annosExperiencia: [0, [Validators.required, Validators.min(0), Validators.max(80)]],
    tarifaBase: [null as number | null, [Validators.required, Validators.min(0.01)]],
    modalidad: ['', [Validators.required]],
    provincia: ['', [Validators.required, Validators.maxLength(60)]],
    canton: ['', [Validators.required, Validators.maxLength(60)]],
    distrito: ['', [Validators.required, Validators.maxLength(60)]],
    disponibilidad: [true],
    imagen: [''],
    especialidadIds: [[] as number[]],
  }, { validators: coincidenciaPassword });

  ngOnInit(): void {
    this.especialidadService.listar({ estado: true }).subscribe({
      next: (res) => this.especialidades.set(res.data),
      error: () => this.notif.error('No se pudieron cargar las especialidades'),
    });
  }

  // ← nuevo: sube la imagen y guarda solo el nombre que devuelve el backend
  onImagenSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const tiposOk = ['image/jpeg', 'image/png', 'image/webp'];
    if (!tiposOk.includes(file.type)) {
      this.notif.error('Formato no permitido. Usa JPG, PNG o WEBP.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      this.notif.error('La imagen supera el máximo de 2 MB.');
      return;
    }

    this.subiendoImagen.set(true);
    this.imageService.upload(file).subscribe({
      next: (res) => {
        this.form.controls.imagen.setValue(res.fileName);
        this.previewUrl.set(this.imageService.getImageUrl(res.fileName));
        this.subiendoImagen.set(false);
        this.notif.success('Imagen subida correctamente');
      },
      error: (err) => {
        this.subiendoImagen.set(false);
        this.notif.error(err?.error?.message ?? 'No se pudo subir la imagen');
      },
    });
    input.value = '';
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notif.warning('Revisa los campos marcados en el formulario');
      return;
    }

    this.guardando.set(true);
    const v = this.form.getRawValue();
    const dto: PerfilProfesionalCreateDto = {
      nombre: v.nombre!,
      apellidos: v.apellidos!,
      correo: v.correo!,
      telefono: v.telefono!,
      password: v.password!,
      titulo: v.titulo!,
      descripcion: v.descripcion!,
      annosExperiencia: Number(v.annosExperiencia),
      tarifaBase: Number(v.tarifaBase),
      modalidad: v.modalidad as any,
      provincia: v.provincia!,
      canton: v.canton!,
      distrito: v.distrito!,
      disponibilidad: v.disponibilidad ?? true,
      imagen: v.imagen || null,
      especialidadIds: v.especialidadIds ?? [],
    };

    this.profesionalService.crear(dto).subscribe({
      next: () => {
        this.notif.success('Profesional creado correctamente');
        this.router.navigateByUrl('/admin/profesionales');
      },
      error: (err) => {
        this.guardando.set(false);
        this.notif.error(err?.error?.message ?? 'No se pudo crear el profesional');
      },
    });
  }
}