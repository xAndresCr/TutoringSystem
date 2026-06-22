import { prisma } from "../config/prisma";


export const categoriaService = {
  async listar() {
    return await prisma.categoria.findMany();
  },
};


