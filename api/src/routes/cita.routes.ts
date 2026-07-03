import { Router } from "express";
import { citaController } from "../controllers/cita.controller";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { createCitaSchema } from "../dtos/cita.dto";

export class CitaRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = citaController;


    router.get("/", controller.listar);
    

    router.get("/:id", controller.obtenerPorId);
    

    router.post("/", validateRequest(createCitaSchema), controller.crear);

    return router;
  }
}