import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PerfilProfesionalService } from '../../../../core/services/perfil-profesional.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PerfilProfesionalUpdateDto } from '../../../../core/models/perfil.profesional.model';

@Component({
  selector: 'app-profesional-edit',
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
    MatProgressSpinnerModule,
  ],
  templateUrl: './profesional-edit.html',
  styleUrl: './profesional-edit.css',
})
export class ProfesionalEdit implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private profesionalService = inject(PerfilProfesionalService);
  private notif = inject(NotificationService);
  private router = inject(Router);

  private id = 0;
  cargando = signal(true);
  guardando = signal(false);

  form = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
    annosExperiencia: [0, [Validators.required, Validators.min(0), Validators.max(80)]],
    tarifaBase: [null as number | null, [Validators.required, Validators.min(0.01)]],
    modalidad: ['', [Validators.required]],
    provincia: ['', [Validators.required, Validators.maxLength(60)]],
    canton: ['', [Validators.required, Validators.maxLength(60)]],
    distrito: ['', [Validators.required, Validators.maxLength(60)]],
    disponibilidad: [true],
  });

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.id) {
      this.notif.error('Profesional no válido');
      this.router.navigateByUrl('/admin/profesionales');
      return;
    }

    this.profesionalService.obtenerPorId(this.id).subscribe({
      next: (res) => {
        const p = res.data;
        this.form.patchValue({
          titulo: p.titulo,
          descripcion: p.descripcion,
          annosExperiencia: p.annosExperiencia,
          tarifaBase: Number(p.tarifaBase),
          modalidad: p.modalidad,
          provincia: p.provincia,
          canton: p.canton,
          distrito: p.distrito,
          disponibilidad: p.disponibilidad,
        });
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.notif.error('No se pudo cargar el profesional');
      },
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notif.warning('Revisa los campos marcados en el formulario');
      return;
    }

    this.guardando.set(true);
    const v = this.form.getRawValue();
    const dto: PerfilProfesionalUpdateDto = {
      titulo: v.titulo!,
      descripcion: v.descripcion!,
      annosExperiencia: Number(v.annosExperiencia),
      tarifaBase: Number(v.tarifaBase),
      modalidad: v.modalidad as any,
      provincia: v.provincia!,
      canton: v.canton!,
      distrito: v.distrito!,
      disponibilidad: v.disponibilidad ?? true,
    };

    this.profesionalService.actualizar(this.id, dto).subscribe({
      next: () => {
        this.notif.success('Profesional actualizado correctamente');
        this.router.navigateByUrl('/admin/profesionales');
      },
      error: (err) => {
        this.guardando.set(false);
        this.notif.error(err?.error?.message ?? 'No se pudo actualizar el profesional');
      },
    });
  }
}
