const express = require("express");
const router = express.Router();
const {
  getDailyLogByDate,
  getCalendarSummary,
  upsertDailyLog,
} = require("../controllers/dailyLogController");

router.get("/summary/calendar", getCalendarSummary);
router.get("/:date", getDailyLogByDate);
router.post("/", upsertDailyLog);

module.exports = router;
