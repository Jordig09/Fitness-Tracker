import React, { useContext, useState, useEffect } from "react";
import { DateContext } from "../context/DateContext";
import api from "../services/api";

const Nutrition = () => {
  const { activeDate, isEditing } = useContext(DateContext);
  const [formData, setFormData] = useState({
    food_rating: "",
    breakfast_notes: "",
    lunch_notes: "",
    snack_notes: "",
    dinner_notes: "",
  });

  // Buscar los datos al cargar el día
  useEffect(() => {
    const fetchDailyLog = async () => {
      try {
        const response = await api.get(`/daily-logs/${activeDate}`);
        if (response.data) {
          setFormData({
            food_rating: response.data.food_rating || "",
            breakfast_notes: response.data.breakfast_notes || "",
            lunch_notes: response.data.lunch_notes || "",
            snack_notes: response.data.snack_notes || "",
            dinner_notes: response.data.dinner_notes || "",
          });
        } else {
          // Limpiar si es un día nuevo sin datos
          setFormData({
            food_rating: "",
            breakfast_notes: "",
            lunch_notes: "",
            snack_notes: "",
            dinner_notes: "",
          });
        }
      } catch (error) {
        console.error("Error fetching daily log:", error);
      }
    };

    fetchDailyLog();
  }, [activeDate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      // 1. Buscamos el estado actual del día para no borrar los datos de básquet
      const currentLogRes = await api.get(`/daily-logs/${activeDate}`);
      const currentData = currentLogRes.data || {};

      // 2. Mezclamos los datos existentes (básquet) con los nuevos de alimentación
      const payload = {
        ...currentData,
        date: activeDate,
        food_rating: formData.food_rating,
        breakfast_notes: formData.breakfast_notes,
        lunch_notes: formData.lunch_notes,
        snack_notes: formData.snack_notes,
        dinner_notes: formData.dinner_notes,
      };

      // 3. Enviamos el paquete completo
      await api.post("/daily-logs", payload);
      alert("Datos de alimentación guardados correctamente");
    } catch (error) {
      console.error("Error saving nutrition:", error);
      alert("Hubo un error al guardar la alimentación.");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <label>
          <select
            name="food_rating"
            value={formData.food_rating}
            onChange={handleChange}
            disabled={!isEditing}
            style={{ padding: "0.5rem" }}
            required
          >
            <option value="" disabled>
              Calificación...
            </option>
            <option value="Muy Mala">Muy Mala</option>
            <option value="Mala">Mala</option>
            <option value="Regular">Regular</option>
            <option value="Buena">Buena</option>
            <option value="Muy Buena">Muy Buena</option>
          </select>
        </label>

        <textarea
          name="breakfast_notes"
          placeholder="Desayuno"
          value={formData.breakfast_notes}
          onChange={handleChange}
          disabled={!isEditing}
          style={{ padding: "0.5rem", minHeight: "60px" }}
        />
        <textarea
          name="lunch_notes"
          placeholder="Almuerzo"
          value={formData.lunch_notes}
          onChange={handleChange}
          disabled={!isEditing}
          style={{ padding: "0.5rem", minHeight: "60px" }}
        />
        <textarea
          name="snack_notes"
          placeholder="Merienda"
          value={formData.snack_notes}
          onChange={handleChange}
          disabled={!isEditing}
          style={{ padding: "0.5rem", minHeight: "60px" }}
        />
        <textarea
          name="dinner_notes"
          placeholder="Cena"
          value={formData.dinner_notes}
          onChange={handleChange}
          disabled={!isEditing}
          style={{ padding: "0.5rem", minHeight: "60px" }}
        />

        {isEditing && (
          <button
            onClick={handleSave}
            style={{
              padding: "1rem",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1.1rem",
              marginTop: "1rem",
            }}
          >
            Guardar Alimentación
          </button>
        )}
      </div>
    </div>
  );
};

export default Nutrition;
