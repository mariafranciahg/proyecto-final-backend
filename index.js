const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const {
  registrarUsuario,
  verificarCredenciales,
  obtenerUsuario,
  obtenerServicios,
  agregarServicio,
  obtenerCategoria,
  crearSolicitud,
  obtenerSolicitudesRecibidas,
  obtenerSolicitudesUsuario,
  actualizarEstado,
  eliminarSolicitud
} = require("./db/consultas.js");
const verificarToken = require("./middlewares/auth.js");

const app = express();

app.use(express.json());


app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});


app.post("/register", async (req, res) => {
  try {
    const usuario = req.body;
    const nuevoUsuario = await registrarUsuario(usuario);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json(error);
  }
});


app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Faltan credenciales" });
    }

    await verificarCredenciales(email, password);

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(error.code || 500).json(error);
  }
});

app.get("/profile", verificarToken, async (req, res) => {
    try {
      const usuario = await obtenerUsuario(req.email);
      res.json(usuario);
    } catch (error) {
      res.status(error.code || 401).json(error);
    }
  });


app.get("/services", async (req,res) => {
  try {
    const categoriaId = req.query.category || null;

    const servicios = await obtenerServicios(categoriaId);
    res.json(servicios);
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error.message || "Error interno");
  }
});


app.post("/services", async(req, res) => {
    try {
        const { titulo, foto, descripcion, precio, usuario_id, categoria_id } = req.body;
        await agregarServicio (titulo, foto, descripcion, precio, usuario_id, categoria_id );
        res.json({ message: "Servicio agregado" });
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).json({ error: error.message || "Error interno" });
    }

});
  
app.get("/categories", async (req, res) => {
  try {
    const categoria = await obtenerCategoria();
  res.json(categoria);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener categorías" });
  }
});

app.post("/solicitudes", verificarToken, async (req, res) => {
  try {
    const solicitud = await crearSolicitud(req.body);
    res.status(201).json(solicitud);
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).json({ message: error.message || "Error interno" });
  }
});

app.get("/solicitudes/realizadas", verificarToken, async (req, res) => {
  try {
    const solicitudes = await obtenerSolicitudesUsuario(req.email);
    res.json(solicitudes);
  } catch (error) {
    res.status(error.code || 500).json({ message: error.message });
  }
});

app.get("/solicitudes/recibidas", verificarToken, async (req, res) => {
  try {
    const solicitudes = await obtenerSolicitudesRecibidas(req.email);
    res.json(solicitudes);
  } catch (error) {
    res.status(error.code || 500).json({ message: error.message });
  }
});

// Cancelar solicitud
app.delete("/solicitudes/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarSolicitud(id, req.email);
    res.json({ message: "Solicitud eliminada" });
  } catch (error) {
    res.status(error.code || 500).json({ message: error.message });
  }
});

// Cambiar estado (Aceptar / Rechazar)
app.put("/solicitudes/estado/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    await actualizarEstado(id, estado);
    res.json({ message: "Estado actualizado" });
  } catch (error) {
    res.status(error.code || 500).json({ message: error.message });
  }
});


const cors = require("cors");

app.use(cors({
  origin: "https://proyecto-final-front-5pmp-27pqtkubz-mariafrancias-projects.vercel.app",
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));


app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor activo en puerto ${process.env.PORT || 3000}`);
});

module.exports = app;
