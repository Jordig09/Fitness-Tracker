import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { DateContext } from "../context/DateContext";

const Header = () => {
  const { activeDate, isEditing, setIsEditing } = useContext(DateContext);
  const location = useLocation();

  // Lógica del Modo Oscuro
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Determina el título según la URL actual
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Fitness Tracker";
      case "/calendar":
        return "Calendario";
      case "/weights":
        return "Musculación";
      case "/basketball":
        return "Básquet";
      case "/nutrition":
        return "Comida";
      default:
        return "Fitness Tracker";
    }
  };

  const todayString = new Date().toISOString().split("T")[0];
  const isToday = activeDate === todayString;

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 10 }}>
      {/* Título dinámico y Botón de Tema */}
      <div
        style={{
          padding: "1rem",
          backgroundColor: "var(--navbar-bg)",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          transition: "background-color 0.3s ease, border-color 0.3s ease",
        }}
      >
        <h2
          style={{
            margin: 0,
            textAlign: "center",
            fontSize: "1.2rem",
            color: "var(--text-color)",
            transition: "color 0.3s ease",
          }}
        >
          {getPageTitle()}
        </h2>

        {/* Botón de Alternar Modo Oscuro */}
        <button
          onClick={toggleTheme}
          style={{
            position: "absolute",
            right: "1rem",
            width: "auto",
            padding: "0.3rem 0.6rem",
            borderRadius: "20px",
            cursor: "pointer",
            background: "transparent",
            border: "1px solid var(--border-color)",
            color: "var(--text-color)",
            fontSize: "1.2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Alternar Modo Oscuro"
        >
          {isDarkMode ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="#e0e0e0"
            >
              <path
                fill="#e0e0e0"
                d="M20 15.31L23.31 12L20 8.69V4h-4.69L12 .69L8.69 4H4v4.69L.69 12L4 15.31V20h4.69L12 23.31L15.31 20H20v-4.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6s6 2.69 6 6s-2.69 6-6 6z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="#333"
            >
              <path
                fill="#333"
                d="M9 2c-1.05 0-2.05.16-3 .46c4.06 1.27 7 5.06 7 9.54c0 4.48-2.94 8.27-7 9.54c.95.3 1.95.46 3 .46c5.52 0 10-4.48 10-10S14.52 2 9 2z"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Barra de alerta de fecha pasada */}
      {!isToday && (
        <div
          style={{
            backgroundColor: isEditing ? "#d1ecf1" : "#fff3cd",
            color: isEditing ? "#0c5460" : "#856404",
            padding: "0.6rem 1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.9rem",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <span>
            {isEditing ? `Editando: ${activeDate}` : `Viendo: ${activeDate}`}
          </span>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                width: "auto",
                padding: "0.3rem 0.8rem",
                backgroundColor: "#ffc107",
                border: "none",
                color: "#000",
                borderRadius: "4px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Editar
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
