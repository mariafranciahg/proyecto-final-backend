const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const {
  registrarUsuario,
  verificarCredenciales,
  obtenerUsuario,
  obtenerServicios,
  agregarServicio
} = require("./db/consultas");

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});


app.post("/registro", async (req, res) => {
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

app.get("/profile", async (req, res) => {
    try {
      const Authorization = req.header("Authorization");
  
      if (!Authorization) {
        throw { code: 401, message: "Token no proporcionado" };
      }
  
      const token = Authorization.split("Bearer ")[1];
  
      jwt.verify(token, process.env.JWT_SECRET);
  
      const { email } = jwt.decode(token);
      const usuario = await obtenerUsuario(email);
  
      res.json(usuario);
    } catch (error) {
      res.status(error.code || 401).json(error);
    }
  });

  app.get("/servicios", async (req,res) => {
    try {
        const servicios = await obtenerServicios();
        res.json(servicios);
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).send(error.message || "Error interno");
    }
});

app.post("/servicios", async(req, res) => {
    try {
        const { titulo, foto, descripcion, precio, usuario_id, categoria_id } = req.body;
        await agregarServicio (titulo, foto, descripcion, precio, usuario_id, categoria_id );
        res.send ("Servicio agregado");
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).send(error.message || "Error interno");
    }

});
  


app.listen(3000, () => {
  console.log("Servidor activo");
});
