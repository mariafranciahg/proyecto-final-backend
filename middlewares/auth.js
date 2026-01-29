const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  try {
    const Authorization = req.header("Authorization");

    if (!Authorization) {
      throw { code: 401, message: "Token no proporcionado" };
    }

    const token = Authorization.split("Bearer ")[1];

    jwt.verify(token, process.env.JWT_SECRET);

    const { email } = jwt.decode(token);

    req.email = email;

    next();
  } catch (error) {
    res.status(error.code || 401).json(error);
  }
};

module.exports = verificarToken;
