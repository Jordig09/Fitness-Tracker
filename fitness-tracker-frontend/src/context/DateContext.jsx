import { createContext, useState, useEffect } from "react";
import api from "../services/api";

// Formatea la fecha a YYYY-MM-DD para la base de datos
const formatDate = (dateObj) => {
  return dateObj.toISOString().split("T")[0];
};

export const DateContext = createContext();

export const DateProvider = ({ children }) => {
  const [activeDateObj, setActiveDateObj] = useState(new Date());
  const [activeDate, setActiveDate] = useState(formatDate(new Date()));
  const [isEditing, setIsEditing] = useState(true);

  // Estado global para el resumen del día
  const [dailyLog, setDailyLog] = useState(null);

  //Controla la fecha y el bloqueo de edición de días pasados
  useEffect(() => {
    const dateString = formatDate(activeDateObj);
    setActiveDate(dateString);

    const todayString = formatDate(new Date());

    // Si la fecha activa es distinta a hoy, bloqueamos la edición por defecto
    if (dateString !== todayString) {
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [activeDateObj]);

  //Maneja la caché local y la petición a la BD
  useEffect(() => {
    const fetchDailyData = async () => {
      // Mostrar instantáneamente lo que haya en la memoria local
      const cachedData = localStorage.getItem(`dailyLog_${activeDate}`);
      if (cachedData) {
        setDailyLog(JSON.parse(cachedData));
      } else {
        setDailyLog(null); // Limpiar si es un día nuevo sin caché
      }

      const token = localStorage.getItem("token");
      if (!token) return;

      // Pedir a la base de datos para ver si hay datos nuevos
      try {
        const response = await api.get(`/daily-logs/${activeDate}`);
        const dbData = response.data || null;

        // Actualizar la memoria y el caché local con la verdad absoluta de la BD
        setDailyLog(dbData);
        if (dbData) {
          localStorage.setItem(
            `dailyLog_${activeDate}`,
            JSON.stringify(dbData),
          );
        }
      } catch (error) {
        console.error("Error fetching daily log:", error);
      }
    };

    fetchDailyData();
  }, [activeDate]);

  // Actualizar al presionar "Guardar"
  const updateDailyLogLocally = (newData) => {
    setDailyLog(newData);
    localStorage.setItem(`dailyLog_${activeDate}`, JSON.stringify(newData));
  };

  return (
    <DateContext.Provider
      value={{
        activeDateObj,
        setActiveDateObj,
        activeDate,
        isEditing,
        setIsEditing,
        dailyLog,
        updateDailyLogLocally,
      }}
    >
      {children}
    </DateContext.Provider>
  );
};
