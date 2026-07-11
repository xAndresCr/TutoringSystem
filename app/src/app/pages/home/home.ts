import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface Slide {
  image: string;
  titulo: string;
  subtitulo: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  // Las imágenes van en app/public/banner/ y se referencian sin "public"
  slides: Slide[] = [
    {
      image: 'banner/mate.jpg',
      titulo: 'Encuentra al tutor ideal',
      subtitulo: 'Profesionales por especialidad, listos para ayudarte a aprender.',
    },
    {
      image: 'banner/mother-teaching-girl-draw.jpg',
      titulo: 'Aprende a tu ritmo',
      subtitulo: 'Clases virtuales o presenciales, según lo que prefieras.',
    },
    {
      image: 'banner/progra.jpg',
      titulo: 'Reserva en minutos',
      subtitulo: 'Elige el servicio, la fecha y la hora. Así de simple.',
    },
  ];

  actual = signal(0);
  private timer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.iniciarAuto();
  }

  ngOnDestroy(): void {
    this.detenerAuto();
  }

  // Públicos porque el template los usa (mouseenter/mouseleave)
  iniciarAuto(): void {
    this.detenerAuto();
    this.timer = setInterval(() => this.siguiente(), 5000);
  }

  detenerAuto(): void {
    if (this.timer) clearInterval(this.timer);
  }

  siguiente(): void {
    this.actual.update((i) => (i + 1) % this.slides.length);
  }

  anterior(): void {
    this.actual.update((i) => (i - 1 + this.slides.length) % this.slides.length);
  }

  irA(i: number): void {
    this.actual.set(i);
    this.iniciarAuto(); // reinicia el temporizador al interactuar
  }
}