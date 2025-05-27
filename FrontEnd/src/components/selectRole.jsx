import React from "react";
import "../selectRole.css";
import { useNavigate } from "react-router-dom";
import { UserSearch, Building2 } from "lucide-react";
import { decodeJwt } from "../utils/jwt";
import { actualizarUsuario } from "../services/usuarioService";

const SelectRole = () => {
  const navigate = useNavigate();

  const handleRoleSelection = async (rol) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Sin sesión activa");
      const { idUsuarios } = decodeJwt(token);

      // Preparamos el FormData con solo el campo rol
      const formData = new FormData();
      formData.append("usuario", JSON.stringify({ rol }));

      // Llamamos al endpoint de edición
      await actualizarUsuario(idUsuarios, formData);

      // Guardamos rol localmente si lo necesitas
      localStorage.setItem("userRole", rol);

      // Redirigimos según el rol
      if (rol === "Interesado") navigate("/home3");
      else navigate("/home2");

    } catch (err) {
      console.error("Error asignando rol:", err);
      alert("No pudimos guardar tu rol. Intenta de nuevo.");
    }
  };

  return (
    <div className="rol-selection-container">
      <h1 className="rol-title">¿Cómo deseas ingresar?</h1>
      <p className="rol-subtitle">Elige tu rol para continuar</p>
      <div className="card-container">
        <div
          className="rol-card"
          onClick={() => handleRoleSelection("Interesado")}
        >
          <UserSearch size={48} strokeWidth={2.5} />
          <h2 className="rol-name">Interesado</h2>
          <p className="rol-description">
            Explora lugares, guarda tus favoritos y encuentra el sitio ideal.
          </p>
        </div>
        <div
          className="rol-card"
          onClick={() => handleRoleSelection("Propietario")}
        >
          <Building2 size={48} strokeWidth={2.5} />
          <h2 className="rol-name">Propietario</h2>
          <p className="rol-description">
            Publica avisos, gestiona tus propiedades y llega a más personas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelectRole;
