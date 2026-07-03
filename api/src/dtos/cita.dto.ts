import { z } from "zod";

// El cliente NO envía montoTotal (lo calcula el backend según el servicio)
// ni estado (se fuerza PENDIENTE) ni comentarioProfesional (lo agrega el profesional después).
export const createCitaSchema = z
    .object({
        fechaSolicitada: z.coerce.date({
            message: "La fecha solicitada no es válida",
        }),

        horaInicio: z.coerce.date({
            message: "La hora de inicio no es válida",
        }),

        horaFinalizacion: z.coerce.date({
            message: "La hora de finalización no es válida",
        }),

        descripcionCita: z
            .string()
            .trim()
            .min(5, "La descripción de la necesidad debe tener al menos 5 caracteres")
            .max(255, "La descripción no puede superar 255 caracteres"),

        modalidad: z.enum(["VIRTUAL", "PRESENCIAL", "MIXTA"], {
            message: "La modalidad debe ser VIRTUAL, PRESENCIAL o MIXTA",
        }),

        idCliente: z
            .number()
            .int()
            .positive("El cliente es obligatorio"),

        idProfesional: z
            .number()
            .int()
            .positive("El profesional es obligatorio"),

        idServicio: z
            .number()
            .int()
            .positive("El servicio es obligatorio"),
    })
    .refine((data) => data.horaFinalizacion > data.horaInicio, {
        message: "La hora de finalización debe ser posterior a la hora de inicio",
        path: ["horaFinalizacion"],
    });

export type CreateCitaDto = z.infer<typeof createCitaSchema>;
