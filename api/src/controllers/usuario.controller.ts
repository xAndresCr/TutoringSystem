import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { usuarioService } from "../services/usuario.service";
import { Rol } from "../../generated/prisma/enums";

export const usuarioController = {
  listar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, rolUsuario } = req.query;

      // 1. Hacemos que 'rolUsuario' sea opcional (?) en el tipado para evitar el error de compilación
      const filtros: { search?: string; rolUsuario?: Rol } = {};

      if (typeof search === "string" && search.trim() !== "") {
        filtros.search = search.trim();
      }

      // 2. Validamos que el rol recibido en la query realmente pertenezca al Enum de Prisma antes de asignarlo
      if (typeof rolUsuario === "string" && Object.values(Rol).includes(rolUsuario as Rol)) {
        filtros.rolUsuario = rolUsuario as Rol;
      }

      const usuarios = await usuarioService.listar(filtros);

      return res.status(StatusCodes.OK).json({
        success: true,
        data: usuarios,
      });
    } catch (error) {
      console.log("Error en usuarioController.listar:", error);
      next(error);
    }
  },

  cambiarEstado: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idusuario = Number(req.params.id);

      if (!Number.isInteger(idusuario) || idusuario <= 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          
          message: "El id del usuario no es válido.", 
        });
      }

      const usuario = await usuarioService.cambiarEstado(idusuario);

      if (!usuario) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
         
          message: "Usuario no encontrado.", 
        });
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        data: usuario,
      });
    } catch (error) {
      console.log("Error en usuarioController.cambiarEstado:", error);
      next(error);
    }
  },
};