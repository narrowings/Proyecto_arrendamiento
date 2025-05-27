// src/utils/jwt.js

// Función para decodificar un JWT manualmente
export function decodeJwt(token) {
    if (!token) return null;
    const payload = token.split('.')[1];
    try {
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error("Error al decodificar el JWT:", e);
      return null;
    }
  }
  
  // Guardar el token en localStorage
  export function saveToken(token) {
    localStorage.setItem("token", token);
  }
  
  // Obtener el token desde localStorage
  export function getToken() {
    return localStorage.getItem("token");
  }
  
  // Eliminar el token (logout)
  export function removeToken() {
    localStorage.removeItem("token");
  }
  
  