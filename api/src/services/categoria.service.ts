import { prisma } from "../config/prisma";
import { Prisma } from "../../generated/prisma/client";

export const categoriaService = {
  async listar(filtros: {search?: string; estado?: boolean}){

    //Asigna un objeto vacío, sirve para almacenar unicamente filtros válidos para categoría 
    const where: Prisma.CategoriaWhereInput = {};

    if(filtros.search){
      where.nombre = { contains: filtros.search };
    }

    if(filtros.estado !== undefined){
      where.estado = filtros.estado;
    }

    return await prisma.categoria.findMany({
      where,
      orderBy: {nombre:"asc"},
    });
  }, 

     async cambiarEstado(idCategoria: number){
      const categoria = await prisma.categoria.findUnique({
        where: {idCategoria},
      });

      if(!categoria) return null;

      return await prisma.categoria.update({
        where: {idCategoria},
        data: {estado: !categoria.estado},
      });
    },

    
};


