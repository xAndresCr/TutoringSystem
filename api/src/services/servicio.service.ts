import { prisma } from "../config/prisma";
import { Prisma, EstadoCita } from "../../generated/prisma/client";
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
        // IDs escalares necesarios para precargar los selects en el formulario de edición
        idCategoria: true,
        idProfesional: true,
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

  // 4. EDITAR SERVICIO (incluye re-sincronización de especialidades)
  async editar(idServicio: number, datos: UpdateServicioDto) {
    const { especialidadIds, ...servicio } = datos;

    // Todo dentro de una transacción para mantener consistencia entre el
    // servicio y su tabla puente de especialidades.
    return await prisma.$transaction(async (tx) => {
      const actualizado = await tx.servicio.update({
        where: { idServicio },
        data: servicio as Prisma.ServicioUncheckedUpdateInput,
      });

      // Solo re-sincronizamos si el cliente envió el arreglo (aunque venga vacío).
      // Si viene undefined, no se toca la relación existente.
      if (especialidadIds !== undefined) {
        // 1) Se borran los vínculos actuales del servicio
        await tx.especialidadServicio.deleteMany({ where: { idServicio } });

        // 2) Se crean los nuevos vínculos seleccionados
        if (especialidadIds.length > 0) {
          await tx.especialidadServicio.createMany({
            data: especialidadIds.map((idEspecialidad) => ({
              idServicio,
              idEspecialidad,
            })),
          });
        }
      }

      return actualizado;
    });
  },

  // 6. PROFESIONALES QUE PUEDEN BRINDAR UN SERVICIO
  //    Devuelve los profesionales disponibles cuyo perfil cubre TODAS las
  //    especialidades exigidas por el servicio. Opcionalmente excluye a quienes
  //    ya tienen una cita activa en la fecha/hora indicada.
  async profesionalesParaServicio(
    idServicio: number,
    fecha?: string,
    horaInicio?: string
  ) {
    const servicio = await prisma.servicio.findUnique({
      where: { idServicio },
      select: {
        idServicio: true,
        especialidades: { select: { idEspecialidad: true } },
      },
    });

    if (!servicio) return null;

    const especialidadIds = servicio.especialidades.map((e) => e.idEspecialidad);

    const where: Prisma.PerfilProfesionalWhereInput = {
      disponibilidad: true,
      usuario: { estado: true },
    };

    // El profesional debe tener TODAS las especialidades del servicio.
    // Se traduce a un AND de condiciones "some" (una por cada especialidad).
    if (especialidadIds.length > 0) {
      where.AND = especialidadIds.map((idEspecialidad) => ({
        especialidades: { some: { idEspecialidad } },
      }));
    }

    // Filtro opcional de disponibilidad horaria: excluye profesionales con una
    // cita activa (Pendiente o Aceptada) en esa misma fecha y hora de inicio.
    if (fecha && horaInicio) {
      const fechaDate = new Date(fecha);
      const horaDate = new Date(horaInicio);
      if (!isNaN(fechaDate.getTime()) && !isNaN(horaDate.getTime())) {
        where.NOT = {
          citas: {
            some: {
              fechaSolicitada: fechaDate,
              horaInicio: horaDate,
              estado: { in: [EstadoCita.PENDIENTE, EstadoCita.ACEPTADA] },
            },
          },
        };
      }
    }

    return await prisma.perfilProfesional.findMany({
      where,
      orderBy: { titulo: "asc" },
      select: {
        idPerfilProfesional: true,
        titulo: true,
        modalidad: true,
        tarifaBase: true,
        disponibilidad: true,
        usuario: {
          select: {
            nombre: true,
            apellidos: true,
          },
        },
      },
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