const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // 1. Buscamos el token en la cabecera de la petición
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // El formato es "Bearer <token>"

  // 2. Si no hay token, rechazamos la entrada
  if (!token) {
    console.log("🚨 El guardia dice: No trajo ningún token");
    return res
      .status(401)
      .json({ error: "Acceso denegado. Se requiere autenticación." });
  }

  // 3. Verificamos que el token sea auténtico y no haya expirado
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next(); // Todo está en orden, lo dejamos pasar a la ruta que pidió
  } catch (error) {
    console.log("🚨 El guardia rebotó el token por este error:", error.message);
    res.status(401).json({ error: "Token inválido o expirado." });
  }
};

module.exports = verifyToken;
