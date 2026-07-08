import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './pages/home/home';
import { PlaceholderPage } from './shared/components/placeholder-page/placeholder-page';
import { CategoriasList } from './pages/categorias/categorias-list/categorias-list';
import { UsuariosList } from './pages/usuarios/usuarios-list/usuarios-list';
import { ProfesionalesList } from './pages/profesionales/profesionales-list/profesionales-list';
import { ProfesionalDetail } from './pages/profesionales/profesional-detail/profesional-detail';
import { ProfesionalCreate } from './pages/profesionales/profesional-create/profesional-create';
import { ProfesionalEdit } from './pages/profesionales/profesional-edit/profesional-edit';

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
      { path: 'admin/profesionales', component: ProfesionalesList, title: 'Gestión de profesionales' },
      { path: 'admin/profesionales/crear', component: ProfesionalCreate, title: 'Crear profesional' },
      { path: 'admin/profesionales/editar/:id', component: ProfesionalEdit, title: 'Editar profesional' },
      { path: 'admin/profesionales/:id', component: ProfesionalDetail, title: 'Detalle del profesional' },
      { path: 'admin/servicios', component: PlaceholderPage, title: 'Gestión de servicios' },
      { path: 'admin/categorias', component: CategoriasList, title: 'Gestión de categorías' },
      { path: 'admin/especialidades', component: PlaceholderPage, title: 'Gestión de especialidades' },
      { path: 'admin/citas', component: PlaceholderPage, title: 'Gestión de citas' },
      { path: 'admin/usuarios', component: UsuariosList, title: 'Gestión de usuarios' },

      // Cada dev reemplaza PlaceholderPage por su componente real y agrega
      // aquí sus rutas de detalle/crear/editar (ej. 'admin/profesionales/crear').
    ],
  },
  { path: '**', redirectTo: '' },
];
