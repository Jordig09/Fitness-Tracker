const pool = require("../db/connection");

const getAllExercises = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM exercises ORDER BY name ASC",
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getLastExecution = async (req, res, next) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT es.set_number, es.reps, es.weight_kg
      FROM executed_sets es
      JOIN weight_sessions ws ON es.session_id = ws.id
      WHERE es.exercise_id = $1
      AND ws.id = (
          SELECT ws_sub.id
          FROM executed_sets es_sub
          JOIN weight_sessions ws_sub ON es_sub.session_id = ws_sub.id
          WHERE es_sub.exercise_id = $1
          ORDER BY ws_sub.date DESC
          LIMIT 1
      )
      ORDER BY es.set_number ASC;
    `;
    const result = await pool.query(query, [id]);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllExercises, getLastExecution };
