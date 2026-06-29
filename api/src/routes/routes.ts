import { Router } from 'express';
import { CategoriaRoutes } from './categoria.routes';
import { EspecialidadRoutes } from "./especialidad.routes";
import {UsuarioRoutes} from "./usuario.routes";
import { ProfesionalRoutes } from "./PerfilProfesional.routes";
import { ServicioRoutes } from "./servicio.routes";
import { CitaRoutes } from "./cita.routes";

export class AppRoutes {
    static get routes(): Router {
        const router = Router();


        //Agregar las rutas de cada módulo
    
    router.use("/categorias", CategoriaRoutes.routes);
    router.use("/especialidades", EspecialidadRoutes.routes);
    router.use("/usuarios", UsuarioRoutes.routes);
    router.use("/profesionales", ProfesionalRoutes.routes);
    router.use("/servicios", ServicioRoutes.routes);
    router.use("/citas", CitaRoutes.routes);
        return router;
    }
}