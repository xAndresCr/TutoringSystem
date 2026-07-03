import { z } from "zod";

export const createPerfilProfesionalSchema = z.object({
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

    imagen: z
        .string()
        .trim()
        .max(255)
        .optional(),

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

    idUsuario: z
        .number()
        .int()
        .positive("El usuario asociado es obligatorio"),

    especialidadIds: z
        .array(z.number().int().positive())
        .optional(),
});

export const updatePerfilProfesionalSchema =
    createPerfilProfesionalSchema.partial();

export type CreatePerfilProfesionalDto = z.infer<
    typeof createPerfilProfesionalSchema
>;
export type UpdatePerfilProfesionalDto = z.infer<
    typeof updatePerfilProfesionalSchema
>;
