import React, { useState, useEffect, useContext } from "react";
import { DateContext } from "../context/DateContext";
import api from "../services/api";
import { routineTemplates } from "../config/routineTemplates";

const WeightTraining = () => {
  const { activeDate, isEditing } = useContext(DateContext);

  const [routines, setRoutines] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [selectedRoutine, setSelectedRoutine] = useState("");
  const [blocks, setBlocks] = useState([]);

  const [hasExistingData, setHasExistingData] = useState(false);
  const [walkCompleted, setWalkCompleted] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const routinesRes = await api.get("/routines");
        const exercisesRes = await api.get("/exercises");
        setRoutines(routinesRes.data);
        setAllExercises(exercisesRes.data);

        // Buscar estado de la caminata
        const logRes = await api.get(`/daily-logs/${activeDate}`);
        setWalkCompleted(logRes.data?.walk_completed || false);

        // Buscar si ya hay una rutina guardada HOY
        const sessionRes = await api.get(`/weight-sessions/${activeDate}`);
        if (sessionRes.data) {
          const { routine_id, sets } = sessionRes.data;
          setSelectedRoutine(routine_id);

          const template = routineTemplates[routine_id];
          // Reconstruimos los bloques usando los datos guardados
          const loadedBlocks = template.map((block) => {
            // Buscamos si hay alguna serie guardada que pertenezca a las opciones de este bloque
            const savedSet = sets.find((s) =>
              block.options.includes(s.exercise_id),
            );
            if (savedSet) {
              const exId = savedSet.exercise_id;
              const blockSets = sets.filter((s) => s.exercise_id === exId);
              return { ...block, selectedExerciseId: exId, sets: blockSets };
            }
            return { ...block, selectedExerciseId: "", sets: [] };
          });

          setBlocks(loadedBlocks);
          setHasExistingData(true);
        } else {
          // Día limpio
          setSelectedRoutine("");
          setBlocks([]);
          setHasExistingData(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchInitialData();
  }, [activeDate]);

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
        const res = await api.get(`/exercises/${exerciseId}/last-execution`);
        if (res.data && res.data.length > 0) {
          newBlocks[blockIndex].sets = res.data;
        } else {
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

    setBlocks(newBlocks);
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
      await api.post("/weight-sessions", payload);
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
      await api.delete(`/weight-sessions/${activeDate}`);
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
      const currentLogRes = await api.get(`/daily-logs/${activeDate}`);
      const currentData = currentLogRes.data || {};
      await api.post("/daily-logs", {
        ...currentData,
        date: activeDate,
        walk_completed: isChecked,
      });
    } catch (error) {
      console.error("Error guardando caminata", error);
    }
  };

  return (
    <div style={{ paddingBottom: "2rem" }}>
      <select
        value={selectedRoutine}
        onChange={handleRoutineChange}
        disabled={!isEditing}
        style={{
          padding: "0.5rem",
          width: "100%",
          marginBottom: "1.5rem",
          backgroundColor: hasExistingData ? "#e9ecef" : "#fff",
        }}
      >
        <option value="">-- Selecciona una Rutina --</option>
        {routines.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>

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
          backgroundColor: "#e9f2ff",
          border: "1px solid #b8daff",
          borderRadius: "8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h3 style={{ margin: 0, color: "#004085", fontSize: "1.1rem" }}>
            Caminata Post-Entreno
          </h3>
          <small style={{ color: "#004085" }}>
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
