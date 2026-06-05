-- CreateTable
CREATE TABLE `Usuario` (
    `idUsuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(45) NOT NULL,
    `apellidos` VARCHAR(90) NOT NULL,
    `correo` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `telefono` VARCHAR(20) NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `rol` ENUM('ADMINISTRADOR', 'PROFESIONAL', 'CLIENTE') NOT NULL,
    `fechaRegistro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechaActualizacion` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Usuario_correo_key`(`correo`),
    PRIMARY KEY (`idUsuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PerfilProfesional` (
    `idPerfilProfesional` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NOT NULL,
    `annosExperiencia` INTEGER NOT NULL,
    `tarifaBase` DECIMAL(10, 2) NOT NULL,
    `disponibilidad` BOOLEAN NOT NULL DEFAULT true,
    `imagen` VARCHAR(255) NULL,
    `modalidad` ENUM('VIRTUAL', 'PRESENCIAL', 'MIXTA') NOT NULL,
    `provincia` VARCHAR(60) NOT NULL,
    `canton` VARCHAR(60) NOT NULL,
    `distrito` VARCHAR(60) NOT NULL,
    `idUsuario` INTEGER NOT NULL,

    UNIQUE INDEX `PerfilProfesional_idUsuario_key`(`idUsuario`),
    PRIMARY KEY (`idPerfilProfesional`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categoria` (
    `idCategoria` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(45) NOT NULL,
    `descripcion` VARCHAR(255) NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`idCategoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Servicio` (
    `idServicio` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NOT NULL,
    `precio` DECIMAL(10, 2) NOT NULL,
    `duracionMinutos` INTEGER NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modalidad` ENUM('VIRTUAL', 'PRESENCIAL', 'MIXTA') NOT NULL,
    `idProfesional` INTEGER NOT NULL,
    `idCategoria` INTEGER NOT NULL,

    PRIMARY KEY (`idServicio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Especialidad` (
    `idEspecialidad` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`idEspecialidad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EspecialidadServicio` (
    `idEspecialidad` INTEGER NOT NULL,
    `idServicio` INTEGER NOT NULL,

    PRIMARY KEY (`idEspecialidad`, `idServicio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EspecialidadPerfil` (
    `idEspecialidad` INTEGER NOT NULL,
    `idPerfilProfesional` INTEGER NOT NULL,

    PRIMARY KEY (`idEspecialidad`, `idPerfilProfesional`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cita` (
    `idCita` INTEGER NOT NULL AUTO_INCREMENT,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechaSolicitada` DATE NOT NULL,
    `horaInicio` TIME NOT NULL,
    `horaFinalizacion` TIME NOT NULL,
    `descripcionCita` VARCHAR(255) NOT NULL,
    `comentarioProfesional` VARCHAR(255) NULL,
    `montoTotal` DECIMAL(10, 2) NOT NULL,
    `modalidad` ENUM('VIRTUAL', 'PRESENCIAL', 'MIXTA') NOT NULL,
    `estado` ENUM('PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'CANCELADA', 'COMPLETADA') NOT NULL DEFAULT 'PENDIENTE',
    `idCliente` INTEGER NOT NULL,
    `idProfesional` INTEGER NOT NULL,
    `idServicio` INTEGER NOT NULL,

    PRIMARY KEY (`idCita`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HistorialCita` (
    `idHistorial` INTEGER NOT NULL AUTO_INCREMENT,
    `idCita` INTEGER NOT NULL,
    `estado` ENUM('PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'CANCELADA', 'COMPLETADA') NOT NULL,
    `fechaCambio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `comentario` VARCHAR(255) NULL,

    PRIMARY KEY (`idHistorial`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Resenna` (
    `idResenna` INTEGER NOT NULL AUTO_INCREMENT,
    `puntuacion` INTEGER NOT NULL,
    `comentario` VARCHAR(255) NOT NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `idCita` INTEGER NOT NULL,
    `idCliente` INTEGER NOT NULL,
    `idProfesional` INTEGER NOT NULL,

    UNIQUE INDEX `Resenna_idCita_key`(`idCita`),
    PRIMARY KEY (`idResenna`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PerfilProfesional` ADD CONSTRAINT `PerfilProfesional_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `Usuario`(`idUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Servicio` ADD CONSTRAINT `Servicio_idProfesional_fkey` FOREIGN KEY (`idProfesional`) REFERENCES `PerfilProfesional`(`idPerfilProfesional`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Servicio` ADD CONSTRAINT `Servicio_idCategoria_fkey` FOREIGN KEY (`idCategoria`) REFERENCES `Categoria`(`idCategoria`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EspecialidadServicio` ADD CONSTRAINT `EspecialidadServicio_idEspecialidad_fkey` FOREIGN KEY (`idEspecialidad`) REFERENCES `Especialidad`(`idEspecialidad`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EspecialidadServicio` ADD CONSTRAINT `EspecialidadServicio_idServicio_fkey` FOREIGN KEY (`idServicio`) REFERENCES `Servicio`(`idServicio`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EspecialidadPerfil` ADD CONSTRAINT `EspecialidadPerfil_idEspecialidad_fkey` FOREIGN KEY (`idEspecialidad`) REFERENCES `Especialidad`(`idEspecialidad`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EspecialidadPerfil` ADD CONSTRAINT `EspecialidadPerfil_idPerfilProfesional_fkey` FOREIGN KEY (`idPerfilProfesional`) REFERENCES `PerfilProfesional`(`idPerfilProfesional`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cita` ADD CONSTRAINT `Cita_idCliente_fkey` FOREIGN KEY (`idCliente`) REFERENCES `Usuario`(`idUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cita` ADD CONSTRAINT `Cita_idProfesional_fkey` FOREIGN KEY (`idProfesional`) REFERENCES `PerfilProfesional`(`idPerfilProfesional`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cita` ADD CONSTRAINT `Cita_idServicio_fkey` FOREIGN KEY (`idServicio`) REFERENCES `Servicio`(`idServicio`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HistorialCita` ADD CONSTRAINT `HistorialCita_idCita_fkey` FOREIGN KEY (`idCita`) REFERENCES `Cita`(`idCita`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resenna` ADD CONSTRAINT `Resenna_idCita_fkey` FOREIGN KEY (`idCita`) REFERENCES `Cita`(`idCita`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resenna` ADD CONSTRAINT `Resenna_idCliente_fkey` FOREIGN KEY (`idCliente`) REFERENCES `Usuario`(`idUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resenna` ADD CONSTRAINT `Resenna_idProfesional_fkey` FOREIGN KEY (`idProfesional`) REFERENCES `PerfilProfesional`(`idPerfilProfesional`) ON DELETE RESTRICT ON UPDATE CASCADE;
