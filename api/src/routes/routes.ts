import { Router } from 'express';
import { CategoriaRoutes } from './categoria.routes';
import { EspecialidadRoutes } from "./especialidad.routes";
import {UsuarioRoutes} from "./usuario.routes";
import { ProfesionalRoutes } from "./PerfilProfesional.routes";

export class AppRoutes {
    static get routes(): Router {
        const router = Router();


        //Agregar las rutas de cada módulo
    
    router.use("/categorias", CategoriaRoutes.routes);
    router.use("/especialidades", EspecialidadRoutes.routes);
    router.use("/usuarios", UsuarioRoutes.routes);
    router.use("/profesionales", ProfesionalRoutes.routes);
        return router;
    }
}