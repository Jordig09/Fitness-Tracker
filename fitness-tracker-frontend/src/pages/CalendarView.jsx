import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { DateContext } from "../context/DateContext";

const CalendarView = () => {
  const [summaryMap, setSummaryMap] = useState({});
  const { setActiveDateObj } = useContext(DateContext);
  const navigate = useNavigate();

  // Estado para controlar qué mes se está viendo en el calendario
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const iconSize = "20";

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        // Mostrar instantáneamente los datos guardados del calendario
        const cachedSummary = localStorage.getItem("calendar_summary");
        if (cachedSummary) {
          setSummaryMap(JSON.parse(cachedSummary));
        }

        // Pedir la información más reciente de fondo
        const res = await api.get("/daily-logs/summary/calendar");
        const dataMap = {};
        res.data.forEach((day) => {
          const dateString = day.date.split("T")[0];
          dataMap[dateString] = day;
        });

        // Guarda en estado y en caché
        setSummaryMap(dataMap);
        localStorage.setItem("calendar_summary", JSON.stringify(dataMap));
      } catch (error) {
        console.error("Error fetching calendar summary", error);
      }
    };
    fetchSummary();
  }, []);

  const getFoodColor = (rating) => {
    switch (rating) {
      case "Muy Buena":
        return "var(--food-muy-buena, #d4edda)";
      case "Buena":
        return "var(--food-buena, #e2f3e5)";
      case "Regular":
        return "var(--food-regular, #fff3cd)";
      case "Mala":
        return "var(--food-mala, #f8d7da)";
      case "Muy Mala":
        return "var(--food-muy-mala, #f5c6cb)";
      default:
        return "var(--food-none, #f8f9fa)";
    }
  };

  const handleDayClick = (dateString) => {
    const newDate = new Date(dateString + "T12:00:00");
    setActiveDateObj(newDate);
    navigate("/");
  };

  const nextMonth = () => {
    setCurrentMonthDate(
      new Date(
        currentMonthDate.getFullYear(),
        currentMonthDate.getMonth() + 1,
        1,
      ),
    );
  };

  const prevMonth = () => {
    setCurrentMonthDate(
      new Date(
        currentMonthDate.getFullYear(),
        currentMonthDate.getMonth() - 1,
        1,
      ),
    );
  };

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth(); // 0 a 11

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const calendarCells = [];

  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(
      <div key={`empty-${i}`} style={{ padding: "0.5rem" }}></div>,
    );
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayData = summaryMap[dateString];

    console.log(dayData);

    const bgColor = dayData
      ? getFoodColor(dayData.food_rating)
      : "var(--food-none, #f8f9fa)";
    const textColor =
      dayData &&
      (dayData.food_rating === "Mala" ||
        dayData.food_rating === "Muy Buena" ||
        dayData.food_rating === "Muy Mala")
        ? "white"
        : "#333";

    calendarCells.push(
      <div
        key={dateString}
        onClick={() => handleDayClick(dateString)}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          padding: "0.5rem 0.2rem",
          borderRadius: "8px",
          textAlign: "center",
          cursor: "pointer",
          minHeight: "90px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <strong style={{ fontSize: "1.1rem" }}>{day}</strong>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            justifyContent: "center",
            gap: "2px",
            fontSize: "1rem",
            marginTop: "auto",
          }}
        >
          {dayData?.basketball_duration_minutes > 0 && (
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 32 32"
              fill="currentColor"
            >
              <path d="M16 1.5C7.992 1.5 1.5 7.992 1.5 16S7.992 30.5 16 30.5S30.5 24.008 30.5 16S24.008 1.5 16 1.5ZM3.002 15.793A11.525 11.525 0 0 0 6.54 13.75c1.19-1 2.14-2.2 2.83-3.53c.8.41 1.58.85 2.35 1.32a25.317 25.317 0 0 0-5.507 13.017a12.95 12.95 0 0 1-3.211-8.764Zm11.568 13.13a12.953 12.953 0 0 1-7.397-3.379A24.382 24.382 0 0 1 12.61 12.11c1 .65 1.96 1.34 2.89 2.08c-.19.2-.37.4-.55.62c-1.95 2.39-2.85 5.4-2.54 8.48a11.53 11.53 0 0 0 2.16 5.632Zm10.382-3.496A12.955 12.955 0 0 1 16 29h-.013a10.424 10.424 0 0 1-2.527-5.82a10.497 10.497 0 0 1 2.86-8.33a37.288 37.288 0 0 1 8.632 10.577Zm3.623-12.738C28.852 13.746 29 14.856 29 16c0 3.314-1.24 6.338-3.28 8.634a38.103 38.103 0 0 0-8.63-10.504c1.61-1.39 3.61-2.25 5.77-2.47a10.44 10.44 0 0 1 5.715 1.03ZM22.62 4.81a13.045 13.045 0 0 1 5.52 6.535a11.477 11.477 0 0 0-5.391-.735c-2.44.25-4.69 1.24-6.49 2.84c-.95-.76-1.94-1.48-2.96-2.15a24.548 24.548 0 0 1 9.321-6.49Zm-11.993-.65A12.953 12.953 0 0 1 16 3c1.932 0 3.765.421 5.413 1.177A25.554 25.554 0 0 0 12.4 10.73c-.84-.52-1.7-1.01-2.59-1.47c.43-1.06.7-2.19.8-3.36c.056-.585.058-1.166.017-1.741ZM6.08 7.597A13.06 13.06 0 0 1 9.6 4.681c.01.376 0 .752-.03 1.129c-.09 1.04-.33 2.04-.7 2.99a38.357 38.357 0 0 0-2.79-1.203Zm-3.009 7.036a12.928 12.928 0 0 1 2.332-6.165A35.81 35.81 0 0 1 8.43 9.75c-.63 1.21-1.49 2.29-2.57 3.2c-.859.724-1.8 1.281-2.789 1.683Z" />
            </svg>
          )}
          {Number(dayData?.weight_sessions_count) > 0 && (
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 48 48"
              fill="currentColor"
            >
              <g
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
              >
                <path d="M9.102 13.727c.032-1.321.78-2.503 2.092-2.656c.378-.043.812-.071 1.306-.071s.928.028 1.306.072c1.313.152 2.06 1.334 2.092 2.655c.047 1.944.102 5.29.102 10.273s-.055 8.329-.102 10.273c-.032 1.321-.78 2.503-2.092 2.656c-.378.043-.812.071-1.306.071s-.928-.028-1.306-.071c-1.313-.153-2.06-1.335-2.092-2.656C9.055 32.329 9 28.983 9 24s.055-8.329.102-10.273m29.796 0c-.032-1.321-.78-2.503-2.092-2.656c-.378-.043-.812-.071-1.306-.071s-.928.028-1.306.072c-1.313.152-2.06 1.334-2.092 2.655C32.055 15.671 32 19.017 32 24s.055 8.329.102 10.273c.032 1.321.78 2.503 2.092 2.656c.378.043.812.071 1.306.071s.928-.028 1.306-.071c1.313-.153 2.06-1.335 2.092-2.656c.047-1.944.102-5.29.102-10.273s-.055-8.329-.102-10.273" />
                <path d="M15.993 26.982a1293 1293 0 0 0 16.014-.013m-.001-5.939c-2.414-.017-5.4-.03-9.007-.03c-2.668 0-4.998.007-7.007.018M3.055 18.803c.036-1.49.984-2.748 2.474-2.796a15 15 0 0 1 .942 0c1.49.048 2.438 1.305 2.474 2.796C8.975 20.026 9 21.739 9 24s-.026 3.974-.055 5.197c-.036 1.49-.984 2.748-2.474 2.796a15 15 0 0 1-.942 0c-1.49-.048-2.438-1.305-2.474-2.796C3.025 27.974 3 26.261 3 24s.026-3.974.055-5.197m41.89 0c-.036-1.49-.984-2.748-2.474-2.796a15 15 0 0 0-.942 0c-1.49.048-2.438 1.305-2.474 2.796C39.025 20.026 39 21.739 39 24s.026 3.974.055 5.197c.036 1.49.984 2.748 2.474 2.796a15 15 0 0 0 .942 0c1.49-.048 2.438-1.305 2.474-2.796c.03-1.223.055-2.936.055-5.197s-.026-3.974-.055-5.197" />
              </g>
            </svg>
          )}
          {dayData?.walk_completed && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={iconSize}
              height={iconSize}
              viewBox="0 0 48 48"
              fill="currentColor"
            >
              <g fill="currentColor">
                <path d="M31.25 8a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-5.557 20.397l5.193 5.124a2 2 0 0 1 .457.693l2.769 7.055a2 2 0 0 1-3.724 1.462l-2.614-6.661l-8.928-8.81a2 2 0 0 1-.583-1.649l.715-6.32c-1.724 1.714-3.054 4.123-4.073 7.316a2 2 0 1 1-3.81-1.216c1.87-5.86 4.975-10.246 10.185-12.257l.023-.009c1.327-.493 2.707-.453 3.937.182c1.181.611 2.022 1.666 2.573 2.848c.232.498.446.963.648 1.4c.488 1.058.898 1.95 1.293 2.732c.553 1.1.998 1.83 1.438 2.342c.408.474.813.766 1.33.968c.556.217 1.335.367 2.538.403a2 2 0 1 1-.12 3.998c-1.445-.043-2.728-.228-3.873-.675c-1.183-.462-2.116-1.165-2.91-2.09c-.5-.582-.94-1.247-1.35-1.97z" />
                <path d="m18.263 30.22l3.315 3.18l-1.526 5.147a2 2 0 0 1-.684 1.006l-5.134 4.023a2 2 0 0 1-2.467-3.15l4.632-3.628l1.395-4.71z" />
              </g>
            </svg>
          )}
        </div>
      </div>,
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <button
          onClick={prevMonth}
          style={{ width: "auto", padding: "0.5rem 1rem" }}
        >
          &larr;
        </button>
        <h2 style={{ margin: 0 }}>
          {monthNames[month]} {year}
        </h2>
        <button
          onClick={nextMonth}
          style={{ width: "auto", padding: "0.5rem 1rem" }}
        >
          &rarr;
        </button>
      </div>

      <p
        style={{
          color: "#666",
          textAlign: "center",
          marginBottom: "1rem",
          fontSize: "0.9rem",
        }}
      >
        Toca un día para seleccionarlo y ver sus detalles.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "5px",
          marginBottom: "5px",
          textAlign: "center",
          fontWeight: "bold",
          color: "#666",
        }}
      >
        {dayNames.map((name) => (
          <div key={name}>{name}</div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "5px",
        }}
      >
        {calendarCells}
      </div>
    </div>
  );
};

export default CalendarView;
