const jwt = require("jsonwebtoken");

const login = (req, res) => {
  const { password } = req.body;
  console.log("Contraseña enviada por React:", password);
  console.log("Contraseña guardada en Render:", process.env.ADMIN_PASSWORD);

  // Comparamos la contraseña recibida con la del .env
  if (password === process.env.ADMIN_PASSWORD) {
    // Si es correcta, generamos el token
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Contraseña incorrecta" });
  }
};

module.exports = { login };
