import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api", // La URL de tu backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
