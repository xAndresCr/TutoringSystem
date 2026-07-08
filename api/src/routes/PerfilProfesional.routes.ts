import { Router } from "express";
import { profesionalController } from "../controllers/PerfilProfessional.controller";
import { validateRequest } from "../middlewares/validate-request.middleware";
import {
  createPerfilProfesionalSchema,
  updatePerfilProfesionalSchema,
} from "../dtos/perfilProfesional.dto";

export class ProfesionalRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = profesionalController;

    router.get("/", controller.listar);
    router.get("/:id", controller.obtenerPorId);
    router.post(
      "/",
      validateRequest(createPerfilProfesionalSchema),
      controller.crear
    );
    router.put(
      "/:id",
      validateRequest(updatePerfilProfesionalSchema),
      controller.editar
    );
    router.patch("/:id/disponibilidad", controller.cambiarDisponibilidad);

    return router;
  }
}