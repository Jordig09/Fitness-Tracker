import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DateContext } from "../context/DateContext";
import api from "../services/api";

const Dashboard = () => {
  const { activeDate } = useContext(DateContext);
  const [dailyLog, setDailyLog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get(`/daily-logs/${activeDate}`);
        setDailyLog(response.data);
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };
    fetchSummary();
  }, [activeDate]);

  // Función para evaluar el color dinámico de la nutrición
  const getFoodColor = (rating) => {
    switch (rating) {
      case "Muy Buena":
        return "var(--food-muy-buena)";
      case "Buena":
        return "var(--food-buena)";
      case "Regular":
        return "var(--food-regular)";
      case "Mala":
        return "var(--food-mala)";
      case "Muy Mala":
        return "var(--food-muy-mala)";
      default:
        return "var(--card-default)";
    }
  };

  // Función de estilo dinámico: si está completado usa el color pasado, sino gris
  const getCardStyle = (isCompleted, completedColor) => ({
    padding: "1rem",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    backgroundColor: isCompleted ? completedColor : "var(--navbar-bg)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    transition: "background-color 0.2s ease, border-color 0.2s ease",
  });

  const textColStyle = { flex: 1 };
  const h3Style = {
    margin: "0 0 0.2rem 0",
    fontSize: "1.1rem",
    color: "var(--text-color)",
  };
  const pStyle = { margin: 0, fontSize: "0.9rem", color: "var(--text-color)" };

  const iconSize = "40";
  const iconColor = "#a0a0a0";

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {/* Tarjeta de Musculación */}
        <div
          style={{
            ...getCardStyle(
              !!dailyLog?.routine_name,
              "var(--card-musculacion)",
            ),
            gridColumn: "1 / -1",
          }}
          onClick={() => navigate("/weights")}
        >
          <div style={textColStyle}>
            <h3 style={h3Style}>Musculación</h3>
            {dailyLog?.routine_name ? (
              <p style={pStyle}>
                Rutina: <strong>{dailyLog.routine_name}</strong>
              </p>
            ) : (
              <p style={pStyle}>Día de descanso</p>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 48 48"
              fill="var(--icon-color)"
            >
              <g
                fill="none"
                stroke="var(--icon-color)"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
              >
                <path d="M9.102 13.727c.032-1.321.78-2.503 2.092-2.656c.378-.043.812-.071 1.306-.071s.928.028 1.306.072c1.313.152 2.06 1.334 2.092 2.655c.047 1.944.102 5.29.102 10.273s-.055 8.329-.102 10.273c-.032 1.321-.78 2.503-2.092 2.656c-.378.043-.812.071-1.306.071s-.928-.028-1.306-.071c-1.313-.153-2.06-1.335-2.092-2.656C9.055 32.329 9 28.983 9 24s.055-8.329.102-10.273m29.796 0c-.032-1.321-.78-2.503-2.092-2.656c-.378-.043-.812-.071-1.306-.071s-.928.028-1.306.072c-1.313.152-2.06 1.334-2.092 2.655C32.055 15.671 32 19.017 32 24s.055 8.329.102 10.273c.032 1.321.78 2.503 2.092 2.656c.378.043.812.071 1.306.071s.928-.028 1.306-.071c1.313-.153 2.06-1.335 2.092-2.656c.047-1.944.102-5.29.102-10.273s-.055-8.329-.102-10.273" />
                <path d="M15.993 26.982a1293 1293 0 0 0 16.014-.013m-.001-5.939c-2.414-.017-5.4-.03-9.007-.03c-2.668 0-4.998.007-7.007.018M3.055 18.803c.036-1.49.984-2.748 2.474-2.796a15 15 0 0 1 .942 0c1.49.048 2.438 1.305 2.474 2.796C8.975 20.026 9 21.739 9 24s-.026 3.974-.055 5.197c-.036 1.49-.984 2.748-2.474 2.796a15 15 0 0 1-.942 0c-1.49-.048-2.438-1.305-2.474-2.796C3.025 27.974 3 26.261 3 24s.026-3.974.055-5.197m41.89 0c-.036-1.49-.984-2.748-2.474-2.796a15 15 0 0 0-.942 0c-1.49.048-2.438 1.305-2.474 2.796C39.025 20.026 39 21.739 39 24s.026 3.974.055 5.197c.036 1.49.984 2.748 2.474 2.796a15 15 0 0 0 .942 0c1.49-.048 2.438-1.305 2.474-2.796c.03-1.223.055-2.936.055-5.197s-.026-3.974-.055-5.197" />
              </g>
            </svg>
          </div>
        </div>

        {/* Tarjeta de Caminata */}
        <div
          style={{
            ...getCardStyle(!!dailyLog?.walk_completed, "var(--card-caminata)"),
            gridColumn: "1 / -1",
          }}
          onClick={() => navigate("/weights")}
        >
          <div style={textColStyle}>
            <h3 style={h3Style}>Caminata</h3>
            {dailyLog?.walk_completed ? (
              <p
                style={{
                  ...pStyle,
                  color: "var(--primary)",
                  fontWeight: "bold",
                }}
              >
                ✅ Realizada
              </p>
            ) : (
              <p style={pStyle}>No realizada</p>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={iconSize}
              height={iconSize}
              viewBox="0 0 48 48"
              fill="var(--icon-color)"
            >
              <g fill="var(--icon-color)">
                <path d="M31.25 8a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-5.557 20.397l5.193 5.124a2 2 0 0 1 .457.693l2.769 7.055a2 2 0 0 1-3.724 1.462l-2.614-6.661l-8.928-8.81a2 2 0 0 1-.583-1.649l.715-6.32c-1.724 1.714-3.054 4.123-4.073 7.316a2 2 0 1 1-3.81-1.216c1.87-5.86 4.975-10.246 10.185-12.257l.023-.009c1.327-.493 2.707-.453 3.937.182c1.181.611 2.022 1.666 2.573 2.848c.232.498.446.963.648 1.4c.488 1.058.898 1.95 1.293 2.732c.553 1.1.998 1.83 1.438 2.342c.408.474.813.766 1.33.968c.556.217 1.335.367 2.538.403a2 2 0 1 1-.12 3.998c-1.445-.043-2.728-.228-3.873-.675c-1.183-.462-2.116-1.165-2.91-2.09c-.5-.582-.94-1.247-1.35-1.97z" />
                <path d="m18.263 30.22l3.315 3.18l-1.526 5.147a2 2 0 0 1-.684 1.006l-5.134 4.023a2 2 0 0 1-2.467-3.15l4.632-3.628l1.395-4.71z" />
              </g>
            </svg>
          </div>
        </div>

        {/* Tarjeta de Básquet */}
        <div
          style={{
            ...getCardStyle(
              !!dailyLog?.basketball_duration_minutes,
              "var(--card-basquet)",
            ),
            gridColumn: "1 / -1",
          }}
          onClick={() => navigate("/basketball")}
        >
          <div style={textColStyle}>
            <h3 style={h3Style}>Básquet</h3>
            {dailyLog?.basketball_duration_minutes ? (
              <>
                <p style={pStyle}>{dailyLog.basketball_duration_minutes} min</p>
                <p style={pStyle}>
                  Carga:{" "}
                  <strong>
                    {dailyLog.basketball_duration_minutes *
                      dailyLog.basketball_rpe}{" "}
                    UA
                  </strong>
                </p>
              </>
            ) : (
              <p style={pStyle}>Sin entrenamiento</p>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 32 32"
              fill="var(--icon-color)"
            >
              <path d="M16 1.5C7.992 1.5 1.5 7.992 1.5 16S7.992 30.5 16 30.5S30.5 24.008 30.5 16S24.008 1.5 16 1.5ZM3.002 15.793A11.525 11.525 0 0 0 6.54 13.75c1.19-1 2.14-2.2 2.83-3.53c.8.41 1.58.85 2.35 1.32a25.317 25.317 0 0 0-5.507 13.017a12.95 12.95 0 0 1-3.211-8.764Zm11.568 13.13a12.953 12.953 0 0 1-7.397-3.379A24.382 24.382 0 0 1 12.61 12.11c1 .65 1.96 1.34 2.89 2.08c-.19.2-.37.4-.55.62c-1.95 2.39-2.85 5.4-2.54 8.48a11.53 11.53 0 0 0 2.16 5.632Zm10.382-3.496A12.955 12.955 0 0 1 16 29h-.013a10.424 10.424 0 0 1-2.527-5.82a10.497 10.497 0 0 1 2.86-8.33a37.288 37.288 0 0 1 8.632 10.577Zm3.623-12.738C28.852 13.746 29 14.856 29 16c0 3.314-1.24 6.338-3.28 8.634a38.103 38.103 0 0 0-8.63-10.504c1.61-1.39 3.61-2.25 5.77-2.47a10.44 10.44 0 0 1 5.715 1.03ZM22.62 4.81a13.045 13.045 0 0 1 5.52 6.535a11.477 11.477 0 0 0-5.391-.735c-2.44.25-4.69 1.24-6.49 2.84c-.95-.76-1.94-1.48-2.96-2.15a24.548 24.548 0 0 1 9.321-6.49Zm-11.993-.65A12.953 12.953 0 0 1 16 3c1.932 0 3.765.421 5.413 1.177A25.554 25.554 0 0 0 12.4 10.73c-.84-.52-1.7-1.01-2.59-1.47c.43-1.06.7-2.19.8-3.36c.056-.585.058-1.166.017-1.741ZM6.08 7.597A13.06 13.06 0 0 1 9.6 4.681c.01.376 0 .752-.03 1.129c-.09 1.04-.33 2.04-.7 2.99a38.357 38.357 0 0 0-2.79-1.203Zm-3.009 7.036a12.928 12.928 0 0 1 2.332-6.165A35.81 35.81 0 0 1 8.43 9.75c-.63 1.21-1.49 2.29-2.57 3.2c-.859.724-1.8 1.281-2.789 1.683Z" />
            </svg>
          </div>
        </div>

        {/* Tarjeta de Alimentación */}
        <div
          style={{
            ...getCardStyle(
              !!dailyLog?.food_rating,
              getFoodColor(dailyLog?.food_rating),
            ),
            gridColumn: "1 / -1",
          }}
          onClick={() => navigate("/nutrition")}
        >
          <div style={textColStyle}>
            <h3 style={h3Style}>Alimentación</h3>
            {dailyLog?.food_rating ? (
              <p style={pStyle}>
                Calidad: <strong>{dailyLog.food_rating}</strong>
              </p>
            ) : (
              <p style={pStyle}>No hay datos</p>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              fill="var(--icon-color)"
            >
              <path d="M15.71 4c.83 0 1.62.22 2.29.66c1.14.74 1.84 1.87 2 3.18a4.37 4.37 0 0 1-1.25 3.47c-.7.69-1.59 1.13-2.57 1.23c-1.91.2-3.59.96-4.84 2.23a.809.809 0 0 1-1.13 0l-.99-.99a.743.743 0 0 1-.22-.53c0-.25.11-.47.32-.68c1.21-1.22 1.95-2.84 2.13-4.7c.13-1.33.84-2.47 2-3.22c.66-.43 1.44-.65 2.26-.65m0-2c-1.17 0-2.34.32-3.35.97c-1.76 1.13-2.73 2.89-2.9 4.71c-.13 1.32-.63 2.55-1.55 3.47l-.03.03c-1.16 1.16-1.16 2.93-.07 4.01l.99.99c.55.55 1.26.82 1.97.82s1.43-.27 1.98-.82c.97-.97 2.25-1.5 3.64-1.65c1.37-.15 2.71-.75 3.77-1.8A6.27 6.27 0 0 0 19.09 3c-1.01-.67-2.19-1-3.38-1M6.26 19.86c.27.56.18 1.24-.29 1.7a1.49 1.49 0 0 1-2.55-.98a1.49 1.49 0 0 1-.98-2.55c.46-.46 1.15-.56 1.7-.29l2.48-2.43c.14.19.3.41.48.59l.99.99c.21.2.41.37.67.52l-2.5 2.45Z" />
            </svg>
          </div>
        </div>

        {/* Wellness */}
        <div
          style={{
            ...getCardStyle(true, "#c7c7c7"),
            backgroundColor: "#c7c7c7",
          }}
          onClick={() =>
            window.open(
              "https://docs.google.com/forms/d/e/1FAIpQLSfb-GStAqb4ip4jWYcURX6Xu7FKoWoqUxzbVrcw-wmxC4L79Q/viewform?pli=1&pli=1",
              "_blank",
            )
          }
        >
          <div style={textColStyle}>
            <h3 style={{ ...h3Style, color: "#333" }}>Wellness</h3>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={iconSize}
              height={iconSize}
              viewBox="0 0 14 14"
            >
              <path
                fill="none"
                stroke="#333"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M11.28 9.34a1.91 1.91 0 0 0 0-2.77a2.07 2.07 0 0 0-2.85 0L7 8L5.57 6.57a2.07 2.07 0 0 0-2.85 0a1.91 1.91 0 0 0 0 2.77L7 13.5zM7 4.5a2 2 0 1 0 0-4a2 2 0 0 0 0 4"
              />
            </svg>
          </div>
        </div>

        {/* RPE */}
        <div
          style={{
            ...getCardStyle(true, "#c7c7c7"),
            backgroundColor: "#c7c7c7",
            color: "#333",
          }}
          onClick={() =>
            window.open(
              "https://docs.google.com/forms/d/e/1FAIpQLSfmM8LZvFdx8T48tu8iRsNISsJWffuWLxf8N_H9B1SD4wv9-w/viewform",
              "_blank",
            )
          }
        >
          <div style={textColStyle}>
            <h3 style={{ ...h3Style, color: "#333" }}>RPE</h3>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={iconSize}
              height={iconSize}
              viewBox="0 0 512 512"
            >
              <path
                fill="#333"
                fillRule="evenodd"
                d="M433.256 101.735c29.053 30.388 40.558 72.179 34.517 111.598h-43.409c6.515-28.563-.801-59.995-21.948-82.113c-31.299-32.737-81.216-32.737-112.515 0L256 166.679l-33.902-35.46c-31.299-32.737-81.216-32.737-112.515 0c-21.147 22.119-28.463 53.551-21.948 82.114H44.227c-6.042-39.419 5.464-81.211 34.516-111.599c44.631-46.68 114.991-50.05 163.335-10.107a127 127 0 0 1 10.86 10.107l3.062 3.203l3.061-3.202c3.472-3.631 7.099-7 10.86-10.108c48.345-39.943 118.704-36.574 163.335 10.108M360.14 298.667h59.03L256 469.333L92.83 298.667h59.029L256 407.592zM192 122.964l-55.872 111.703H42.667v42.666h119.851L192 218.368l64 128.001l34.517-69.036h178.816v-42.666H311.851L288 186.964l-32 63.98z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
