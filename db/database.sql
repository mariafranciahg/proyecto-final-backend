CREATE DATABASE servicasa;

\c servicasa;

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  foto TEXT,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
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

CREATE TABLE solicitudes (
  id SERIAL PRIMARY KEY,
  servicio_id INT REFERENCES servicios(id) ON DELETE CASCADE,
  usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
  mensaje TEXT,
  estado VARCHAR(50) DEFAULT 'Pendiente',
  fecha_creacion TIMESTAMP DEFAULT NOW()
);

INSERT INTO categorias (id, nombre) VALUES
(1, 'Electricidad'),
(2, 'Limpieza'),
(3, 'Gasfitería'),
(4, 'Herrería'),
(5, 'Carpintería'),
(6, 'Pintura');


INSERT INTO servicios (titulo, foto, descripcion, precio, usuario_id, categoria_id) VALUES
-- Electricidad
('Instalación de enchufes', 'https://siegg.cl/wp-content/uploads/2023/01/Instalacion-electric-1.jpg', 'Instalación de enchufes y tomas eléctricas en tu hogar o oficina.', 25000, 1, 1),
('Reparación de cortocircuitos', 'https://siegg.cl/wp-content/uploads/2023/01/Instalacion-electric-1.jpg', 'Solución rápida de cortocircuitos y problemas eléctricos menores.', 30000, 1, 1),
('Instalación de iluminación LED', 'https://siegg.cl/wp-content/uploads/2023/01/Instalacion-electric-1.jpg', 'Instalación de luces LED interiores y exteriores para ahorro energético.', 28000, 1, 1),
('Mantenimiento eléctrico general', 'https://siegg.cl/wp-content/uploads/2023/01/Instalacion-electric-1.jpg', 'Revisión y mantenimiento de instalaciones eléctricas para seguridad.', 35000, 1, 1),

-- Limpieza
('Limpieza profunda de cocina', 'https://www.msolucionamalaga.com/wp-content/uploads/selective-focus-of-cleaner-holding-spray-bottle-ne-2021-09-01-14-41-13-utc-scaled.jpg', 'Limpieza completa de cocinas, incluyendo hornos y refrigeradores.', 20000, 1, 2),
('Limpieza de ventanas', 'https://www.msolucionamalaga.com/wp-content/uploads/selective-focus-of-cleaner-holding-spray-bottle-ne-2021-09-01-14-41-13-utc-scaled.jpg', 'Limpieza profesional de ventanas interiores y exteriores.', 15000, 1, 2),
('Limpieza de baños', 'https://www.msolucionamalaga.com/wp-content/uploads/selective-focus-of-cleaner-holding-spray-bottle-ne-2021-09-01-14-41-13-utc-scaled.jpg', 'Limpieza profunda de inodoros, lavamanos y duchas.', 18000, 1, 2),
('Limpieza de oficinas', 'https://www.msolucionamalaga.com/wp-content/uploads/selective-focus-of-cleaner-holding-spray-bottle-ne-2021-09-01-14-41-13-utc-scaled.jpg', 'Limpieza completa de escritorios, suelos y áreas comunes.', 22000, 1, 2),

-- Gasfitería
('Reparación de fugas', 'https://cl.habcdn.com/photos/business/big/servicio-de-gasfiteria-trujillo-232385.jpg', 'Reparación rápida de fugas de agua en tuberías y grifos.', 22000, 1, 3),
('Instalación de sanitarios', 'https://cl.habcdn.com/photos/business/big/servicio-de-gasfiteria-trujillo-232385.jpg', 'Instalación de inodoros, lavamanos y duchas con garantía.', 30000, 3, 3),
('Mantenimiento de cañerías', 'https://cl.habcdn.com/photos/business/big/servicio-de-gasfiteria-trujillo-232385.jpg', 'Revisión y limpieza de tuberías para evitar obstrucciones.', 25000, 1, 3),
('Desatascos urgentes', 'https://cl.habcdn.com/photos/business/big/servicio-de-gasfiteria-trujillo-232385.jpg', 'Servicio rápido de desatasco de tuberías y fregaderos.', 28000, 1, 3),

-- Herrería
('Reparación de rejas', 'https://servihierro.com.uy/wp-content/uploads/2024/05/unnamed-file.jpg', 'Reparación y mantenimiento de rejas de seguridad y balcones.', 25000, 2, 4),
('Fabricación de portones', 'https://servihierro.com.uy/wp-content/uploads/2024/05/unnamed-file.jpg', 'Diseño y fabricación de portones a medida en metal resistente.', 40000, 2, 4),
('Instalación de barandas', 'https://servihierro.com.uy/wp-content/uploads/2024/05/unnamed-file.jpg', 'Instalación de barandas de seguridad para escaleras y balcones.', 30000, 2, 4),
('Reparación de estructuras metálicas', 'https://servihierro.com.uy/wp-content/uploads/2024/05/unnamed-file.jpg', 'Reparación de estructuras metálicas para viviendas e industrias.', 35000, 1, 4),

-- Carpintería
('Muebles a medida', 'https://tucarpintero.cl/wp-content/uploads/2023/08/manitas-trabajando-taller.jpg', 'Diseño y construcción de muebles personalizados para tu hogar.', 35000, 1, 5),
('Reparación de puertas', 'https://tucarpintero.cl/wp-content/uploads/2023/08/manitas-trabajando-taller.jpg', 'Reparación de puertas de madera y armarios con acabados de calidad.', 18000, 1, 5),
('Armarios empotrados', 'https://tucarpintero.cl/wp-content/uploads/2023/08/manitas-trabajando-taller.jpg', 'Diseño e instalación de armarios empotrados para optimizar espacios.', 40000, 1, 5),
('Restauración de muebles', 'https://tucarpintero.cl/wp-content/uploads/2023/08/manitas-trabajando-taller.jpg', 'Restauración de muebles antiguos manteniendo su estilo original.', 30000, 1, 5),

-- Pintura
('Pintura de interiores', 'https://juanitoelpintor.com/wp-content/uploads/2021/04/Captura-de-pantalla-2025-01-14-a-las-11.37.58.png', 'Pintura profesional de habitaciones, salas y oficinas.', 30000, 2, 6),
('Pintura de fachadas', 'https://juanitoelpintor.com/wp-content/uploads/2021/04/Captura-de-pantalla-2025-01-14-a-las-11.37.58.png', 'Pintura de fachadas exteriores con pintura de alta duración.', 50000, 2, 6),
('Pintura de rejas y puertas', 'https://juanitoelpintor.com/wp-content/uploads/2021/04/Captura-de-pantalla-2025-01-14-a-las-11.37.58.png', 'Pintura de rejas metálicas y puertas de madera con acabado profesional.', 22000, 1, 6),
('Pintura decorativa', 'https://juanitoelpintor.com/wp-content/uploads/2021/04/Captura-de-pantalla-2025-01-14-a-las-11.37.58.png', 'Pintura decorativa en paredes interiores con diseños personalizados.', 35000, 1, 6);
