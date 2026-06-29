import { prisma } from "../config/prisma";
import { Prisma } from "../../generated/prisma/client";

export const servicioService = {
  // 1. LISTAR SERVICIOS (Con búsqueda por nombre y filtro de estado)
  async listar(filtros: { search?: string; estado?: boolean }) {
    const where: Prisma.ServicioWhereInput = {};

    // Filtro por estado activo/inactivo
    if (filtros.estado !== undefined) {
      where.estado = filtros.estado;
    }

    // Búsqueda por coincidencia en el nombre o descripción del servicio
    if (filtros.search) {
      where.OR = [
        { nombre: { contains: filtros.search } },
        { descripcion: { contains: filtros.search } }
      ];
    }

    return await prisma.servicio.findMany({
      where,
      orderBy: {
        nombre: "asc",
      },
      // Proyección para retornar solo los datos limpios y su relación
      select: {
        idServicio: true,
        nombre: true,
        descripcion: true,
        estado: true,
        // Incluimos la categoría a la que pertenece el servicio
        categoria: {
          select: {
            idCategoria: true,
            nombre: true
          }
        }
      }
    });
  },

  // 2. OBTENER DETALLE DE UN SERVICIO
  async obtenerPorId(idServicio: number) {
    return await prisma.servicio.findUnique({
      where: { idServicio },
      select: {
        idServicio: true,
        nombre: true,
        descripcion: true,
        estado: true,
        categoria: {
          select: {
            idCategoria: true,
            nombre: true
          }
        }
      }
    });
  },

  // 3. CREAR SERVICIO
  async crear(datos: Prisma.ServicioCreateInput) {
    return await prisma.servicio.create({
      data: datos,
    });
  },

  // 4. EDITAR SERVICIO
  async editar(idServicio: number, datos: Prisma.ServicioUpdateInput) {
    return await prisma.servicio.update({
      where: { idServicio },
      data: datos,
    });
  },

  // 5. CAMBIAR ESTADO LÓGICO (Activar / Desactivar)
  async cambiarEstado(idServicio: number) {
    const servicio = await prisma.servicio.findUnique({
      where: { idServicio },
    });

    if (!servicio) return null;

    return await prisma.servicio.update({
      where: { idServicio },
      data: { estado: !servicio.estado },
    });
  },
};