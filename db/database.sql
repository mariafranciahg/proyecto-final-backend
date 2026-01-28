CREATE DATABASE servicasa;

\c servicasa;

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  foto TEXT,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  rol VARCHAR(20) NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT NOW()
);

CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
);

CREATE TABLE servicios (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  foto TEXT,
  descripcion TEXT,
  precio INT NOT NULL,
  usuario_id INT REFERENCES usuarios(id),
  categoria_id INT REFERENCES categorias(id),
  fecha_creacion TIMESTAMP DEFAULT NOW()
);

INSERT INTO categorias (nombre) VALUES
('Electricidad'),
('Limpieza'),
('Gasfitería');
