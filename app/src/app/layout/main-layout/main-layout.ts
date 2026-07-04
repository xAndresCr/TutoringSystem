import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

type Role = 'CLIENTE' | 'ADMIN';

export interface MenuItem {
  label: string;
  path: string;
  icon: string;
  roles?: Role[];
}

interface User {
  nombre: string;
  role: Role;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  // Sesión demo (la autenticación real es de una etapa posterior)
  currentUser = signal<User | null>(null);

  publicMenu = signal<MenuItem[]>([
    { label: 'Inicio', path: '/', icon: 'home' },
    { label: 'Profesionales', path: '/profesionales', icon: 'school' },
    { label: 'Servicios', path: '/servicios', icon: 'menu_book' },
    { label: 'Mis citas', path: '/citas', icon: 'event', roles: ['CLIENTE', 'ADMIN'] },
  ]);

  adminMaintenanceMenu = signal<MenuItem[]>([
    { label: 'Profesionales', path: '/admin/profesionales', icon: 'school' },
    { label: 'Servicios', path: '/admin/servicios', icon: 'menu_book' },
    { label: 'Categorías', path: '/admin/categorias', icon: 'category' },
    { label: 'Especialidades', path: '/admin/especialidades', icon: 'workspace_premium' },
  ]);

  adminManagementMenu = signal<MenuItem[]>([
    { label: 'Citas', path: '/admin/citas', icon: 'event_note' },
    { label: 'Usuarios', path: '/admin/usuarios', icon: 'group' },
  ]);

  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');

  canShowItem(item: MenuItem): boolean {
    if (!item.roles) return true;
    const user = this.currentUser();
    return !!user && item.roles.includes(user.role);
  }

  loginAsClient(): void {
    this.currentUser.set({ nombre: 'Cliente Demo', role: 'CLIENTE' });
  }
  loginAsAdmin(): void {
    this.currentUser.set({ nombre: 'Admin Demo', role: 'ADMIN' });
  }
  logout(): void {
    this.currentUser.set(null);
  }
}
