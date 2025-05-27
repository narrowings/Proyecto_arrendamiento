// src/services/denunciasService.js
import axios from "axios";
import { getToken } from "../utils/jwt";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8080";
const SERVICE = axios.create({
  baseURL: `${API_URL}/space/denuncias`,
});

SERVICE.interceptors.request.use(config => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default {

  crearDenuncia: (denuncia) => SERVICE.post("/registrar", denuncia),
  
    listarDenuncias: () =>
    SERVICE
      .get("/listar")
      .then(res => res.data)      // ← aquí tomamos res.data
      .catch(err => {
        console.error("Error en listarDenuncias:", err);
        throw err;
      }),
  
  listarDenunciasPorAviso: (idAviso) => SERVICE.get(`/listar/${idAviso}`),
};
