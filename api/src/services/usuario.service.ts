import { prisma } from "../config/prisma";
import { Prisma, Rol } from "../../generated/prisma/client";

export const usuarioService = {
  async listar(filtros: { search?: string; rol?: Rol }) {
    const where: Prisma.UsuarioWhereInput = {};

    if (filtros.search) {
        //Otra manera de que se pueda buscar por nombre, correo, y apellidos
      where.OR = [
        {nombre:{contains: filtros.search}},
        {apellidos:{contains:filtros.search}},
        {correo:{contains:filtros.search}}
      ]
    }

    if (filtros.rol !== undefined) {
      where.rol = filtros.rol;
    }

    return await prisma.usuario.findMany({
        where,
        orderBy:{
            nombre: "asc"
        },
        //Este select ayuda a traer unicamente lo que pide el enunciado

        select: {
            nombre: true,
            apellidos: true,
            correo: true,
            rol: true,
            estado: true,
        }
    });
  },

   async cambiarEstado(idUsuario: number){
      const usuario = await prisma.usuario.findUnique({
        where: {idUsuario},
      });

      if(!usuario) return null;

      return await prisma.usuario.update({
        where: {idUsuario},
        data: {estado: !usuario.estado},
      });
    },

};
