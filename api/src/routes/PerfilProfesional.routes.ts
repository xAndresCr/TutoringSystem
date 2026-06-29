import { Router } from "express";
import { profesionalController } from "../controllers/perfilprofessional.controller";

export class ProfesionalRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = profesionalController;

    router.get("/", controller.listar);
    router.get("/:id", controller.obtenerPorId);
    router.post("/", controller.crear);
    router.put("/:id", controller.editar);
    router.patch("/:id/disponibilidad", controller.cambiarDisponibilidad);

    return router;
  }
}