const { Pool } = require("pg");
require("dotenv").config();

// Si existe DATABASE_URL, usamos esa (para producción), sino los datos locales
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, // Requisito de plataformas en la nube
      }
    : {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
      },
);

module.exports = pool;
