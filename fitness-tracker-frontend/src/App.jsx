import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { DateProvider } from "./context/DateContext";

import Header from "./components/Header";
import NavBar from "./components/NavBar";
import Dashboard from "./pages/Dashboard";
import CalendarView from "./pages/CalendarView";
import WeightTraining from "./pages/WeightTraining";
import Basketball from "./pages/Basketball";
import Nutrition from "./pages/Nutrition";
import Login from "./pages/Login"; // Importamos el Login

// Componente Guardia para proteger las rutas
const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  // Leemos si ya hay una llave guardada al entrar a la app
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token");
  });

  return (
    <DateProvider>
      <div className="app-container">
        {/* El Header solo se muestra si estamos adentro de la app */}
        {isAuthenticated && <Header />}

        <div className="content">
          <Routes>
            {/* Ruta Pública */}
            <Route
              path="/login"
              element={
                !isAuthenticated ? (
                  <Login setIsAuthenticated={setIsAuthenticated} />
                ) : (
                  <Navigate to="/" replace /> // Si ya está logueado y entra a /login, lo pateamos al Inicio
                )
              }
            />

            {/* Rutas Privadas */}
            <Route
              path="/"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <CalendarView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/weights"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <WeightTraining />
                </ProtectedRoute>
              }
            />
            <Route
              path="/basketball"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Basketball />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nutrition"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Nutrition />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <NavBar />
      </div>
    </DateProvider>
  );
}

export default App;
