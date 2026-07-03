import { prisma } from "../config/prisma";
import { Prisma, Rol } from "../../generated/prisma/client";
import bcrypt from "bcryptjs";
import { AppError } from "../utils/app-error";
import {
  CreatePerfilProfesionalDto,
  UpdatePerfilProfesionalDto,
} from "../dtos/perfilProfesional.dto";

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
        // Campos del Perfil Profesional
        titulo: true,
        descripcion: true,
        annosExperiencia: true,
        tarifaBase: true,
        disponibilidad: true,
        modalidad: true,
        provincia: true,
        canton: true,
        distrito: true,
        idUsuario: true, // Se mantiene el ID como referencia técnica si se requiere para el estado interno
        
        // Relación filtrada: Solo expone nombre, apellidos y correo electrónico
        usuario: {
          select: {
            nombre: true,
            apellidos: true,
            correo: true
          }
        },

        // Especialidades asociadas, aquíe entra a la tabla intermedia
        especialidades:{
          select:{
      // Saltamos el ID de la tabla intermedia y vamos a la relación de la especialidad asociada al profesional
            especialidad:{
              select:{
                nombre: true,
              }
            }
          }
        }
        
      }
    });
  },

  // 3. CREAR (Usuario rol PROFESIONAL + su Perfil, en una sola operación)
  async crear(datos: CreatePerfilProfesionalDto) {
    const { nombre, apellidos, correo, telefono, password, especialidadIds, ...perfil } =
      datos;

    // Correo único
    const correoNormalizado = correo.toLowerCase();
    const existente = await prisma.usuario.findUnique({
      where: { correo: correoNormalizado },
    });
    if (existente) {
      throw AppError.conflict("Ya existe un usuario registrado con ese correo");
    }

    // Hash de la contraseña (auth se implementa en etapas siguientes)
    const passwordHash = await bcrypt.hash(password, 10);

    return await prisma.usuario.create({
      data: {
        nombre,
        apellidos,
        correo: correoNormalizado,
        telefono,
        password: passwordHash,
        rol: Rol.PROFESIONAL,
        // Nested create: crea el perfil junto con el usuario (transaccional por defecto)
        perfil: {
          create: {
            ...perfil,
            ...(especialidadIds && especialidadIds.length > 0
              ? {
                  especialidades: {
                    create: especialidadIds.map((idEspecialidad) => ({
                      especialidad: { connect: { idEspecialidad } },
                    })),
                  },
                }
              : {}),
          },
        },
      },
      // No devolvemos el hash de la contraseña
      omit: { password: true },
      include: { perfil: true },
    });
  },

  // 4. EDITAR
  async editar(
    idPerfilProfesional: number,
    datos: UpdatePerfilProfesionalDto
  ) {
    // No se re-sincronizan especialidades en la edición (acción aparte)
    const { especialidadIds, ...perfil } = datos;

    return await prisma.perfilProfesional.update({
      where: { idPerfilProfesional },
      data: perfil as Prisma.PerfilProfesionalUncheckedUpdateInput,
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