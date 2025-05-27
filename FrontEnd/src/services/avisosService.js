// src/services/avisosService.js
import axios from "axios";
import { getToken } from "../utils/jwt";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8080";
const SERVICE = axios.create({
  baseURL: `${API_URL}/space/avisos`,
});

// Interceptor JWT
SERVICE.interceptors.request.use(config => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Listar mis avisos
const listarMisAvisos = async () => {
  const response = await SERVICE.get(`/mis`);
  return response.data;
};

// Obtener por ID
const getById = async (idAvisos) => {
  const response = await SERVICE.get(`/${idAvisos}`);
  return response.data;
};

// Editar aviso (PUT multipart/form-data)
const editarAviso = async (idAvisos, formData) => {
  const response = await SERVICE.put(
    `/editar/${idAvisos}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

// Eliminar aviso
const eliminarAviso = async (idAvisos) => {
  const response = await SERVICE.delete(`/eliminar/${idAvisos}`);
  return response.data;
};

// Crear y otros...
const crearAviso = async (avisoDto, archivos) => {
  const fd = new FormData();
  fd.append("aviso", JSON.stringify(avisoDto));
  archivos.forEach(f => fd.append("imagenes", f));
  const resp = await SERVICE.post(`/registrar`, fd);
  return resp.data;
};

const listarTodos = async () => {
  const response = await SERVICE.get("/listar"); // Asegúrate que este endpoint exista en el backend
  return response.data;
};

const listarEspaciosUsuario = async () => {
  const resp = await axios.get(
    `${API_URL}/space/espacios/listar`,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
};

export default {
  listarMisAvisos,
  getById,
  editarAviso,
  eliminarAviso,
  crearAviso,
  listarEspaciosUsuario,
  listarTodos,
};
