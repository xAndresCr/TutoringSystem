import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './pages/home/home';
import { PlaceholderPage } from './shared/components/placeholder-page/placeholder-page';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: Home, title: 'Inicio' },

      // Cara pública (cliente)
      { path: 'profesionales', component: PlaceholderPage, title: 'Profesionales' },
      { path: 'servicios', component: PlaceholderPage, title: 'Servicios' },
      { path: 'citas', component: PlaceholderPage, title: 'Mis citas' },

      // Administración / mantenimientos
      { path: 'admin/profesionales', component: PlaceholderPage, title: 'Gestión de profesionales' },
      { path: 'admin/servicios', component: PlaceholderPage, title: 'Gestión de servicios' },
      { path: 'admin/categorias', component: PlaceholderPage, title: 'Gestión de categorías' },
      { path: 'admin/especialidades', component: PlaceholderPage, title: 'Gestión de especialidades' },
      { path: 'admin/citas', component: PlaceholderPage, title: 'Gestión de citas' },
      { path: 'admin/usuarios', component: PlaceholderPage, title: 'Gestión de usuarios' },

      // Cada dev reemplaza PlaceholderPage por su componente real y agrega
      // aquí sus rutas de detalle/crear/editar (ej. 'admin/profesionales/crear').
    ],
  },
  { path: '**', redirectTo: '' },
];
