import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { citaService } from "../services/cita.service";
import { EstadoCita } from "../../generated/prisma/client";

export const citaController = {
  // 1. LISTAR CITAS CON FILTROS COMBINABLES
  listar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { estado, idProfesional, fechaInicio, fechaFin } = req.query;
      
      const filtros: { estado?: EstadoCita; idProfesional?: number; fechaInicio?: string; fechaFin?: string } = {};

      // Mapeo seguro del Query Param al ENUM de Prisma
      if (typeof estado === "string" && estado.trim() !== "") {
        filtros.estado = estado.trim() as EstadoCita;
      }
      
      // Mapeo del ID del profesional
      if (idProfesional) {
        filtros.idProfesional = Number(idProfesional);
      }
      
      // Filtros de fechas
      if (typeof fechaInicio === "string" && fechaInicio.trim() !== "") {
        filtros.fechaInicio = fechaInicio.trim();
      }
      if (typeof fechaFin === "string" && fechaFin.trim() !== "") {
        filtros.fechaFin = fechaFin.trim();
      }

      const citas = await citaService.listar(filtros);
      return res.status(StatusCodes.OK).json({ success: true, data: citas });
    } catch (error) {
      console.log("Error en citaController.listar:", error);
      next(error);
    }
  },

  // 2. OBTENER EL DETALLE DE UNA CITA POR ID
  obtenerPorId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);

      const cita = await citaService.obtenerPorId(id);
      if (!cita) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Cita no encontrada." });
      }

      return res.status(StatusCodes.OK).json({ success: true, data: cita });
    } catch (error) {
      console.log("Error en citaController.obtenerPorId:", error);
      next(error);
    }
  },

  // 3. REGISTRAR UNA NUEVA CITA
  crear: async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const nuevaCita = await citaService.crear(req.body);
      return res.status(StatusCodes.CREATED).json({ success: true, data: nuevaCita });
    } catch (error) {
      console.log("Error en citaController.crear:", error);
      next(error);
    }
  },
};