import { Component, input, output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

type Role = 'CLIENTE' | 'ADMIN';
interface User {
  nombre: string;
  role: Role;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  currentUser = input<User | null>(null);
  toggleSidenav = output<void>();
  loginClient = output<void>();
  loginAdmin = output<void>();
  logoutUser = output<void>();
}
