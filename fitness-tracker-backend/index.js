require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Imports de rutas
const routinesRouter = require("./routes/routines");
const exercisesRouter = require("./routes/exercises");
const dailyLogsRouter = require("./routes/dailyLogs");
const weightSessionsRouter = require("./routes/weightSessions");
const loginRouter = require("./routes/login");

// Imports de middlewares
const errorHandler = require("./middlewares/errorHandler");
const verifyToken = require("./middlewares/auth");

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

app.use("/api/login", loginRouter);

app.use(verifyToken);

// Registro de rutas
app.use("/api/routines", routinesRouter);
app.use("/api/exercises", exercisesRouter);
app.use("/api/daily-logs", dailyLogsRouter);
app.use("/api/weight-sessions", weightSessionsRouter);

// Middleware de manejo de errores (DEBE ir siempre al final de las rutas)
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
