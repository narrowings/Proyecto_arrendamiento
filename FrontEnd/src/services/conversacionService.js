// src/services/conversacionService.js
import axios from "axios";
import { getToken } from "../utils/jwt";

const API_URL = "http://127.0.0.1:8080/space/conversacion";

const authHeader = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

const obtenerConversacionesPorUsuario = async (idUsuario) => {
  const response = await axios.get(
    `${API_URL}/usuario/${idUsuario}`,
    authHeader()
  );
  return response.data;
};

const obtenerConversacionesPorDuenio = async (idUsuario) => {
  const response = await axios.get(
    `${API_URL}/dueño/${idUsuario}`,
    authHeader()
  );
  return response.data;
};

const crearOObtenerConversacion = async ({ idAvisos, idUsuarioInteresado }) => {
  const body = {
    aviso: { idAvisos },
    usuarioInteresado: { idUsuarios: idUsuarioInteresado }
  };
  const response = await axios.post(
    `${API_URL}/crear-o-get`,
    body,
    authHeader()
  );
  return response.data;
};

export default {
  obtenerConversacionesPorUsuario,
  obtenerConversacionesPorDuenio,
  crearOObtenerConversacion
};
