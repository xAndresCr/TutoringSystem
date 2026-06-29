import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { profesionalService } from "../services/PerfilProfesional.service";

export const profesionalController = {
  // 1. LISTAR
  listar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, modalidad, disponibilidad } = req.query;
      const filtros: { search?: string; modalidad?: string; disponibilidad?: boolean } = {};

      if (typeof search === "string" && search.trim() !== "") {
        filtros.search = search.trim();
      }
      if (typeof modalidad === "string" && modalidad.trim() !== "") {
        filtros.modalidad = modalidad.trim();
      }
      if (disponibilidad === "true") filtros.disponibilidad = true;
      else if (disponibilidad === "false") filtros.disponibilidad = false;

      const profesionales = await profesionalService.listar(filtros);
      return res.status(StatusCodes.OK).json({ success: true, data: profesionales });
    } catch (error) {
      console.log("Error en profesionalController.listar:", error);
      next(error);
    }
  },

  // 2. OBTENER DETALLE
  obtenerPorId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);

      const profesional = await profesionalService.obtenerPorId(id);
      if (!profesional) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Profesional no encontrado." });
      }

      return res.status(StatusCodes.OK).json({ success: true, data: profesional });
    } catch (error) {
      next(error);
    }
  },

  // 3. CREAR
  crear: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Directo al servicio; el DTO ya habrá limpiado/validado el req.body previamente
      const nuevoProfesional = await profesionalService.crear(req.body);
      return res.status(StatusCodes.CREATED).json({ success: true, data: nuevoProfesional });
    } catch (error) {
      next(error);
    }
  },

  // 4. EDITAR
  editar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);

      const profesionalEditado = await profesionalService.editar(id, req.body);
      return res.status(StatusCodes.OK).json({ success: true, data: profesionalEditado });
    } catch (error) {
      next(error);
    }
  },

  // 5. CAMBIAR DISPONIBILIDAD
  cambiarDisponibilidad: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);

      const profesional = await profesionalService.cambiarDisponibilidad(id);
      if (!profesional) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Profesional no encontrado." });
      }

      return res.status(StatusCodes.OK).json({ success: true, data: profesional });
    } catch (error) {
      next(error);
    }
  },
};