import {Router} from "express";
import { categoriaController } from "../controllers/categoria.controller";

export class CategoriaRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = categoriaController;

        router.get("/", controller.listar);

        return router;
    }       
}