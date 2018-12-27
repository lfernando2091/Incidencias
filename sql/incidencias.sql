DROP DATABASE IF EXISTS incidencias;

CREATE DATABASE incidencias;

USE incidencias; 

CREATE TABLE usuario(
	pkey INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	usuario TEXT NOT NULL,
	tipo ENUM('admin', 'usuario') DEFAULT 'usuario',
	email TEXT NOT NULL,
	token TEXT NOT NULL,
	estatus ENUM('activo', 'inactivo') DEFAULT 'activo',
	fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_ultima_mod TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categoria_incidencia(
	pkey INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	nombre TEXT NOT NULL,
	estatus ENUM('activo', 'inactivo') DEFAULT 'activo'
);

CREATE TABLE periodo(
	pkey INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	nombre TEXT NOT NULL,
	clave TEXT NOT NULL,
	estatus ENUM('activo', 'inactivo') DEFAULT 'activo'
);

CREATE TABLE criterio(
	pkey INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	nombre TEXT NOT NULL,
	clave TEXT NOT NULL,
	estatus ENUM('activo', 'inactivo') DEFAULT 'activo'
);

CREATE TABLE programa_educativo(
	pkey INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	nombre TEXT NOT NULL,
	clave TEXT NOT NULL,
	estatus ENUM('activo', 'inactivo') DEFAULT 'activo'
);

CREATE TABLE docente(
	pkey INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	nombre TEXT NOT NULL,
	apellido_paterno TEXT NOT NULL,
	apellido_materno TEXT NOT NULL,
	correo_electronico TEXT NOT NULL,
	fecha_nacimiento DATE NOT NULL,
	cedula_profesional TEXT NOT NULL,
	numero_telefonico TEXT NOT NULL,
	fotografia TEXT,
	tipo_horario ENUM('parcial', 'completo') DEFAULT 'parcial',
	estatus ENUM('activo', 'inactivo') DEFAULT 'activo',
	fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_ultima_mod TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE docente_bajas(
	pkey INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	id_docente INT, INDEX(id_docente), FOREIGN KEY (id_docente) REFERENCES docente(pkey),
	comentario TEXT NOT NULL,
	tipo_baja ENUM('temporal', 'definitivo') DEFAULT 'temporal',
	estatus ENUM('activo', 'inactivo') DEFAULT 'activo',
	fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_ultima_mod TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE docente_calificacion(
	pkey INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	id_docente INT, INDEX(id_docente), FOREIGN KEY (id_docente) REFERENCES docente(pkey),
	id_periodo INT, INDEX(id_periodo), FOREIGN KEY (id_periodo) REFERENCES periodo(pkey),
	estatus ENUM('activo', 'inactivo') DEFAULT 'activo',
	fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_ultima_mod TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE docente_calificacion_criterio(
	pkey INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	id_docente_calificacion INT, INDEX(id_docente_calificacion), FOREIGN KEY (id_docente_calificacion) REFERENCES docente_calificacion(pkey),
	id_criterio INT, INDEX(id_criterio), FOREIGN KEY (id_criterio) REFERENCES criterio(pkey),
	calificacion DECIMAL(3,2) NOT NULL DEFAULT '0.00',
	estatus ENUM('activo', 'inactivo') DEFAULT 'activo',
	fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_ultima_mod TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE docente_incidencia(
	pkey INT PRIMARY KEY AUTO_INCREMENT NOT NULL,	
	id_docente INT, INDEX(id_docente), FOREIGN KEY (id_docente) REFERENCES docente(pkey),
	id_categoria_incidencia INT, INDEX(id_categoria_incidencia), FOREIGN KEY (id_categoria_incidencia) REFERENCES categoria_incidencia(pkey),
	id_periodo INT, INDEX(id_periodo), FOREIGN KEY (id_periodo) REFERENCES periodo(pkey),
	id_programa_educativo INT, INDEX(id_programa_educativo), FOREIGN KEY (id_programa_educativo) REFERENCES programa_educativo(pkey),
	descripcion TEXT NOT NULL,
	estatus ENUM('activo', 'inactivo') DEFAULT 'activo',
	fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_ultima_mod TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categoria_incidencia(nombre) VALUES("Incidencia 1");
INSERT INTO categoria_incidencia(nombre) VALUES("Incidencia 2");
INSERT INTO categoria_incidencia(nombre) VALUES("Incidencia 3");
INSERT INTO categoria_incidencia(nombre) VALUES("Incidencia 4");
INSERT INTO categoria_incidencia(nombre) VALUES("Incidencia 5");

INSERT INTO periodo(nombre, clave) VALUES("Enero-Abril", "Ene-Abr");
INSERT INTO periodo(nombre, clave) VALUES("Mayo-Agosto", "May-Ago");
INSERT INTO periodo(nombre, clave) VALUES("Septiembre-Diciembre", "Sep-Dic");

INSERT INTO criterio(nombre, clave) VALUES("Criterio 1", "CR01");
INSERT INTO criterio(nombre, clave) VALUES("Criterio 2", "CR02");
INSERT INTO criterio(nombre, clave) VALUES("Criterio 3", "CR03");
INSERT INTO criterio(nombre, clave) VALUES("Criterio 4", "CR04");
INSERT INTO criterio(nombre, clave) VALUES("Criterio 5", "CR05");

INSERT INTO programa_educativo(nombre, clave) VALUES("Ingenieria en Software", "ING_SOFT");
INSERT INTO programa_educativo(nombre, clave) VALUES("Ingenieria en Telematica", "ING_TELM");

INSERT INTO docente(
	nombre,
	apellido_paterno,
	apellido_materno,
	correo_electronico,
	fecha_nacimiento,
	cedula_profesional,
	numero_telefonico,
	fotografia,
	tipo_horario) 
VALUES(
	"Luis Fernando", 
	"Hernández",
	"Méndez",
	"lfernando2091@gmail.com",
	"1998-06-23",
	"12345ABCDE",
	"7711877577",
	"c:\foto.jpg",
	"parcial"
	);
INSERT INTO docente(
	nombre,
	apellido_paterno,
	apellido_materno,
	correo_electronico,
	fecha_nacimiento,
	cedula_profesional,
	numero_telefonico,
	fotografia,
	tipo_horario) 
VALUES(
	"Profesor 1", 
	"Paterno 1",
	"Materno 1",
	"correo1@gmail.com",
	"1998-06-23",
	"12345ABCDE",
	"7711877577",
	"c:\foto1.jpg",
	"completo"
	);
INSERT INTO docente(
	nombre,
	apellido_paterno,
	apellido_materno,
	correo_electronico,
	fecha_nacimiento,
	cedula_profesional,
	numero_telefonico,
	fotografia,
	tipo_horario) 
VALUES(
	"Profesor 2", 
	"Paterno 2",
	"Materno 2",
	"correo2@gmail.com",
	"1998-06-23",
	"12345ABCDE",
	"7711877577",
	"c:\foto2.jpg",
	"completo"
	);

INSERT INTO docente_bajas(id_docente, comentario, tipo_baja) VALUES(2, "Tiene otro empleo", "definitivo");