import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MenuItem } from '../main-layout/main-layout';

type Role = 'CLIENTE' | 'ADMIN';
interface User {
  nombre: string;
  role: Role;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  publicMenu = input.required<MenuItem[]>();
  adminMaintenanceMenu = input.required<MenuItem[]>();
  adminManagementMenu = input.required<MenuItem[]>();
  currentUser = input<User | null>(null);
  isAdmin = input(false);
  canShowItem = input.required<(item: MenuItem) => boolean>();
  loginClient = output<void>();
  loginAdmin = output<void>();
  logoutUser = output<void>();
}
