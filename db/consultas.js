const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  allowExitOnIdle: true,
});


const registrarUsuario = async ({ nombre, foto, email, password }) => {
    const passwordEncriptada = bcrypt.hashSync(password);
  
    const consulta = `
    INSERT INTO usuarios (nombre, foto, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING nombre, email, fecha_creacion
  `;
  
    const values = [nombre, foto, email, passwordEncriptada];
    const { rows } = await pool.query(consulta, values);
    return rows[0];
  };
  
  
  const verificarCredenciales = async (email, password) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1";
    const { rows, rowCount } = await pool.query(consulta, [email]);
  
    if (!rowCount) {
      throw { code: 401, message: "Email o contraseña incorrecta" };
    }
  
    const usuario = rows[0];
    const passwordCorrecta = bcrypt.compareSync(password, usuario.password);
  
    if (!passwordCorrecta) {
      throw { code: 401, message: "Email o contraseña incorrecta" };
    }

    delete usuario.password;
  
    return usuario;
  };
  
  const obtenerCategoria = async () => {
    const result = await pool.query("SELECT * FROM categorias ORDER BY nombre ASC");
    return result.rows;
  }
  
  const obtenerUsuario = async (email) => {
    const consulta = `
      SELECT id, nombre, foto, email
      FROM usuarios
      WHERE email = $1
    `;
  
    const { rows, rowCount } = await pool.query(consulta, [email]);
  
    if (!rowCount) {
      throw { code: 404, message: "Usuario no encontrado" };
    }
  
    return rows[0];
  };
  

  const obtenerServicios = async (categoriaId = null) => {
    try {
      let consulta = `
        SELECT 
          s.*, 
          c.nombre AS categoria_nombre
        FROM servicios s
        JOIN categorias c ON c.id = s.categoria_id
      `;
  
      const params = [];
  
      // Si viene categoría, filtramos
      if (categoriaId) {
        consulta += " WHERE s.categoria_id = $1";
        params.push(categoriaId);
      }
  
      consulta += " ORDER BY s.id DESC";
  
      const result = await pool.query(consulta, params);
      return result.rows;
  
    } catch (error) {
      throw { code: 500, message: "Error al obtener los servicios" };
    }
  };
  

const agregarServicio = async (titulo, foto, descripcion, precio, usuario_id, categoria_id) => {
    try {
        const values = [titulo, foto, descripcion, precio, usuario_id, categoria_id];
        await pool.query(
            "INSERT INTO servicios (titulo, foto, descripcion, precio, usuario_id, categoria_id) VALUES ($1, $2, $3, $4, $5, $6)",
            values
        );
    } catch (error) {
        throw { code: 500, message: "Error al agregar el servicio" };
    }
};
  
const crearSolicitud = async ({ servicio_id, usuario_id, mensaje }) => {
  try {
    const consulta = `
      INSERT INTO solicitudes (servicio_id, usuario_id, mensaje)
      VALUES ($1, $2, $3)
      RETURNING id, servicio_id, usuario_id, mensaje, estado, fecha_creacion
    `;

    const values = [servicio_id, usuario_id, mensaje];

    const { rows } = await pool.query(consulta, values);

    return rows[0];

  } catch (error) {
    throw { code: 500, message: "Error al crear la solicitud" };
  }
};

const obtenerSolicitudesUsuario = async (email) => {
  const consulta = `
      SELECT sol.*, s.titulo AS servicio_titulo
      FROM solicitudes sol
      JOIN servicios s ON s.id = sol.servicio_id
      JOIN usuarios u ON u.id = sol.usuario_id
      WHERE u.email = $1
      ORDER BY sol.id DESC
  `;
  
  const { rows } = await pool.query(consulta, [email]);
  return rows;
};

const obtenerSolicitudesRecibidas = async (email) => {
  const consulta = `
      SELECT sol.*, s.titulo AS servicio_titulo, u.nombre AS solicitante
      FROM solicitudes sol
      JOIN servicios s ON s.id = sol.servicio_id
      JOIN usuarios u ON u.id = sol.usuario_id
      WHERE s.usuario_id = (SELECT id FROM usuarios WHERE email = $1)
      ORDER BY sol.id DESC
  `;

  const { rows } = await pool.query(consulta, [email]);
  return rows;
};

const eliminarSolicitud = async (id, email) => {
  const consulta = `
    DELETE FROM solicitudes 
    WHERE id = $1 
    AND usuario_id = (SELECT id FROM usuarios WHERE email = $2)
  `;
  await pool.query(consulta, [id, email]);
};

const actualizarEstado = async (id, estado) => {
  const consulta = `
    UPDATE solicitudes 
    SET estado = $1 
    WHERE id = $2
  `;
  await pool.query(consulta, [estado, id]);
};

  
  module.exports = {
    registrarUsuario,
    verificarCredenciales,
    obtenerUsuario,
    obtenerServicios,
    agregarServicio,
    obtenerCategoria,
    crearSolicitud,
    obtenerSolicitudesUsuario,
    obtenerSolicitudesRecibidas,
    actualizarEstado,
    eliminarSolicitud
    
  };
  