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
import { EspecialidadesList } from './pages/espacialidades/especialidades-list/especialidades-list';
import { ServicioList } from './pages/servicios/servicio-list/servicio-list';
import { ServicioCreatePage } from './pages/servicios/servicio-create-page/servicio-create-page';
import { ServicioEditPage } from './pages/servicios/servicio-edit-page/servicio-edit-page';
import { ServicioDetail } from './pages/servicios/servicio-detail/servicio-detail';
import { CitaList } from './pages/citas/cita-list/cita-list';
import { CitaCreatePage } from './pages/citas/cita-create-page/cita-create-page';
import { CitaCreateDetail } from './pages/citas/cita-create-detail/cita-create-detail';

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
      { path: 'admin/servicios', component: ServicioList, title: 'Gestión de servicios' },
      { path: 'admin/servicios/crear', component: ServicioCreatePage, title: 'Crear servicio' },
      { path: 'admin/servicios/editar/:id', component: ServicioEditPage, title: 'Editar servicio' },
      { path: 'admin/servicios/:id', component: ServicioDetail, title: 'Detalle de servicio' },
      { path: 'admin/categorias', component: CategoriasList, title: 'Gestión de categorías' },
      { path: 'admin/especialidades', component: EspecialidadesList, title: 'Gestión de especialidades' },
      { path: 'admin/citas', component: CitaList, title: 'Gestión de citas' },
      { path: 'admin/citas/crear', component: CitaCreatePage, title: 'Registrar cita' },
      { path: 'admin/citas/:id', component: CitaCreateDetail, title: 'Detalle de cita' },
      { path: 'admin/usuarios', component: UsuariosList, title: 'Gestión de usuarios' },

      // Cada dev reemplaza PlaceholderPage por su componente real y agrega
      
      // aquí sus rutas de detalle/crear/editar (ej. 'admin/profesionales/crear').
    ],
  },
  { path: '**', redirectTo: '' },
];
