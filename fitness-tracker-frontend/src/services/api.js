import axios from "axios";

const api = axios.create({
  baseURL: "https://fitness-tracker-backend-852j.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Se ejecuta ANTES de que la petición salga hacia el backend
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      // Forma más segura de escribirlo para versiones nuevas de Axios
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Se ejecuta CUANDO llega la respuesta del backend
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
