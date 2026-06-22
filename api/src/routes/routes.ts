import { Router } from 'express';
import { CategoriaRoutes } from './categoria.routes';

export class AppRoutes {
    static get routes(): Router {
        const router = Router();

        //Agregar las rutas de cada módulo
        router.use("/categorias", CategoriaRoutes.routes);

        return router;
    }
}