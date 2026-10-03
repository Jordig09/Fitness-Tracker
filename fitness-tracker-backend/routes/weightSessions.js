const express = require("express");
const router = express.Router();
const {
  getWeightSessionByDate,
  deleteWeightSession,
  createWeightSession,
} = require("../controllers/weightSessionController");

router.get("/:date", getWeightSessionByDate);
router.delete("/:date", deleteWeightSession);
router.post("/", createWeightSession);

module.exports = router;
