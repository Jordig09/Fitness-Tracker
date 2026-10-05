const pool = require("../db/connection");

const getDailyLogByDate = async (req, res, next) => {
  const { date } = req.params;
  try {
    // 1. Buscamos el registro del día (comida, básquet, caminata)
    const logRes = await pool.query(
      "SELECT * FROM daily_logs WHERE date = $1",
      [date],
    );
    let dailyData = logRes.rows[0] || {};

    // 2. Buscamos si ese día hay una rutina de pesas asociada y traemos su nombre
    const weightRes = await pool.query(
      `
      SELECT r.name as routine_name 
      FROM weight_sessions ws 
      JOIN routines r ON ws.routine_id = r.id 
      WHERE ws.date = $1 
      ORDER BY ws.id DESC LIMIT 1
    `,
      [date],
    );

    if (weightRes.rows.length > 0) {
      dailyData.routine_name = weightRes.rows[0].routine_name;
    }

    res.json(dailyData);
  } catch (error) {
    next(error);
  }
};

const upsertDailyLog = async (req, res, next) => {
  const {
    date,
    food_rating,
    breakfast_notes,
    lunch_notes,
    snack_notes,
    dinner_notes,
    basketball_rpe,
    basketball_duration_minutes,
    walk_completed,
  } = req.body;

  try {
    const query = `
      INSERT INTO daily_logs (date, food_rating, breakfast_notes, lunch_notes, snack_notes, dinner_notes, basketball_rpe, basketball_duration_minutes, walk_completed)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (date) DO UPDATE SET
        food_rating = EXCLUDED.food_rating,
        breakfast_notes = EXCLUDED.breakfast_notes,
        lunch_notes = EXCLUDED.lunch_notes,
        snack_notes = EXCLUDED.snack_notes,
        dinner_notes = EXCLUDED.dinner_notes,
        basketball_rpe = EXCLUDED.basketball_rpe,
        basketball_duration_minutes = EXCLUDED.basketball_duration_minutes,
        walk_completed = EXCLUDED.walk_completed
      RETURNING *;
    `;
    const values = [
      date,
      food_rating,
      breakfast_notes,
      lunch_notes,
      snack_notes,
      dinner_notes,
      basketball_rpe,
      basketball_duration_minutes,
      walk_completed || false,
    ];

    const result = await pool.query(query, values);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const getCalendarSummary = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        dl.date, 
        dl.food_rating, 
        dl.basketball_duration_minutes,
        dl.walk_completed,
        (SELECT COUNT(*) FROM weight_sessions ws WHERE ws.date = dl.date) as weight_sessions_count
      FROM daily_logs dl
      ORDER BY dl.date ASC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

module.exports = { getDailyLogByDate, getCalendarSummary, upsertDailyLog };
