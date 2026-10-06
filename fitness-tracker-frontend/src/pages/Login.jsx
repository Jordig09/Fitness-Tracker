import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = ({ setIsAuthenticated }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", { password });
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
      navigate("/");
    } catch (err) {
      // AQUÍ ESTÁ LA MAGIA: Leemos el error real
      console.error("Error completo:", err);

      if (err.response) {
        if (err.response.status === 401) {
          setError("Contraseña incorrecta real");
        } else if (err.response.status === 404) {
          setError("Ruta no encontrada (¿Subiste el backend a GitHub?)");
        } else {
          setError(`Error del servidor: ${err.response.status}`);
        }
      } else {
        setError(
          "Error de conexión (Render puede estar dormido, espera 1 min y reintenta)",
        );
      }
      setPassword("");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
      }}
    >
      <h2 style={{ marginBottom: "0.5rem" }}>Fitness Tracker</h2>
      <p
        style={{
          color: "var(--text-color)",
          opacity: 0.7,
          marginBottom: "2rem",
        }}
      >
        Acceso Privado
      </p>

      <form
        onSubmit={handleLogin}
        style={{
          width: "100%",
          maxWidth: "300px",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <p
            style={{
              color: "var(--food-mala)",
              margin: 0,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          style={{
            backgroundColor: "var(--primary)",
            color: "white",
            fontWeight: "bold",
            border: "none",
          }}
        >
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default Login;
