//import { Role } from "../generated/prisma";
import { Modalidad, Rol } from "../generated/prisma/client";
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
      { nombre: "TypeScript",            descripcion: "Tipado estático, interfaces y generics" },
      { nombre: "Angular",               descripcion: "Desarrollo frontend con Angular y signals" },
      { nombre: "Node.js",               descripcion: "Desarrollo backend con Node.js y Express" },
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
  }
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
  }
});
//Para pruebas
console.log("  ✔ Perfiles profesionales creados");



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
