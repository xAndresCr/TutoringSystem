import { Router } from "express";
import { citaController } from "../controllers/cita.controller";

export class CitaRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = citaController;


    router.get("/", controller.listar);
    

    router.get("/:id", controller.obtenerPorId);
    

    router.post("/", controller.crear);

    return router;
  }
}