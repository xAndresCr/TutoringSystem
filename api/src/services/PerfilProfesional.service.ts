import { prisma } from "../config/prisma";
import { Prisma } from "../../generated/prisma/client";

export const profesionalService = {
  // 1. LISTAR CON FILTROS Y RELACIÓN 
  async listar(filtros: { search?: string; modalidad?: string; disponibilidad?: boolean }) {
    const where: Prisma.PerfilProfesionalWhereInput = {};

    // Filtros directos de la tabla PerfilProfesional
    if (filtros.modalidad) {
      where.modalidad = filtros.modalidad as any; // Usamos as any por si es un Enum en Prisma
    }

    if (filtros.disponibilidad !== undefined) {
      where.disponibilidad = filtros.disponibilidad;
    }

    // Accedemos a la relación 'usuario' para buscar por nombre o apellidos
    if (filtros.search) {
      where.usuario = {
        OR: [
          { nombre: { contains: filtros.search } },
          { apellidos: { contains: filtros.search } }
        ]
      };
    }

   return await prisma.perfilProfesional.findMany({
      where,
      orderBy: {
        titulo: "asc",
      },
      // Usamos select para los datos que pide el Avance MiRey
      select: {
        titulo: true,          // Título profesional
        modalidad: true,       // Modalidad
        tarifaBase: true,      // Tarifa base
        disponibilidad: true,  // Disponibilidad
        usuario: {
          select: {
            nombre: true,      // Parte del Nombre Completo
            apellidos: true,   // Parte del Nombre Completo
          }
        }
      }
    });
  },

  // OBTENER DETALLE
  async obtenerPorId(idPerfilProfesional: number) {
    return await prisma.perfilProfesional.findUnique({
      where: { idPerfilProfesional },
      select: {
        titulo: true,
        modalidad: true,
        tarifaBase: true,
        disponibilidad: true,
        usuario: {
          select: {
            nombre: true,
            apellidos: true,
          }
        }
      }
    });
  },

  // 3. CREAR 
  async crear(datos: Prisma.PerfilProfesionalCreateInput) {
    return await prisma.perfilProfesional.create({
      data: datos,
    });
  },

  // 4. EDITAR
  async editar(idPerfilProfesional: number, datos: Prisma.PerfilProfesionalUpdateInput) {
    return await prisma.perfilProfesional.update({
      where: { idPerfilProfesional },
      data: datos,
    });
  },

  // 5. CAMBIAR DISPONIBILIDAD
  async cambiarDisponibilidad(idPerfilProfesional: number) {
    const perfil = await prisma.perfilProfesional.findUnique({
      where: { idPerfilProfesional },
    });

    if (!perfil) return null;

    return await prisma.perfilProfesional.update({
      where: { idPerfilProfesional },
      data: { disponibilidad: !perfil.disponibilidad },
    });
  },
};