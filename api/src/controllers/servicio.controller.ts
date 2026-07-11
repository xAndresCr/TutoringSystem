import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { servicioService } from "../services/servicio.service";

export const servicioController = {
  // 1. LISTAR
  listar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, estado, idCategoria, modalidad, precioMin, precioMax } = req.query;
      const filtros: {
        search?: string;
        estado?: boolean;
        idCategoria?: number;
        modalidad?: string;
        precioMin?: number;
        precioMax?: number;
      } = {};

      if (typeof search === "string" && search.trim() !== "") {
        filtros.search = search.trim();
      }
      if (estado === "true") filtros.estado = true;
      else if (estado === "false") filtros.estado = false;

      if (idCategoria && !isNaN(Number(idCategoria))) {
        filtros.idCategoria = Number(idCategoria);
      }
      if (typeof modalidad === "string" && modalidad.trim() !== "") {
        filtros.modalidad = modalidad.trim();
      }
      if (precioMin && !isNaN(Number(precioMin))) {
        filtros.precioMin = Number(precioMin);
      }
      if (precioMax && !isNaN(Number(precioMax))) {
        filtros.precioMax = Number(precioMax);
      }

      const servicios = await servicioService.listar(filtros);
      return res.status(StatusCodes.OK).json({ success: true, data: servicios });
    } catch (error) {
      console.log("Error en servicioController.listar:", error);
      next(error);
    }
  },

  // 2. DETALLE
  obtenerPorId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);

      const servicio = await servicioService.obtenerPorId(id);
      if (!servicio) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Servicio no encontrado." });
      }

      return res.status(StatusCodes.OK).json({ success: true, data: servicio });
    } catch (error) {
      next(error);
    }
  },

  // 3. CREAR
  crear: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nuevoServicio = await servicioService.crear(req.body);
      return res.status(StatusCodes.CREATED).json({ success: true, data: nuevoServicio });
    } catch (error) {
      next(error);
    }
  },

  // 4. EDITAR
  editar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);

      const servicioEditado = await servicioService.editar(id, req.body);
      return res.status(StatusCodes.OK).json({ success: true, data: servicioEditado });
    } catch (error) {
      next(error);
    }
  },

  // 6. PROFESIONALES DISPONIBLES PARA UN SERVICIO
  profesionalesDisponibles: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const { fecha, horaInicio } = req.query;

      const profesionales = await servicioService.profesionalesParaServicio(
        id,
        typeof fecha === "string" ? fecha : undefined,
        typeof horaInicio === "string" ? horaInicio : undefined
      );

      if (profesionales === null) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ success: false, message: "Servicio no encontrado." });
      }

      return res.status(StatusCodes.OK).json({ success: true, data: profesionales });
    } catch (error) {
      next(error);
    }
  },

  // 5. CAMBIAR ESTADO
  cambiarEstado: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);

      const servicio = await servicioService.cambiarEstado(id);
      if (!servicio) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Servicio no encontrado." });
      }

      return res.status(StatusCodes.OK).json({ success: true, data: servicio });
    } catch (error) {
      next(error);
    }
  },
};