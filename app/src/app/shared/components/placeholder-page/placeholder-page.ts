import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-placeholder-page',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './placeholder-page.html',
  styleUrl: './placeholder-page.css',
})
export class PlaceholderPage {
  private route = inject(ActivatedRoute);
  title = this.route.snapshot.title ?? 'Módulo';
}
