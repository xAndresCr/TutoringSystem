import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Usuario } from '../../../../core/models/usuario.model';
import { PerfilProfesional } from '../../../../core/models/perfil.profesional.model';
import { Servicio } from '../../../../core/models/servicio.model';
import { Modalidad } from '../../../../core/models/enums.model';
import { CitaService } from '../../../../core/services/cita.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { ServicioService } from '../../../../core/services/servicio.service';
import { NotificationService } from '../../../../core/services/notification.service';

interface Horario {
  value: string; // "HH:mm" en formato 24h para el backend
  label: string; // "7:00 a. m." para el usuario
}

@Component({
  selector: 'app-cita-create-page',
  providers: [provideNativeDateAdapter()],
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
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
  private readonly servicioService = inject(ServicioService);
  private readonly notification = inject(NotificationService);

  clientes = signal<Usuario[]>([]);
  servicios = signal<Servicio[]>([]);
  profesionales = signal<PerfilProfesional[]>([]);
  cargandoProfesionales = signal(false);
  guardando = signal(false);

  // Etiqueta legible de la hora de finalización calculada automáticamente
  horaFinLabel = signal<string>('');

  // Fecha mínima seleccionable: hoy (no se permiten fechas anteriores a la actual)
  readonly minDate = new Date();

  // Franjas de 30 min desde las 7:00 a. m. hasta las 6:30 p. m. (última cita)
  readonly horarios: Horario[] = this.generarHorarios();

  modalidades: Modalidad[] = ['VIRTUAL', 'PRESENCIAL', 'MIXTA'];
  modalidadLabels: Record<Modalidad, string> = {
    VIRTUAL: 'Virtual',
    PRESENCIAL: 'Presencial',
    MIXTA: 'Mixta',
  };

  form = this.fb.group({
    idCliente:        [null as number | null, Validators.required],
    idServicio:       [null as number | null, Validators.required],
    fechaSolicitada:  [null as Date | null, Validators.required],
    horaInicio:       ['', Validators.required],
    horaFinalizacion: ['', Validators.required], // se calcula automáticamente
    idProfesional:    [null as number | null, Validators.required],
    modalidad:        ['' as Modalidad | '', Validators.required],
    descripcionCita:  ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
  });

  ngOnInit(): void {
    this.cargarClientes();
    this.cargarServicios();

    // Al cambiar el servicio: sugerir modalidad, recalcular fin y recargar profesionales
    this.form.controls.idServicio.valueChanges.subscribe(() => {
      this.aplicarModalidadDelServicio();
      this.recalcularHoraFin();
      this.recargarProfesionales();
    });

    // Al cambiar la fecha: recargar profesionales disponibles en ese día
    this.form.controls.fechaSolicitada.valueChanges.subscribe(() => {
      this.recargarProfesionales();
    });

    // Al cambiar la hora de inicio: recalcular fin y recargar profesionales
    this.form.controls.horaInicio.valueChanges.subscribe(() => {
      this.recalcularHoraFin();
      this.recargarProfesionales();
    });
  }

  // ---------- Carga de catálogos ----------

  cargarClientes(): void {
    this.usuarioService.listar({ rol: 'CLIENTE' }).subscribe({
      next: (res) => this.clientes.set(res.data),
      error: () => this.notification.error('No se pudieron cargar los clientes.'),
    });
  }

  cargarServicios(): void {
    this.servicioService.listar({ estado: true } as any).subscribe({
      next: (res) => this.servicios.set(res.data),
      error: () => this.notification.error('No se pudieron cargar los servicios.'),
    });
  }

  // ---------- Lógica de disponibilidad ----------

  // Se puede intentar buscar profesionales una vez que hay servicio, fecha y hora
  get puedeBuscarProfesionales(): boolean {
    const { idServicio, fechaSolicitada, horaInicio } = this.form.controls;
    return !!idServicio.value && !!fechaSolicitada.value && !!horaInicio.value;
  }

  private recargarProfesionales(): void {
    const idServicio = this.form.controls.idServicio.value;

    // Sin servicio no hay nada que buscar
    if (!idServicio) {
      this.profesionales.set([]);
      return;
    }

    const fecha = this.form.controls.fechaSolicitada.value;
    const hora = this.form.controls.horaInicio.value;

    // Solo consultamos cuando ya se eligió servicio + fecha + hora
    if (!fecha || !hora) {
      this.profesionales.set([]);
      return;
    }

    const fechaStr = this.fechaAISO(fecha);
    const horaIso = this.horaADate(fechaStr, hora);

    this.cargandoProfesionales.set(true);
    this.servicioService.profesionalesParaServicio(idServicio, fechaStr, horaIso).subscribe({
      next: (res) => {
        this.profesionales.set(res.data);

        // Si el profesional ya elegido dejó de estar disponible, se limpia la selección
        const sel = this.form.controls.idProfesional.value;
        if (sel && !res.data.some((p) => p.idPerfilProfesional === sel)) {
          this.form.controls.idProfesional.setValue(null);
        }

        this.cargandoProfesionales.set(false);
      },
      error: () => {
        this.profesionales.set([]);
        this.cargandoProfesionales.set(false);
      },
    });
  }

  // Sugiere la modalidad del servicio seleccionado (el usuario puede cambiarla)
  private aplicarModalidadDelServicio(): void {
    const servicio = this.servicioSeleccionado();
    if (servicio?.modalidad) {
      this.form.controls.modalidad.setValue(servicio.modalidad, { emitEvent: false });
    }
  }

  // Calcula la hora de finalización = hora inicio + duración del servicio
  private recalcularHoraFin(): void {
    const servicio = this.servicioSeleccionado();
    const hora = this.form.controls.horaInicio.value;
    const controlInicio = this.form.controls.horaInicio;

    if (!servicio || !hora) {
      this.horaFinLabel.set('');
      this.form.controls.horaFinalizacion.setValue('', { emitEvent: false });
      this.limpiarError(controlInicio, 'fueraDeRango');
      return;
    }

    const [h, m] = hora.split(':').map(Number);
    const totalFin = h * 60 + m + servicio.duracionMinutos;

    const hf = Math.floor(totalFin / 60);
    const mf = totalFin % 60;
    const value = `${this.dosDigitos(hf)}:${this.dosDigitos(mf)}`;

    this.form.controls.horaFinalizacion.setValue(value, { emitEvent: false });

    // Regla del negocio: la atención no puede terminar después de las 7:00 p. m.
    if (totalFin > 19 * 60) {
      this.horaFinLabel.set('');
      controlInicio.setErrors({ ...(controlInicio.errors ?? {}), fueraDeRango: true });
    } else {
      this.horaFinLabel.set(this.formatoAmPm(hf, mf));
      this.limpiarError(controlInicio, 'fueraDeRango');
    }
  }

  private servicioSeleccionado(): Servicio | undefined {
    const id = this.form.controls.idServicio.value;
    return this.servicios().find((s) => s.idServicio === id);
  }

  // ---------- Helpers de fecha/hora ----------

  private generarHorarios(): Horario[] {
    const slots: Horario[] = [];
    // 7:00 a. m. (420 min) hasta 6:30 p. m. (1110 min), cada 30 minutos
    for (let min = 7 * 60; min <= 18 * 60 + 30; min += 30) {
      const h = Math.floor(min / 60);
      const m = min % 60;
      slots.push({
        value: `${this.dosDigitos(h)}:${this.dosDigitos(m)}`,
        label: this.formatoAmPm(h, m),
      });
    }
    return slots;
  }

  private formatoAmPm(h: number, m: number): string {
    const periodo = h < 12 ? 'a. m.' : 'p. m.';
    let h12 = h % 12;
    if (h12 === 0) h12 = 12;
    return `${h12}:${this.dosDigitos(m)} ${periodo}`;
  }

  private dosDigitos(n: number): string {
    return String(n).padStart(2, '0');
  }

  // Convierte un Date del datepicker a "YYYY-MM-DD" usando la fecha local
  private fechaAISO(fecha: Date): string {
    const y = fecha.getFullYear();
    const m = this.dosDigitos(fecha.getMonth() + 1);
    const d = this.dosDigitos(fecha.getDate());
    return `${y}-${m}-${d}`;
  }

  // Combina fecha "YYYY-MM-DD" + hora "HH:mm" en un ISO para el backend
  private horaADate(fecha: string, hora: string): string {
    return new Date(`${fecha}T${hora}:00`).toISOString();
  }

  private limpiarError(control: AbstractControl, error: string): void {
    if (control.errors?.[error]) {
      const { [error]: _omit, ...resto } = control.errors;
      control.setErrors(Object.keys(resto).length ? resto : null);
    }
  }

  // ---------- Guardado ----------

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;

    // Blindaje: si por alguna razón la hora de finalización no se calculó bien,
    // no intentamos construir una fecha inválida (evita que el formulario se cuelgue).
    const horaFin = v.horaFinalizacion ?? '';
    if (!/^\d{2}:\d{2}$/.test(horaFin)) {
      this.notification.error('No se pudo calcular la hora de finalización. Verifique el servicio y la hora de inicio.');
      return;
    }

    this.guardando.set(true);
    const fecha = this.fechaAISO(v.fechaSolicitada!);

    this.citaService.crear({
      idCliente:        v.idCliente!,
      idProfesional:    v.idProfesional!,
      idServicio:       v.idServicio!,
      fechaSolicitada:  fecha,
      horaInicio:       this.horaADate(fecha, v.horaInicio!),
      horaFinalizacion: this.horaADate(fecha, horaFin),
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
