const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const pool = new Pool({
  allowExitOnIdle: true,
});


const registrarUsuario = async ({ nombre, foto, email, password, rol }) => {
    const passwordEncriptada = bcrypt.hashSync(password);
  
    const consulta = `
    INSERT INTO usuarios (nombre, foto, email, password, rol)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING nombre, email, rol, fecha_creacion
  `;
  
    const values = [nombre, foto, email, passwordEncriptada, rol];
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
  
  
  const obtenerUsuario = async (email) => {
    const consulta = `
      SELECT nombre, foto, email, rol
      FROM usuarios
      WHERE email = $1
    `;
  
    const { rows, rowCount } = await pool.query(consulta, [email]);
  
    if (!rowCount) {
      throw { code: 404, message: "Usuario no encontrado" };
    }
  
    return rows[0];
  };
  
  const obtenerServicios = async () => {
    try {
        const result = await pool.query("SELECT * FROM servicios");
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
  
  
  module.exports = {
    registrarUsuario,
    verificarCredenciales,
    obtenerUsuario,
    obtenerServicios,
    agregarServicio
    
  };
  