const pool = require("../db/connection");

// Buscar si ya existe una rutina guardada este día
const getWeightSessionByDate = async (req, res, next) => {
  const { date } = req.params;
  try {
    const sessionRes = await pool.query(
      "SELECT * FROM weight_sessions WHERE date = $1 LIMIT 1",
      [date],
    );
    if (sessionRes.rows.length === 0) return res.json(null);

    const session = sessionRes.rows[0];
    // Traemos todas las series de esa sesión
    const setsRes = await pool.query(
      "SELECT * FROM executed_sets WHERE session_id = $1 ORDER BY id ASC",
      [session.id],
    );

    res.json({
      routine_id: session.routine_id,
      sets: setsRes.rows,
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar la sesión del día
const deleteWeightSession = async (req, res, next) => {
  const { date } = req.params;
  try {
    await pool.query("DELETE FROM weight_sessions WHERE date = $1", [date]);
    res.json({ success: true, message: "Sesión eliminada" });
  } catch (error) {
    next(error);
  }
};

const createWeightSession = async (req, res, next) => {
  const { date, routine_id, sets } = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `INSERT INTO daily_logs (date) VALUES ($1) ON CONFLICT (date) DO NOTHING;`,
      [date],
    );

    // IMPORTANTE: Eliminamos cualquier sesión previa de este día para evitar duplicados
    await client.query(`DELETE FROM weight_sessions WHERE date = $1`, [date]);

    const sessionRes = await client.query(
      `
      INSERT INTO weight_sessions (date, routine_id) VALUES ($1, $2) RETURNING id;
    `,
      [date, routine_id],
    );
    const sessionId = sessionRes.rows[0].id;

    const setQuery = `
      INSERT INTO executed_sets (session_id, exercise_id, set_number, reps, weight_kg)
      VALUES ($1, $2, $3, $4, $5);
    `;
    for (let set of sets) {
      await client.query(setQuery, [
        sessionId,
        set.exercise_id,
        set.set_number,
        set.reps,
        set.weight_kg,
      ]);
    }

    await client.query("COMMIT");
    res
      .status(201)
      .json({
        success: true,
        sessionId,
        message: "Sesión guardada correctamente",
      });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
};

module.exports = {
  getWeightSessionByDate,
  deleteWeightSession,
  createWeightSession,
};
