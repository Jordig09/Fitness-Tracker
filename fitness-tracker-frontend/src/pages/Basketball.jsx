import React, { useContext, useState, useEffect } from "react";
import { DateContext } from "../context/DateContext";
import api from "../services/api";

const Basketball = () => {
  const { activeDate, isEditing } = useContext(DateContext);
  const [formData, setFormData] = useState({
    basketball_rpe: 0,
    basketball_duration_minutes: "",
  });
  // Nuevo estado para controlar qué botones mostrar
  const [hasExistingData, setHasExistingData] = useState(false);

  // Buscar los datos al cargar el día
  useEffect(() => {
    const fetchDailyLog = async () => {
      try {
        const response = await api.get(`/daily-logs/${activeDate}`);
        // Verificamos si hay un registro y si efectivamente tiene minutos de básquet cargados
        if (response.data && response.data.basketball_duration_minutes) {
          setFormData({
            basketball_rpe: response.data.basketball_rpe || 0,
            basketball_duration_minutes:
              response.data.basketball_duration_minutes,
          });
          setHasExistingData(true); // Hay datos previos
        } else {
          setFormData({ basketball_rpe: 0, basketball_duration_minutes: "" });
          setHasExistingData(false); // Es una sesión nueva
        }
      } catch (error) {
        console.error("Error fetching daily log:", error);
      }
    };
    fetchDailyLog();
  }, [activeDate]);

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
      const currentLogRes = await api.get(`/daily-logs/${activeDate}`);
      const currentData = currentLogRes.data || {};

      const payload = {
        ...currentData,
        date: activeDate,
        basketball_rpe: formData.basketball_rpe,
        basketball_duration_minutes: formData.basketball_duration_minutes,
      };

      await api.post("/daily-logs", payload);
      setHasExistingData(true); // Al guardar exitosamente, pasamos al modo edición
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
    // Pedimos confirmación antes de borrar
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar este entrenamiento?",
    );
    if (!confirmDelete) return;

    try {
      const currentLogRes = await api.get(`/daily-logs/${activeDate}`);
      const currentData = currentLogRes.data || {};

      const payload = {
        ...currentData,
        date: activeDate,
        basketball_rpe: null, // Anulamos los datos
        basketball_duration_minutes: null,
      };

      await api.post("/daily-logs", payload);

      // Reseteamos la vista al estado inicial
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
            backgroundColor: "#e9ecef",
            padding: "1rem",
            borderRadius: "8px",
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
              // Vista de Creación
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
              // Vista de Edición / Borrado
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
