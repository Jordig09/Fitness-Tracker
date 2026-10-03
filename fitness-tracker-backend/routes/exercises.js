const express = require("express");
const router = express.Router();
const {
  getAllExercises,
  getLastExecution,
} = require("../controllers/exerciseController");

router.get("/", getAllExercises);
router.get("/:id/last-execution", getLastExecution);

module.exports = router;
