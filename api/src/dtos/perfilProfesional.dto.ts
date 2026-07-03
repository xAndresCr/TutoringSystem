import { z } from "zod";

// Campos propios del perfil (compartidos entre crear y editar)
const perfilFields = {
  titulo: z
    .string()
    .trim()
    .min(3, "El título profesional debe tener al menos 3 caracteres")
    .max(100, "El título profesional no puede superar 100 caracteres"),

  descripcion: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(255, "La descripción no puede superar 255 caracteres"),

  annosExperiencia: z
    .number({ message: "Los años de experiencia deben ser numéricos" })
    .int("Los años de experiencia deben ser un número entero")
    .min(0, "Los años de experiencia no pueden ser negativos")
    .max(80, "Los años de experiencia no son válidos"),

  tarifaBase: z
    .number({ message: "La tarifa base debe ser numérica" })
    .positive("La tarifa base debe ser mayor a 0"),

  disponibilidad: z.boolean().optional(),

  imagen: z.string().trim().max(255).optional(),

  modalidad: z.enum(["VIRTUAL", "PRESENCIAL", "MIXTA"], {
    message: "La modalidad debe ser VIRTUAL, PRESENCIAL o MIXTA",
  }),

  provincia: z
    .string()
    .trim()
    .min(1, "La provincia es obligatoria")
    .max(60, "La provincia no puede superar 60 caracteres"),

  canton: z
    .string()
    .trim()
    .min(1, "El cantón es obligatorio")
    .max(60, "El cantón no puede superar 60 caracteres"),

  distrito: z
    .string()
    .trim()
    .min(1, "El distrito es obligatorio")
    .max(60, "El distrito no puede superar 60 caracteres"),

  especialidadIds: z.array(z.number().int().positive()).optional(),
};

// CREAR: datos del usuario (rol PROFESIONAL) + datos del perfil
export const createPerfilProfesionalSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(45, "El nombre no puede superar 45 caracteres"),

  apellidos: z
    .string()
    .trim()
    .min(1, "Los apellidos son obligatorios")
    .max(90, "Los apellidos no pueden superar 90 caracteres"),

  correo: z
    .email("El correo no tiene un formato válido")
    .max(100, "El correo no puede superar 100 caracteres"),

  telefono: z
    .string()
    .trim()
    .min(1, "El teléfono es obligatorio")
    .max(20, "El teléfono no puede superar 20 caracteres"),

  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(255, "La contraseña no puede superar 255 caracteres"),

  ...perfilFields,
});

// EDITAR: solo campos del perfil (no toca datos del usuario)
export const updatePerfilProfesionalSchema = z.object(perfilFields).partial();

export type CreatePerfilProfesionalDto = z.infer<
  typeof createPerfilProfesionalSchema
>;
export type UpdatePerfilProfesionalDto = z.infer<
  typeof updatePerfilProfesionalSchema
>;
