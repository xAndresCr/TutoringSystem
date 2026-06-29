import { Router } from "express";
import { servicioController } from "../controllers/servicio.controller";

export class ServicioRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = servicioController;

    router.get("/", controller.listar);
    router.get("/:id", controller.obtenerPorId);
    router.post("/", controller.crear);
    router.put("/:id", controller.editar);
    router.patch("/:id/estado", controller.cambiarEstado);

    return router;
  }
}