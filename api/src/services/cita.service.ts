import { prisma } from "../config/prisma";
import { EstadoCita, Prisma } from "../../generated/prisma/client";
import { AppError } from "../utils/app-error";
import { CreateCitaDto } from "../dtos/cita.dto";

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
        profesional: {
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
  async crear(datos: CreateCitaDto) {
    // Validar que el servicio exista y obtener su precio para el monto
    const servicio = await prisma.servicio.findUnique({
      where: { idServicio: datos.idServicio },
    });
    if (!servicio) {
      throw AppError.notFound("El servicio indicado no existe");
    }

    // Validar que el cliente exista (selección válida de entidades relacionadas)
    const cliente = await prisma.usuario.findUnique({
      where: { idUsuario: datos.idCliente },
    });
    if (!cliente) {
      throw AppError.notFound("El cliente indicado no existe");
    }

    // Validar que el profesional exista
    const profesional = await prisma.perfilProfesional.findUnique({
      where: { idPerfilProfesional: datos.idProfesional },
    });
    if (!profesional) {
      throw AppError.notFound("El profesional indicado no existe");
    }

    // Evitar doble reserva: mismo profesional, misma fecha y misma hora de inicio,
    // en citas todavía activas (Pendiente o Aceptada)
    const conflicto = await prisma.cita.findFirst({
      where: {
        idProfesional: datos.idProfesional,
        fechaSolicitada: datos.fechaSolicitada,
        horaInicio: datos.horaInicio,
        estado: { in: [EstadoCita.PENDIENTE, EstadoCita.ACEPTADA] },
      },
    });
    if (conflicto) {
      throw AppError.conflict(
        "El profesional ya tiene una cita en esa fecha y hora"
      );
    }

    return await prisma.cita.create({
      data: {
        fechaSolicitada: datos.fechaSolicitada,
        horaInicio: datos.horaInicio,
        horaFinalizacion: datos.horaFinalizacion,
        descripcionCita: datos.descripcionCita,
        modalidad: datos.modalidad,
        idCliente: datos.idCliente,
        idProfesional: datos.idProfesional,
        idServicio: datos.idServicio,
        // El backend calcula el monto según el servicio (requisito del enunciado)
        montoTotal: servicio.precio,
        // Estado inicial forzado por la rúbrica
        estado: EstadoCita.PENDIENTE,
      },
    });
  },
}; 