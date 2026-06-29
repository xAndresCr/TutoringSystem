import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { especialidadService } from "../services/especialidad.service";

export const especialidadController = {
  listar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, estado } = req.query;

      const filtros: { search?: string; estado?: boolean } = {};

      if (typeof search === "string" && search.trim() !== "") {
        filtros.search = search.trim();
      }
      if (estado === "true") filtros.estado = true;
      else if (estado === "false") filtros.estado = false;

      const especialidades = await especialidadService.listar(filtros);

      return res.status(StatusCodes.OK).json({
        success: true,
        data: especialidades,
      });
    } catch (error) {
      console.log("Error en especialidadController.listar:", error);
      next(error);
    }
  },

  cambiarEstado: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idEspecialidad = Number(req.params.id);

      if (!Number.isInteger(idEspecialidad) || idEspecialidad <= 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "El id de la especialidad no es válido.",
        });
      }

      const especialidad =
        await especialidadService.cambiarEstado(idEspecialidad);

      if (!especialidad) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Especialidad no encontrada.",
        });
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        data: especialidad,
      });
    } catch (error) {
      console.log("Error en especialidadController.cambiarEstado:", error);
      next(error);
    }
  },
};
