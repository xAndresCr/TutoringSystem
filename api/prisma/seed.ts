//import { Role } from "../generated/prisma";
import { EstadoCita, Modalidad, Rol } from "../generated/prisma/client";
import { prisma } from "../src/config/prisma";
async function main() {
  console.log("Iniciando seed...");
  // 1. Limpieza de datos

const models = [
  prisma.resenna,
  prisma.historialCita,
  prisma.cita,
  prisma.especialidadServicio,
  prisma.especialidadPerfil,
  prisma.servicio,
  prisma.especialidad,
  prisma.categoria,
  prisma.perfilProfesional,
  prisma.usuario,
];

for (const model of models) {
  await (model as any).deleteMany({});
}

  // 2. Creación de datos maestros (Independientes)

  //Categorías
  await prisma.categoria.createMany({
    data: [
      { nombre: "Matemáticas",   descripcion: "Tutorías en álgebra, cálculo, estadística y matemática discreta" },
      { nombre: "Programación",  descripcion: "Tutorías en desarrollo de software, algoritmos y estructuras de datos" },
      { nombre: "Idiomas",       descripcion: "Tutorías en inglés, francés, portugués y otros idiomas" },
      { nombre: "Ciencias",      descripcion: "Tutorías en física, química y biología" },
      { nombre: "Humanidades",   descripcion: "Tutorías en historia, filosofía, literatura y redacción", estado: false },
    ]
  });
//Especialidades
  await prisma.especialidad.createMany({
    data: [
      { nombre: "Cálculo Diferencial",   descripcion: "Límites, derivadas y aplicaciones" },
      { nombre: "Álgebra Lineal",        descripcion: "Matrices, vectores y transformaciones lineales" },
      { nombre: "Estadística",           descripcion: "Probabilidad y Estadística Inferencial, distribuciones y análisis de datos" },
      { nombre: "TypeScript",            descripcion: "Tipado estático, interfaces y generics" },
      { nombre: "Angular",               descripcion: "Desarrollo frontend con Angular y signals" },
      { nombre: "Node.js",               descripcion: "Desarrollo backend con Node.js y Express" },
      {nombre: "JavaScript",             descripcion: "Fundamentos de JavaScript, ES6+ y programación asíncrona" },
      { nombre: "Inglés Conversacional", descripcion: "Práctica de conversación y pronunciación" },
      { nombre: "Inglés Técnico",        descripcion: "Inglés enfocado en contextos tecnológicos" },
      { nombre: "Física Mecánica",       descripcion: "Cinemática, dinámica y leyes de Newton", estado: false },
    ]
  });

  //Usuarios

  await prisma.usuario.createMany({
  data: [
    // 1 Administrador
    {
      nombre: "Laura", apellidos: "Jiménez Solano",
      correo: "admin@tutorias.cr",
      password: "123456",
      telefono: "88001100", rol: Rol.ADMINISTRADOR,
    },
    // 5 Profesionales
    {
      nombre: "Carlos", apellidos: "Méndez Rojas",
      correo: "carlos.mendez@tutorias.cr",
      password: "123456",
      telefono: "87654321", rol: Rol.PROFESIONAL,
    },
    {
      nombre: "Sofía", apellidos: "Vargas Ulate",
      correo: "sofia.vargas@tutorias.cr",
      password: "123456",
      telefono: "86543210", rol: Rol.PROFESIONAL,
    },
    {
      nombre: "Andrés", apellidos: "Mora Calderón",
      correo: "andres.mora@tutorias.cr",
      password: "123456",
      telefono: "85432109", rol: Rol.PROFESIONAL,
    },
    {
      nombre: "Valeria", apellidos: "Quirós Salas",
      correo: "valeria.quiros@tutorias.cr",
      password: "123456",
      telefono: "84321098", rol: Rol.PROFESIONAL,
    },
    {
      nombre: "Marco", apellidos: "Solano Brenes",
      correo: "marco.solano@tutorias.cr",
      password: "123456",
      telefono: "83210987", rol: Rol.PROFESIONAL, estado: false,
    },
    // 2 Clientes
    {
      nombre: "María", apellidos: "González Pérez",
      correo: "maria.gonzalez@gmail.com",
      password: "123456",
      telefono: "82109876", rol: Rol.CLIENTE,
    },
    {
      nombre: "Diego", apellidos: "Castillo Núñez",
      correo: "diego.castillo@gmail.com",
      password: "123456",
      telefono: "81098765", rol: Rol.CLIENTE,
    },
  ]
});

//Recuperación de IDs para relaciones
const [cats, esps, users] = await Promise.all([
  prisma.categoria.findMany(),
  prisma.especialidad.findMany(),
  prisma.usuario.findMany(),
]);

//Recuperación de IDs para relaciones
const catMap  = Object.fromEntries(cats.map((c) => [c.nombre, c.idCategoria]));
const espMap  = Object.fromEntries(esps.map((e) => [e.nombre, e.idEspecialidad]));
const userMap = Object.fromEntries(users.map((u) => [u.correo, u.idUsuario]));


//Perfil profesional
const perfileCarlos = await prisma.perfilProfesional.create({
  data: {
    titulo: "Ingeniero en Sistemas",
    descripcion: "Tutor con 8 años de experiencia en programación y matemáticas universitarias",
    annosExperiencia: 8,
    tarifaBase: 15000,
    disponibilidad: true,
    modalidad: Modalidad.VIRTUAL,
    provincia: "San José", canton: "Montes de Oca", distrito: "San Pedro",
     idUsuario: userMap["carlos.mendez@tutorias.cr"],
     especialidades: {
      create: [
        { idEspecialidad: espMap["Cálculo Diferencial"] },
        { idEspecialidad: espMap["Álgebra Lineal"] },
        { idEspecialidad: espMap["TypeScript"] },
        { idEspecialidad: espMap["Angular"] },
        { idEspecialidad: espMap["Node.js"] },
      ],

    },
  },
});

const perfilSofia = await prisma.perfilProfesional.create({
  data: {
    titulo: "Licenciada en Filología Inglesa",
    descripcion: "Tutora especializada en inglés conversacional y técnico con certificación TOEFL",
    annosExperiencia: 5,
    tarifaBase: 12000,
    disponibilidad: true,
    modalidad: Modalidad.MIXTA,
    provincia: "Heredia", canton: "Heredia", distrito: "Mercedes",
    idUsuario: userMap["sofia.vargas@tutorias.cr"],
    especialidades: {
      create: [
        { idEspecialidad: espMap["Inglés Conversacional"] },
        { idEspecialidad: espMap["Inglés Técnico"] },
      ]
    }
  }
});

const perfilAndres = await prisma.perfilProfesional.create({
  data: {
    titulo: "Bachiller en Física",
    descripcion: "Tutor de ciencias exactas para estudiantes de secundaria y universidad",
    annosExperiencia: 3,
    tarifaBase: 10000,
    disponibilidad: true,
    modalidad: Modalidad.PRESENCIAL,
    provincia: "Alajuela", canton: "Alajuela", distrito: "Central",
    idUsuario: userMap["andres.mora@tutorias.cr"],
    especialidades: {
      create: [
        { idEspecialidad: espMap["Física Mecánica"] },
        { idEspecialidad: espMap["Cálculo Diferencial"] },
        { idEspecialidad: espMap["Álgebra Lineal"] },
      ]
    }
  }
});

const perfilValeria = await prisma.perfilProfesional.create({
  data: {
    titulo: "Máster en Matemáticas Aplicadas",
    descripcion: "Tutora especializada en cálculo y álgebra para ingeniería",
    annosExperiencia: 6,
    tarifaBase: 14000,
    disponibilidad: false, // no disponible
    modalidad: Modalidad.VIRTUAL,
    provincia: "Cartago", canton: "Cartago", distrito: "Oriental",
    idUsuario: userMap["valeria.quiros@tutorias.cr"],
    especialidades: {
      create: [
        { idEspecialidad: espMap["Cálculo Diferencial"] },
        { idEspecialidad: espMap["Álgebra Lineal"] },
      ]
    }
  }
});

const perfilMarco = await prisma.perfilProfesional.create({
  data: {
    titulo: "Técnico en Desarrollo Web",
    descripcion: "Tutor de programación web con enfoque en proyectos prácticos",
    annosExperiencia: 2,
    tarifaBase: 9000,
    disponibilidad: true,
    modalidad: Modalidad.VIRTUAL,
    provincia: "San José", canton: "San José", distrito: "Carmen",
    idUsuario: userMap["marco.solano@tutorias.cr"],
    especialidades: {
      create: [
        { idEspecialidad: espMap["TypeScript"] },
        { idEspecialidad: espMap["Angular"] },
        { idEspecialidad: espMap["Node.js"] },
      ]
    }
  }
});
//Para pruebas
console.log("  ✔ Perfiles profesionales creados");

//Servicios
const serviciosTsAngular = await prisma.servicio.create({
  data:{
    nombre: "Turoría de TypeScript y Angular",
    descripcion: "Aprende TypeScript y Angular desde cero con un enfoque práctico",
    precio: 15000,
    duracionMinutos: 60,
    modalidad: Modalidad.VIRTUAL,
    estado: true,
    idProfesional: perfilMarco.idPerfilProfesional,
    especialidades: {
      create: [
        { idEspecialidad: espMap["TypeScript"] },
        { idEspecialidad: espMap["Angular"] },
      ]
     },
     idCategoria: catMap["Programación"],
    }
});

const servicioInglesTec = await prisma.servicio.create({
  data: {
    nombre: "Inglés Técnico para Programadores",
    descripcion: "Inglés para documentación técnica y entrevistas de software",
    precio: 14000, duracionMinutos: 60, modalidad: Modalidad.VIRTUAL, estado: true,
    idProfesional: perfilSofia.idPerfilProfesional,
    especialidades: {
      create: [
        { idEspecialidad: espMap["Inglés Técnico"] },
        { idEspecialidad: espMap["Inglés Conversacional"] },
      ]
    },
        idCategoria: catMap["Idiomas"],
  }
});


const servicioCalculo = await prisma.servicio.create({
  data: {
    nombre: "Tutoría de Cálculo Diferencial",
    descripcion: "Resolución de ejercicios y teoría de cálculo universitario",
    precio: 12000, duracionMinutos: 90, modalidad: Modalidad.PRESENCIAL, estado: true,
    idProfesional: perfilValeria.idPerfilProfesional,
    especialidades: {
      create: [
        { idEspecialidad: espMap["Cálculo Diferencial"] },
      ]
    },
    idCategoria: catMap["Matemáticas"],
  }
});

const servicioNode = await prisma.servicio.create({
  data: {
    nombre: "Tutoría de Node.js y APIs REST",
    descripcion: "Construcción de backends con Node.js, Express y TypeScript",
    precio: 15000, duracionMinutos: 60, modalidad: Modalidad.VIRTUAL, estado: false,
    idProfesional: perfilMarco.idPerfilProfesional,
    especialidades: {
      create: [
        { idEspecialidad: espMap["Node.js"] },
        { idEspecialidad: espMap["TypeScript"] },
      ]
    },
      idCategoria: catMap["Programación"],
  }
});

const servicioInglesConv = await prisma.servicio.create({
  data: {
    nombre: "Inglés Conversacional Intensivo",
    descripcion: "Práctica de conversación para mejorar fluidez en inglés",
    precio: 12000, duracionMinutos: 60, modalidad: Modalidad.MIXTA, estado: true,
    idProfesional: perfilSofia.idPerfilProfesional,
    idCategoria: catMap["Idiomas"],
    especialidades: {
      create: [
        { idEspecialidad: espMap["Inglés Conversacional"] },
      ]
    }
  }
});

const servicioFisica = await prisma.servicio.create({
  data: {
    nombre: "Física Mecánica para Universidad",
    descripcion: "Cinemática, dinámica y estática para universitarios",
    precio: 10000, duracionMinutos: 90, modalidad: Modalidad.PRESENCIAL, estado: true,
    idProfesional: perfilAndres.idPerfilProfesional,
    especialidades: {
      create: [
        { idEspecialidad: espMap["Física Mecánica"] },
        { idEspecialidad: espMap["Cálculo Diferencial"] },
        { idEspecialidad: espMap["Álgebra Lineal"] },
      ]
    },
        idCategoria: catMap["Ciencias"],
  }
});

const servicioQuimica = await prisma.servicio.create({
  data: {
    nombre: "Química General Básica",
    descripcion: "Estequiometría, enlaces y reacciones para estudiantes de primer año",
    precio: 10000, duracionMinutos: 60, modalidad: Modalidad.PRESENCIAL, estado: true,
    idProfesional: perfilAndres.idPerfilProfesional,

    especialidades: { 
      create: [
        { idEspecialidad: espMap["Física Mecánica"] },
        { idEspecialidad: espMap["Cálculo Diferencial"] },
      ] 
    },
    idCategoria: catMap["Ciencias"],
  }
  
});

const servicioAlgebra = await prisma.servicio.create({
  data: {
    nombre: "Álgebra Lineal para Ingeniería",
    descripcion: "Matrices, determinantes y espacios vectoriales",
    precio: 14000, duracionMinutos: 90, modalidad: Modalidad.VIRTUAL, estado: true,
    idProfesional: perfilValeria.idPerfilProfesional,
    especialidades: {
      create: [
        { idEspecialidad: espMap["Cálculo Diferencial"] },
        { idEspecialidad: espMap["Álgebra Lineal"] },
      ]
    },
     idCategoria: catMap["Matemáticas"],
  }
});

const servicioEstadistica = await prisma.servicio.create({
  data: {
    nombre: "Estadística Aplicada",
    descripcion: "Probabilidad, distribuciones y análisis de datos",
    precio: 13000, duracionMinutos: 60, modalidad: Modalidad.VIRTUAL, estado: false,
    idProfesional: perfilValeria.idPerfilProfesional,
    idCategoria: catMap["Matemáticas"],
    especialidades: { 
      create: [
        { idEspecialidad: espMap["Cálculo Diferencial"] },
        { idEspecialidad: espMap["Estadística"] },
      ] 
    }
  }
});

const servicioWeb = await prisma.servicio.create({
  data: {
    nombre: "Introducción a la Programación Web",
    descripcion: "HTML, CSS y JavaScript para principiantes",
    precio: 9000, duracionMinutos: 60, modalidad: Modalidad.VIRTUAL, estado: true,
    idProfesional: perfilMarco.idPerfilProfesional,
    idCategoria: catMap["Programación"],
    especialidades: {
      create: [
        { idEspecialidad: espMap["JavaScript"] },
      ]
    }
  }
});


console.log("Servicios creados");

//Citas 
await prisma.cita.create({
  data: {
    fechaSolicitada:  new Date("2025-07-10"),
    horaInicio:       new Date("1970-01-01T09:00:00"),
    horaFinalizacion: new Date("1970-01-01T10:00:00"),
    modalidad:        Modalidad.VIRTUAL,
    descripcionCita:  "Necesito ayuda con signals y componentes standalone en Angular",
    montoTotal:       15000,
    estado:           EstadoCita.PENDIENTE,
    idCliente:        userMap["maria.gonzalez@gmail.com"],
    idProfesional:    perfileCarlos.idPerfilProfesional,
    idServicio:       serviciosTsAngular.idServicio,
  }
});

// Cita 2
await prisma.cita.create({
  data: {
    fechaSolicitada:  new Date("2025-07-12"),
    horaInicio:       new Date("1970-01-01T14:00:00"),
    horaFinalizacion: new Date("1970-01-01T15:30:00"),
    modalidad:        Modalidad.PRESENCIAL,
    descripcionCita:  "Tengo problemas con derivadas implícitas y regla de la cadena",
    montoTotal:       12000,
    estado:           EstadoCita.PENDIENTE,
    idCliente:        userMap["maria.gonzalez@gmail.com"],
    idProfesional:    perfilValeria.idPerfilProfesional,
    idServicio:       servicioCalculo.idServicio,
  }
});

// Cita 3
await prisma.cita.create({
  data: {
    fechaSolicitada:  new Date("2025-07-11"),
    horaInicio:       new Date("1970-01-01T10:00:00"),
    horaFinalizacion: new Date("1970-01-01T11:00:00"),
    modalidad:        Modalidad.VIRTUAL,
    descripcionCita:  "Quiero aprender servicios e inyección de dependencias en Angular",
    montoTotal:       15000,
    estado:           EstadoCita.PENDIENTE,
    idCliente:        userMap["diego.castillo@gmail.com"],
    idProfesional:    perfileCarlos.idPerfilProfesional,
    idServicio:       serviciosTsAngular.idServicio,
  }
});

// Cita 4
await prisma.cita.create({
  data: {
    fechaSolicitada:  new Date("2025-07-14"),
    horaInicio:       new Date("1970-01-01T08:00:00"),
    horaFinalizacion: new Date("1970-01-01T09:00:00"),
    modalidad:        Modalidad.VIRTUAL,
    descripcionCita:  "Quiero practicar conversación para una entrevista de trabajo en inglés",
    montoTotal:       12000,
    estado:           EstadoCita.PENDIENTE,
    idCliente:        userMap["maria.gonzalez@gmail.com"],
    idProfesional:    perfilSofia.idPerfilProfesional,
    idServicio:       servicioInglesConv.idServicio,
  }
});

// Cita 5
await prisma.cita.create({
  data: {
    fechaSolicitada:  new Date("2025-07-15"),
    horaInicio:       new Date("1970-01-01T11:00:00"),
    horaFinalizacion: new Date("1970-01-01T12:00:00"),
    modalidad:        Modalidad.VIRTUAL,
    descripcionCita:  "Necesito mejorar mi inglés para leer documentación técnica de APIs",
    montoTotal:       14000,
    estado:           EstadoCita.PENDIENTE,
    idCliente:        userMap["diego.castillo@gmail.com"],
    idProfesional:    perfilSofia.idPerfilProfesional,
    idServicio:       servicioInglesTec.idServicio,
  }
});

// Cita 6
await prisma.cita.create({
  data: {
    fechaSolicitada:  new Date("2025-07-16"),
    horaInicio:       new Date("1970-01-01T15:00:00"),
    horaFinalizacion: new Date("1970-01-01T16:30:00"),
    modalidad:        Modalidad.PRESENCIAL,
    descripcionCita:  "Tengo examen de dinámica la próxima semana y no entiendo fricción",
    montoTotal:       10000,
    estado:           EstadoCita.PENDIENTE,
    idCliente:        userMap["maria.gonzalez@gmail.com"],
    idProfesional:    perfilAndres.idPerfilProfesional,
    idServicio:       servicioFisica.idServicio,
  }
});

// Cita 7
await prisma.cita.create({
  data: {
    fechaSolicitada:  new Date("2025-07-17"),
    horaInicio:       new Date("1970-01-01T09:00:00"),
    horaFinalizacion: new Date("1970-01-01T10:30:00"),
    modalidad:        Modalidad.PRESENCIAL,
    descripcionCita:  "Necesito repasar cinemática para el parcial del viernes",
    montoTotal:       10000,
    estado:           EstadoCita.PENDIENTE,
    idCliente:        userMap["diego.castillo@gmail.com"],
    idProfesional:    perfilAndres.idPerfilProfesional,
    idServicio:       servicioFisica.idServicio,
  }
});

// Cita 8
await prisma.cita.create({
  data: {
    fechaSolicitada:  new Date("2025-07-18"),
    horaInicio:       new Date("1970-01-01T13:00:00"),
    horaFinalizacion: new Date("1970-01-01T14:00:00"),
    modalidad:        Modalidad.PRESENCIAL,
    descripcionCita:  "Tengo dificultades con balanceo de ecuaciones químicas",
    montoTotal:       10000,
    estado:           EstadoCita.PENDIENTE,
    idCliente:        userMap["maria.gonzalez@gmail.com"],
    idProfesional:    perfilAndres.idPerfilProfesional,
    idServicio:       servicioQuimica.idServicio,
  }
});

// Cita 9
await prisma.cita.create({
  data: {
    fechaSolicitada:  new Date("2025-07-19"),
    horaInicio:       new Date("1970-01-01T16:00:00"),
    horaFinalizacion: new Date("1970-01-01T17:30:00"),
    modalidad:        Modalidad.VIRTUAL,
    descripcionCita:  "Necesito entender transformaciones lineales y eigenvalores",
    montoTotal:       14000,
    estado:           EstadoCita.PENDIENTE,
    idCliente:        userMap["diego.castillo@gmail.com"],
    idProfesional:    perfilValeria.idPerfilProfesional,
    idServicio:       servicioAlgebra.idServicio,
  }
});

// Cita 10
await prisma.cita.create({
  data: {
    fechaSolicitada:  new Date("2025-07-21"),
    horaInicio:       new Date("1970-01-01T10:00:00"),
    horaFinalizacion: new Date("1970-01-01T11:30:00"),
    modalidad:        Modalidad.VIRTUAL,
    descripcionCita:  "Quiero repasar espacios vectoriales antes del final",
    montoTotal:       14000,
    estado:           EstadoCita.PENDIENTE,
    idCliente:        userMap["maria.gonzalez@gmail.com"],
    idProfesional:    perfilValeria.idPerfilProfesional,
    idServicio:       servicioAlgebra.idServicio,
  }
});

// Cita 11
await prisma.cita.create({
  data: {
    fechaSolicitada:  new Date("2025-07-22"),
    horaInicio:       new Date("1970-01-01T14:00:00"),
    horaFinalizacion: new Date("1970-01-01T15:00:00"),
    modalidad:        Modalidad.VIRTUAL,
    descripcionCita:  "Soy principiante y quiero aprender HTML y CSS desde cero",
    montoTotal:       9000,
    estado:           EstadoCita.PENDIENTE,
    idCliente:        userMap["diego.castillo@gmail.com"],
    idProfesional:    perfilMarco.idPerfilProfesional,
    idServicio:       servicioWeb.idServicio,
  }
});

// Cita 12
await prisma.cita.create({
  data: {
    fechaSolicitada:  new Date("2025-07-23"),
    horaInicio:       new Date("1970-01-01T09:00:00"),
    horaFinalizacion: new Date("1970-01-01T10:00:00"),
    modalidad:        Modalidad.VIRTUAL,
    descripcionCita:  "Quiero aprender JavaScript básico para complementar mi carrera",
    montoTotal:       9000,
    estado:           EstadoCita.PENDIENTE,
    idCliente:        userMap["maria.gonzalez@gmail.com"],
    idProfesional:    perfilMarco.idPerfilProfesional,
    idServicio:       servicioWeb.idServicio,
  }
});

console.log("Citas creadas");
  console.log("Seed completado con éxito.");
}
main()
  .catch((e) => {
    console.error("Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
