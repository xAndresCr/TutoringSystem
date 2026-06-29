import { prisma } from "../config/prisma";
import { EstadoCita, Prisma } from "../../generated/prisma/client";

export const citaService = {
  // 1. LISTAR CITAS CON FILTROS COMBINABLES
  async listar(filtros: { estado?: EstadoCita; idProfesional?: number; fechaInicio?: string; fechaFin?: string }) {
    const where: Prisma.CitaWhereInput = {};

    // Filtro por el ENUM de estado de la cita
    if (filtros.estado) {
      where.estado = filtros.estado;
    }

    // Filtro por profesional asociado
    if (filtros.idProfesional) {
      where.idProfesional = filtros.idProfesional;
    }

    // Filtro por rango de fechas
    if (filtros.fechaInicio || filtros.fechaFin) {
      where.fechaSolicitada = {};
      if (filtros.fechaInicio) {
        where.fechaSolicitada.gte = new Date(filtros.fechaInicio);
      }
      if (filtros.fechaFin) {
        where.fechaSolicitada.lte = new Date(filtros.fechaFin);
      }
    }

    return await prisma.cita.findMany({
      where,
      orderBy: {
        fechaSolicitada: "desc", // Ordena por la fecha solicitada de la cita
      },
      include: {
        // Relación al cliente (vía idCliente) para sacar el nombre en el listado
        cliente: {
          select: {
            nombre: true,
            apellidos: true,
          },
        },
        // Relación al perfil profesional (vía idProfesional)
        perfilProfesional: {
          select: {
            titulo: true,
            usuario: {
              select: {
                nombre: true,
                apellidos: true,
              },
            },
          },
        },
        // Relación al servicio
        servicio: {
          select: {
            nombre: true,
          },
        },
      },
    });
  },

  // 2. VISTA DETALLE DE CITA AJUSTADA
  async obtenerPorId(idCita: number) {
    return await prisma.cita.findUnique({
      where: { idCita }, 
      select: {
        // Traemos todos los campos
        fechaSolicitada: true,
        horaInicio: true,
        horaFinalizacion: true,
        modalidad: true,
        descripcionCita: true,
        montoTotal: true,
        estado: true,
        idCliente: true,
        idProfesional: true,
        idServicio: true,
        
        // Incluimos los datos limpios de las relaciones para las pantallas secundarias de Angular
        cliente: {
          select: {
            nombre: true,
            apellidos: true,
            correo: true,
          },
        },
        profesional: {
          select: {
            titulo: true,
            usuario: {
              select: {
                nombre: true,
                apellidos: true,
                correo: true,
              },
            },
          },
        },
        servicio: {
          select: {
            nombre: true,
          }
        },
      }
    });
  },

  // 3. CREAR CITA
  async crear(datos: Prisma.CitaUncheckedCreateInput) {
    return await prisma.cita.create({
      data: {
        ...datos,
        // Convertimos las fechas enviadas por el DTO a instancias válidas de Date
        fechaSolicitada: new Date(datos.fechaSolicitada),
        horaInicio: new Date(datos.horaInicio),
        horaFinalizacion: new Date(datos.horaFinalizacion),
        // Forzamos el estado por requerimiento obligatorio de la rúbrica
        estado: EstadoCita.PENDIENTE, 
      },
    });
  },
}; 