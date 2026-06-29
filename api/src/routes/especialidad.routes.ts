import { Router } from "express";
import { especialidadController } from "../controllers/especialidad.controller";

export class EspecialidadRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = especialidadController;

    router.get("/", controller.listar);
    router.patch("/:id/estado", controller.cambiarEstado);

    return router;
  }
}