import { Router } from "express";
import { servicioController } from "../controllers/servicio.controller";
import { validateRequest } from "../middlewares/validate-request.middleware";
import {
  createServicioSchema,
  updateServicioSchema,
} from "../dtos/servicio.dto";

export class ServicioRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = servicioController;

    router.get("/", controller.listar);
    router.get("/:id", controller.obtenerPorId);
    router.post("/", validateRequest(createServicioSchema), controller.crear);
    router.put("/:id", validateRequest(updateServicioSchema), controller.editar);
    router.patch("/:id/estado", controller.cambiarEstado);

    return router;
  }
}