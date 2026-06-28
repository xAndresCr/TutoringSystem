import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { categoriaService } from "../services/categoria.service";

export const categoriaController = {
  listar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, estado } = req.query;

      const filtros: { search?: string; estado?: boolean } = {};

      if (typeof search === "string" && search.trim() !== "") {
        filtros.search = search.trim();
      }
      if (estado === "true") filtros.estado = true;
      else if (estado === "false") filtros.estado = false;

      const categorias = await categoriaService.listar(filtros);

      return res.status(StatusCodes.OK).json({
       success: true,
        data: categorias,
      });
    } catch (error) {
      console.log("Error en categoriaController.listar:", error);
      next(error);
    }
  },

  cambiarEstado: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idCategoria = Number(req.params.id);

      if (!Number.isInteger(idCategoria) || idCategoria <= 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "El id de la categoría no es válido.",
        });
      }

      const categoria = await categoriaService.cambiarEstado(idCategoria);

      if (!categoria) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Categoría no encontrada.",
        });
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        data: categoria,
      });
    } catch (error) {
      console.log("Error en categoriaController.cambiarEstado:", error);
      next(error);
    }
  },
};
