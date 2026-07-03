import { z } from "zod";

export const createServicioSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(100, "El nombre no puede superar 100 caracteres"),

    descripcion: z
        .string()
        .trim()
        .min(10, "La descripción debe tener al menos 10 caracteres")
        .max(255, "La descripción no puede superar 255 caracteres"),

    precio: z
        .number({ message: "El precio debe ser numérico" })
        .positive("El precio debe ser mayor a 0"),

    duracionMinutos: z
        .number({ message: "La duración debe ser numérica" })
        .int("La duración debe ser un número entero de minutos")
        .positive("La duración debe ser mayor a 0"),

    modalidad: z.enum(["VIRTUAL", "PRESENCIAL", "MIXTA"], {
        message: "La modalidad debe ser VIRTUAL, PRESENCIAL o MIXTA",
    }),

    estado: z.boolean().optional(),

    idProfesional: z
        .number()
        .int()
        .positive("El profesional dueño es obligatorio"),

    idCategoria: z
        .number()
        .int()
        .positive("La categoría es obligatoria"),

    especialidadIds: z
        .array(z.number().int().positive())
        .optional(),
});

export const updateServicioSchema = createServicioSchema.partial();

export type CreateServicioDto = z.infer<typeof createServicioSchema>;
export type UpdateServicioDto = z.infer<typeof updateServicioSchema>;
