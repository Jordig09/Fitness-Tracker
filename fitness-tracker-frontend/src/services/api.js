import axios from "axios";

const api = axios.create({
  // URL de tu backend en producción
  baseURL: "https://fitness-tracker-backend-852j.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
