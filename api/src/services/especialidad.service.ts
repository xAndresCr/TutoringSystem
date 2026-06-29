import { prisma } from "../config/prisma";
import { Prisma } from "../../generated/prisma/client";

export const especialidadService = {
  async listar(filtros: {search?: string; estado?: boolean}){

    //Asigna un objeto vacío, sirve para almacenar unicamente filtros válidos para especialidad 
    const where: Prisma.EspecialidadWhereInput = {};

    if(filtros.search){
      where.nombre = { contains: filtros.search };
    }

    if(filtros.estado !== undefined){
      where.estado = filtros.estado;
    }

    return await prisma.especialidad.findMany({
      where,
      orderBy: {nombre:"asc"},
    });
  }, 

     async cambiarEstado(idEspecialidad: number){
      const categoria = await prisma.especialidad.findUnique({
        where: {idEspecialidad},
      });

      if(!categoria) return null;

      return await prisma.especialidad.update({
        where: {idEspecialidad},
        data: {estado: !categoria.estado},
      });
    },

    
};
