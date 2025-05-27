// src/services/usuarioService.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8080/space/usuarios"
});

// Interceptor: aÃ±ade el Authorization Bearer en todas las peticiones si hay token
API.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Registro y login sin cambios
export const registrarUsuario = usuario =>
  API.post("/registrar", usuario);

export const iniciarSesion = ({ nombreUsuario, contrasena }) =>
  API.post("/iniciarSesion", null, { params: { nombreUsuario, contrasena } });

export const iniciarSesionConGoogle = googleToken =>
  API.post("/login-google", { token: googleToken });

// Eliminar usuario (DELETE /eliminar/{id})
export const eliminarUsuario = id =>
  API.delete(`/eliminar/${id}`);

export const solicitarRecuperacionPorUsuario = (username) =>
  API.post(
    "/recuperacion-por-usuario",
    null,
    { params: { username } }
  );

// Actualizar usuario multipart (PUT /editar/{idUsuarios})
export const actualizarUsuario = (id, formData) =>
    API.put(`/editar/${id}`, formData);

export const refreshToken = () =>
  API.get("/refresh-token");

export const obtenerUsuarioPorId = (id) =>
  API.get(`/${id}`).then(res => res.data);

export const validarTokenRecuperacion = (token) =>
  API.get("/restablecer", { params: { token } });

/** Envía la nueva contraseña al backend */
export const restablecerContrasena = (token, nuevaContrasena) =>
  API.post(
    "/restablecer",
    null,
    { params: { token, nuevaContrasena } }
  );

export const listarUsuarios = () =>
  API.get("/listar").then(res => res.data);