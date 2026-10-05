import React, { useContext, useState, useEffect } from "react";
import { DateContext } from "../context/DateContext";
import api from "../services/api";

const Basketball = () => {
  // Trae dailyLog y updateDailyLogLocally desde DateContext
  const { activeDate, isEditing, dailyLog, updateDailyLogLocally } =
    useContext(DateContext);
  const [formData, setFormData] = useState({
    basketball_rpe: 0,
    basketball_duration_minutes: "",
  });
  const [hasExistingData, setHasExistingData] = useState(false);

  // Mira la memoria (dailyLog)
  useEffect(() => {
    if (dailyLog && dailyLog.basketball_duration_minutes) {
      setFormData({
        basketball_rpe: dailyLog.basketball_rpe || 0,
        basketball_duration_minutes: dailyLog.basketball_duration_minutes,
      });
      setHasExistingData(true);
    } else {
      setFormData({ basketball_rpe: 0, basketball_duration_minutes: "" });
      setHasExistingData(false);
    }
  }, [dailyLog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === "" ? "" : Number(value),
    });
  };

  const handleSave = async () => {
    if (!formData.basketball_duration_minutes) {
      alert("Por favor ingresa la duración del entrenamiento.");
      return;
    }

    try {
      // Usa el dailyLog de la memoria
      const payload = {
        ...dailyLog,
        date: activeDate,
        basketball_rpe: formData.basketball_rpe,
        basketball_duration_minutes: formData.basketball_duration_minutes,
      };

      // Guarda en la Base de Datos
      await api.post("/daily-logs", payload);

      // Actualiza la memoria local
      updateDailyLogLocally(payload);

      setHasExistingData(true);
      alert(
        hasExistingData
          ? "Sesión actualizada correctamente"
          : "Sesión guardada correctamente",
      );
    } catch (error) {
      console.error("Error saving basketball data:", error);
      alert("Hubo un error al guardar.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar este entrenamiento?",
    );
    if (!confirmDelete) return;

    try {
      // Usa la memoria para armar el paquete de borrado
      const payload = {
        ...dailyLog,
        date: activeDate,
        basketball_rpe: null,
        basketball_duration_minutes: null,
      };

      // Borra en la Base de Datos
      await api.post("/daily-logs", payload);

      // Actualiza la memoria local
      updateDailyLogLocally(payload);

      setFormData({ basketball_rpe: 0, basketball_duration_minutes: "" });
      setHasExistingData(false);
    } catch (error) {
      console.error("Error deleting basketball data:", error);
      alert("Hubo un error al eliminar.");
    }
  };

  const cargaEntrenamiento =
    (formData.basketball_rpe || 0) *
    (formData.basketball_duration_minutes || 0);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          marginTop: "1rem",
        }}
      >
        <label
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <strong>
            Intensidad Percibida (RPE): {formData.basketball_rpe} / 10
          </strong>
          <input
            type="range"
            name="basketball_rpe"
            min="1"
            max="10"
            step="1"
            value={formData.basketball_rpe}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <small style={{ color: "#666" }}>
            1 = Muy suave | 10 = Esfuerzo máximo
          </small>
        </label>

        <label
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <strong>Duración (Minutos)</strong>
          <input
            type="number"
            name="basketball_duration_minutes"
            value={formData.basketball_duration_minutes}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Ej: 90"
            style={{ padding: "0.5rem", fontSize: "1rem" }}
          />
        </label>

        <div
          style={{
            backgroundColor: "var(--navbar-bg)",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "1rem",
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: 0 }}>
            Carga del Entrenamiento: {cargaEntrenamiento} UA
          </h3>
          <small>Calculado por sRPE (Intensidad × Volumen)</small>
        </div>

        {isEditing && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              marginTop: "0.5rem",
            }}
          >
            {!hasExistingData ? (
              <button
                onClick={handleSave}
                style={{
                  padding: "1rem",
                  backgroundColor: "#fd7e14",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1.1rem",
                }}
              >
                Guardar Sesión
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  style={{
                    padding: "1rem",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                  }}
                >
                  Actualizar Sesión
                </button>
                <button
                  onClick={handleDelete}
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
      </div>
    </div>
  );
};

export default Basketball;
