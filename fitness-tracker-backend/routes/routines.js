const express = require("express");
const router = express.Router();
const { getAllRoutines } = require("../controllers/routineController");

router.get("/", getAllRoutines);

module.exports = router;
