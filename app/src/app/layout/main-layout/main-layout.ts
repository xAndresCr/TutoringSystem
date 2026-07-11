import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
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
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    Header,
    Footer,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  private breakpoints = inject(BreakpointObserver);

  // true cuando el ancho es de escritorio (>= 981px)
  isDesktop = toSignal(
    this.breakpoints.observe('(min-width: 981px)').pipe(map((r) => r.matches)),
    { initialValue: true },
  );

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

  // Cierra el menú tras navegar solo en móvil (modo over)
  closeOnMobile(sidenav: MatSidenav): void {
    if (!this.isDesktop()) sidenav.close();
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
