import { Router } from "express";
import { usuarioController } from "../controllers/usuario.controller";

export class UsuarioRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = usuarioController;

    router.get("/", controller.listar);
    router.patch("/:id/estado", controller.cambiarEstado);

    return router;
  }
}