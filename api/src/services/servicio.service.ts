import { prisma } from "../config/prisma";
import { Prisma } from "../../generated/prisma/client";
import { CreateServicioDto, UpdateServicioDto } from "../dtos/servicio.dto";

export const servicioService = {
  // 1. LISTAR SERVICIOS (búsqueda por nombre y filtros por categoría, modalidad, rango de precio y estado)
  async listar(filtros: {
    search?: string;
    estado?: boolean;
    idCategoria?: number;
    modalidad?: string;
    precioMin?: number;
    precioMax?: number;
  }) {
    const where: Prisma.ServicioWhereInput = {};

    // Filtro por estado activo/inactivo
    if (filtros.estado !== undefined) {
      where.estado = filtros.estado;
    }

    // Filtro por categoría
    if (filtros.idCategoria) {
      where.idCategoria = filtros.idCategoria;
    }

    // Filtro por modalidad
    if (filtros.modalidad) {
      where.modalidad = filtros.modalidad as any;
    }

    // Filtro por rango de precio
    if (filtros.precioMin !== undefined || filtros.precioMax !== undefined) {
      where.precio = {};
      if (filtros.precioMin !== undefined) where.precio.gte = filtros.precioMin;
      if (filtros.precioMax !== undefined) where.precio.lte = filtros.precioMax;
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
      // Columnas que pide el listado: Nombre, Profesional, Categoría, Precio, Modalidad, Estado
      select: {
        idServicio: true,
        nombre: true,
        precio: true,
        modalidad: true,
        estado: true,
        categoria: {
          select: {
            idCategoria: true,
            nombre: true
          }
        },
        profesional: {
          select: {
            titulo: true,
            usuario: {
              select: {
                nombre: true,
                apellidos: true
              }
            }
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
        precio: true,
        duracionMinutos: true,
        modalidad: true,
        estado: true,
        categoria: {
          select: {
            idCategoria: true,
            nombre: true
          }
        },
        profesional: {
          select: {
            idPerfilProfesional: true,
            titulo: true,
            usuario: {
              select: {
                nombre: true,
                apellidos: true
              }
            }
          }
        },
        // Especialidades asociadas vía tabla puente
        especialidades: {
          select: {
            especialidad: {
              select: {
                idEspecialidad: true,
                nombre: true
              }
            }
          }
        }
      }
    });
  },

  // 3. CREAR SERVICIO
  async crear(datos: CreateServicioDto) {
    const { especialidadIds, ...servicio } = datos;

    const data: Prisma.ServicioUncheckedCreateInput = {
      ...servicio,
      // Si vienen especialidades, se crean las filas de la tabla puente
      ...(especialidadIds && especialidadIds.length > 0
        ? {
            especialidades: {
              create: especialidadIds.map((idEspecialidad) => ({
                especialidad: { connect: { idEspecialidad } },
              })),
            },
          }
        : {}),
    };

    return await prisma.servicio.create({ data });
  },

  // 4. EDITAR SERVICIO
  async editar(idServicio: number, datos: UpdateServicioDto) {
    // No se re-sincronizan especialidades en la edición (acción aparte)
    const { especialidadIds, ...servicio } = datos;

    return await prisma.servicio.update({
      where: { idServicio },
      data: servicio as Prisma.ServicioUncheckedUpdateInput,
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