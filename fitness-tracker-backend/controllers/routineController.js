const pool = require("../db/connection");

const getAllRoutines = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM routines ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    next(error); // Esto envía el error a tu errorHandler
  }
};

module.exports = { getAllRoutines };
