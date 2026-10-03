import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { DateContext } from "../context/DateContext";

const Header = () => {
  const { activeDate, isEditing, setIsEditing } = useContext(DateContext);
  const location = useLocation();

  // Función para determinar el título según la URL actual
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
      {/* Título dinámico */}
      <div
        style={{
          padding: "1rem",
          backgroundColor: "#fff",
          borderBottom: "1px solid #eaeaea",
        }}
      >
        <h2
          style={{
            margin: 0,
            textAlign: "center",
            fontSize: "1.2rem",
            color: "#333",
          }}
        >
          {getPageTitle()}
        </h2>
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
            borderBottom: "1px solid #eaeaea",
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
