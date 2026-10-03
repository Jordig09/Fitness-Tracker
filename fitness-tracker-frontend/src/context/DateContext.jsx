import { createContext, useState, useEffect } from "react";

// Formatea la fecha a YYYY-MM-DD para la base de datos
const formatDate = (dateObj) => {
  return dateObj.toISOString().split("T")[0];
};

export const DateContext = createContext();

export const DateProvider = ({ children }) => {
  const [activeDateObj, setActiveDateObj] = useState(new Date());
  const [activeDate, setActiveDate] = useState(formatDate(new Date()));
  const [isEditing, setIsEditing] = useState(true);

  // Cada vez que cambias la fecha en el calendario, actualizamos el string y el estado de edición
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

  return (
    <DateContext.Provider
      value={{
        activeDateObj,
        setActiveDateObj,
        activeDate,
        isEditing,
        setIsEditing,
      }}
    >
      {children}
    </DateContext.Provider>
  );
};
