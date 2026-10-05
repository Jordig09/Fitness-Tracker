import React, { useState, useEffect, useContext } from "react";
import { DateContext } from "../context/DateContext";
import api from "../services/api";
import { routineTemplates } from "../config/routineTemplates";

const WeightTraining = () => {
  // Trae dailyLog y updateDailyLogLocally para actualizar el Dashboard
  const { activeDate, isEditing, dailyLog, updateDailyLogLocally } =
    useContext(DateContext);

  const [routines, setRoutines] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [selectedRoutine, setSelectedRoutine] = useState("");
  const [blocks, setBlocks] = useState([]);

  const [hasExistingData, setHasExistingData] = useState(false);
  const [walkCompleted, setWalkCompleted] = useState(false);

  // Sincroniza el estado de la caminata con las memoria local
  useEffect(() => {
    if (dailyLog) {
      setWalkCompleted(dailyLog.walk_completed || false);
    }
  }, [dailyLog]);

  // 2. Carga Rutinas, Ejercicios y la Sesión de Hoy
  useEffect(() => {
    const fetchTrainingData = async () => {
      try {
        // CACHÉ DE DATOS ESTÁTICOS (Rutinas y Ejercicios)
        let loadedRoutines = JSON.parse(
          localStorage.getItem("static_routines"),
        );
        let loadedExercises = JSON.parse(
          localStorage.getItem("static_exercises"),
        );

        if (!loadedRoutines || !loadedExercises) {
          const [routinesRes, exercisesRes] = await Promise.all([
            api.get("/routines"),
            api.get("/exercises"),
          ]);
          loadedRoutines = routinesRes.data;
          loadedExercises = exercisesRes.data;
          localStorage.setItem(
            "static_routines",
            JSON.stringify(loadedRoutines),
          );
          localStorage.setItem(
            "static_exercises",
            JSON.stringify(loadedExercises),
          );
        }
        setRoutines(loadedRoutines);
        setAllExercises(loadedExercises);

        // CACHÉ DE LA SESIÓN DE HOY
        const cachedSession = localStorage.getItem(
          `weight_session_${activeDate}`,
        );
        if (cachedSession) {
          rebuildBlocks(JSON.parse(cachedSession));
        }

        // Busca en la base de datos
        const sessionRes = await api.get(`/weight-sessions/${activeDate}`);
        if (sessionRes.data) {
          localStorage.setItem(
            `weight_session_${activeDate}`,
            JSON.stringify(sessionRes.data),
          );
          rebuildBlocks(sessionRes.data);
        } else {
          // Si no hay sesión en la BD, limpia la memoria
          localStorage.removeItem(`weight_session_${activeDate}`);
          if (!cachedSession) {
            setSelectedRoutine("");
            setBlocks([]);
            setHasExistingData(false);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTrainingData();
  }, [activeDate]);

  // Función auxiliar para reconstruir los bloques visuales (reutilizable)
  const rebuildBlocks = (sessionData) => {
    const { routine_id, sets } = sessionData;
    setSelectedRoutine(routine_id);

    const template = routineTemplates[routine_id];
    if (!template) return;

    const loadedBlocks = template.map((block) => {
      const savedSet = sets.find((s) => block.options.includes(s.exercise_id));
      if (savedSet) {
        const exId = savedSet.exercise_id;
        const blockSets = sets.filter((s) => s.exercise_id === exId);
        return { ...block, selectedExerciseId: exId, sets: blockSets };
      }
      return { ...block, selectedExerciseId: "", sets: [] };
    });

    setBlocks(loadedBlocks);
    setHasExistingData(true);
  };

  const handleRoutineChange = (e) => {
    const routineId = e.target.value;
    setSelectedRoutine(routineId);

    if (routineId && routineTemplates[routineId]) {
      const template = routineTemplates[routineId];
      const initialBlocks = template.map((block) => ({
        title: block.title,
        options: block.options,
        selectedExerciseId: "",
        sets: [],
      }));
      setBlocks(initialBlocks);
    } else {
      setBlocks([]);
    }
  };

  const handleExerciseSelect = async (blockIndex, exerciseId) => {
    const newBlocks = [...blocks];
    newBlocks[blockIndex].selectedExerciseId = exerciseId;

    if (exerciseId) {
      try {
        // Lee primero del caché para que cargue al instante
        const cachedLastExec = localStorage.getItem(`last_exec_${exerciseId}`);
        if (cachedLastExec) {
          newBlocks[blockIndex].sets = JSON.parse(cachedLastExec);
          setBlocks([...newBlocks]); // Actualiza la vista rápido
        }

        // Consulta a la BD para tener la versión más real
        const res = await api.get(`/exercises/${exerciseId}/last-execution`);
        if (res.data && res.data.length > 0) {
          newBlocks[blockIndex].sets = res.data;
          localStorage.setItem(
            `last_exec_${exerciseId}`,
            JSON.stringify(res.data),
          );
        } else if (!cachedLastExec) {
          newBlocks[blockIndex].sets = [
            { set_number: 1, reps: 0, weight_kg: 0 },
            { set_number: 2, reps: 0, weight_kg: 0 },
            { set_number: 3, reps: 0, weight_kg: 0 },
          ];
        }
      } catch (error) {
        console.error("Error fetching last execution:", error);
      }
    } else {
      newBlocks[blockIndex].sets = [];
    }
    setBlocks([...newBlocks]);
  };

  const handleSetChange = (blockIndex, setIndex, field, value) => {
    const newBlocks = [...blocks];
    newBlocks[blockIndex].sets[setIndex][field] = Number(value);
    setBlocks(newBlocks);
  };

  const handleSaveSession = async () => {
    const flatSets = [];
    blocks.forEach((block) => {
      if (block.selectedExerciseId) {
        block.sets.forEach((set) => {
          flatSets.push({
            exercise_id: block.selectedExerciseId,
            set_number: set.set_number,
            reps: set.reps,
            weight_kg: set.weight_kg,
          });
        });
      }
    });

    const payload = {
      date: activeDate,
      routine_id: selectedRoutine,
      sets: flatSets,
    };

    try {
      // Guarda en BD
      await api.post("/weight-sessions", payload);

      // Guarda la sesión en el caché local
      localStorage.setItem(
        `weight_session_${activeDate}`,
        JSON.stringify(payload),
      );

      // Actualiza la memoria local para que el Dashboard se pinte de amarillo
      const selectedRoutineObj = routines.find(
        (r) => r.id === Number(selectedRoutine),
      );
      updateDailyLogLocally({
        ...dailyLog,
        routine_name: selectedRoutineObj
          ? selectedRoutineObj.name
          : "Entrenamiento",
      });

      setHasExistingData(true);
      alert(
        hasExistingData
          ? "Entrenamiento actualizado correctamente"
          : "Entrenamiento guardado correctamente",
      );
    } catch (error) {
      console.error("Error saving session:", error);
      alert("Hubo un error al guardar.");
    }
  };

  const handleDeleteSession = async () => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar la rutina de este día?",
    );
    if (!confirmDelete) return;

    try {
      // Borra de la BD
      await api.delete(`/weight-sessions/${activeDate}`);

      // Borra del caché
      localStorage.removeItem(`weight_session_${activeDate}`);

      // Actualiza la memoria quitando el nombre de la rutina
      updateDailyLogLocally({
        ...dailyLog,
        routine_name: null,
      });

      setSelectedRoutine("");
      setBlocks([]);
      setHasExistingData(false);
    } catch (error) {
      console.error("Error deleting session:", error);
      alert("Hubo un error al eliminar.");
    }
  };

  const handleWalkToggle = async (e) => {
    const isChecked = e.target.checked;
    setWalkCompleted(isChecked);
    try {
      // Usa el estado en memoria
      const payload = {
        ...dailyLog,
        date: activeDate,
        walk_completed: isChecked,
      };

      await api.post("/daily-logs", payload);
      updateDailyLogLocally(payload); // Actualiza el dashboard al instante
    } catch (error) {
      console.error("Error guardando caminata", error);
    }
  };

  return (
    <div style={{ paddingBottom: "2rem" }}>
      <label>
        <select
          value={selectedRoutine}
          onChange={handleRoutineChange}
          disabled={!isEditing}
          style={{
            padding: "0.5rem",
            width: "100%",
            marginBottom: "1.5rem",
          }}
        >
          <option value="">-- Selecciona una Rutina --</option>
          {routines.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </label>
      {blocks.map((block, bIndex) => (
        <div
          key={bIndex}
          style={{
            border: "1px solid #ddd",
            padding: "1rem",
            marginBottom: "1rem",
            borderRadius: "8px",
          }}
        >
          <h3>{block.title}</h3>

          <select
            value={block.selectedExerciseId}
            onChange={(e) => handleExerciseSelect(bIndex, e.target.value)}
            disabled={!isEditing}
            style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
          >
            <option value="">Selecciona un ejercicio...</option>
            {allExercises
              .filter((ex) => block.options.includes(ex.id))
              .map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
          </select>

          {block.sets.length > 0 && (
            <table style={{ width: "100%", textAlign: "center" }}>
              <thead>
                <tr>
                  <th>Serie</th>
                  <th>Reps</th>
                  <th>Peso (kg)</th>
                </tr>
              </thead>
              <tbody>
                {block.sets.map((set, sIndex) => (
                  <tr key={sIndex}>
                    <td>{set.set_number}</td>
                    <td>
                      <input
                        type="number"
                        value={set.reps || ""}
                        onChange={(e) =>
                          handleSetChange(
                            bIndex,
                            sIndex,
                            "reps",
                            e.target.value,
                          )
                        }
                        disabled={!isEditing}
                        style={{ width: "60px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.5"
                        value={set.weight_kg || ""}
                        onChange={(e) =>
                          handleSetChange(
                            bIndex,
                            sIndex,
                            "weight_kg",
                            e.target.value,
                          )
                        }
                        disabled={!isEditing}
                        style={{ width: "80px" }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}

      {/* Botones Dinámicos de Guardado/Actualizado/Borrado */}
      {blocks.length > 0 && isEditing && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          {!hasExistingData ? (
            <button
              onClick={handleSaveSession}
              style={{
                padding: "1rem",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1.1rem",
              }}
            >
              Guardar Entrenamiento
            </button>
          ) : (
            <>
              <button
                onClick={handleSaveSession}
                style={{
                  padding: "1rem",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1.1rem",
                }}
              >
                Actualizar Entrenamiento
              </button>
              <button
                onClick={handleDeleteSession}
                style={{
                  padding: "1rem",
                  backgroundColor: "transparent",
                  color: "#dc3545",
                  border: "1px solid #dc3545",
                  borderRadius: "8px",
                  fontSize: "1.1rem",
                }}
              >
                Borrar Entrenamiento
              </button>
            </>
          )}
        </div>
      )}

      {/* Tarjeta de Caminata */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          backgroundColor: "var(--walking-bg)",
          border: "1px solid #b8daff",
          borderRadius: "8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              color: "var(--walking-color)",
              fontSize: "1.1rem",
            }}
          >
            Caminata Post-Entreno
          </h3>
          <small style={{ color: "var(--walking-color)" }}>
            40 minutos de cardio ligero
          </small>
        </div>
        <input
          type="checkbox"
          checked={walkCompleted}
          onChange={handleWalkToggle}
          disabled={!isEditing}
          style={{ width: "25px", height: "25px" }}
        />
      </div>
    </div>
  );
};

export default WeightTraining;
