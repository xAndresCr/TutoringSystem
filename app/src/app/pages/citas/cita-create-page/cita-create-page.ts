import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Usuario } from '../../../../core/models/usuario.model';
import { PerfilProfesional } from '../../../../core/models/perfil.profesional.model';
import { Servicio } from '../../../../core/models/servicio.model';
import { Modalidad } from '../../../../core/models/enums.model';
import { CitaService } from '../../../../core/services/cita.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { PerfilProfesionalService } from '../../../../core/services/perfil-profesional.service';
import { ServicioService } from '../../../../core/services/servicio.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-cita-create-page',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './cita-create-page.html',
  styleUrl: './cita-create-page.css',
})
export class CitaCreatePage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly citaService = inject(CitaService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly profesionalService = inject(PerfilProfesionalService);
  private readonly servicioService = inject(ServicioService);
  private readonly notification = inject(NotificationService);

  clientes = signal<Usuario[]>([]);
  profesionales = signal<PerfilProfesional[]>([]);
  servicios = signal<Servicio[]>([]);
  guardando = signal(false);

  modalidades: Modalidad[] = ['VIRTUAL', 'PRESENCIAL', 'MIXTA'];
  modalidadLabels: Record<Modalidad, string> = {
    VIRTUAL: 'Virtual',
    PRESENCIAL: 'Presencial',
    MIXTA: 'Mixta',
  };

  form = this.fb.group({
    idCliente:       [null as number | null, Validators.required],
    idProfesional:   [null as number | null, Validators.required],
    idServicio:      [null as number | null, Validators.required],
    fechaSolicitada: ['', Validators.required],
    horaInicio:      ['', Validators.required],
    horaFinalizacion:['', Validators.required],
    modalidad:       ['' as Modalidad | '', Validators.required],
    descripcionCita: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
  });

  ngOnInit(): void {
    this.cargarClientes();
    this.cargarProfesionales();
    this.cargarServicios();
  }

  cargarClientes(): void {
    this.usuarioService.listar({ rol: 'CLIENTE' }).subscribe({
      next: (res) => this.clientes.set(res.data),
      error: () => this.notification.error('No se pudieron cargar los clientes.'),
    });
  }

  cargarProfesionales(): void {
    this.profesionalService.listar({ disponibilidad: true }).subscribe({
      next: (res) => this.profesionales.set(res.data),
      error: () => this.notification.error('No se pudieron cargar los profesionales.'),
    });
  }

  cargarServicios(): void {
    //Este lo arrelo la IA, me daba error sin el AS ANY, FULL IA 100%
    // 'estado' is not part of the Servicio listar filter type; assert any to avoid TS error
    this.servicioService.listar({ estado: true } as any).subscribe({
      next: (res) => this.servicios.set(res.data),
      error: () => this.notification.error('No se pudieron cargar los servicios.'),
    });
  }

  // Convierte "HH:mm" a un Date ISO para el backend
  private horaADate(fecha: string, hora: string): string {
    return new Date(`${fecha}T${hora}:00`).toISOString();
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    const v = this.form.value;
    const fecha = v.fechaSolicitada!;

    this.citaService.crear({
      idCliente:        v.idCliente!,
      idProfesional:    v.idProfesional!,
      idServicio:       v.idServicio!,
      fechaSolicitada:  new Date(fecha).toISOString(),
      horaInicio:       this.horaADate(fecha, v.horaInicio!),
      horaFinalizacion: this.horaADate(fecha, v.horaFinalizacion!),
      modalidad:        v.modalidad as Modalidad,
      descripcionCita:  v.descripcionCita!,
      montoTotal:       0, // el backend lo calcula con el precio del servicio
    }).subscribe({
      next: () => {
        this.notification.success('Cita registrada correctamente.', null, 3000, '/admin/citas');
      },
      error: (err) => {
        const msg = err?.error?.message ?? 'No se pudo registrar la cita.';
        this.notification.error(msg);
        this.guardando.set(false);
      },
    });
  }

  hasError(campo: string, error: string): boolean {
    const control = this.form.get(campo);
    return !!(control?.hasError(error) && control?.touched);
  }
}