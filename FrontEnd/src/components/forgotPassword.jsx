// src/components/forgotPassword.jsx
import React, { useState } from "react";
import "../forgotPassword.css";
import { solicitarRecuperacionPorUsuario } from "../services/usuarioService";
import imagenRecuperacion from "../assets/imagenRecuperacion.jpg";
import { Link } from "react-router-dom";


const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [error, setError]   = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username.trim()) {
      setError("Por favor ingresa tu nombre de usuario.");
      return;
    }

    try {
      const resp = await solicitarRecuperacionPorUsuario(username.trim());
      setSuccess(
        resp.data ||
        "Revisa tu correo; enviamos ahí el enlace para recuperar tu contraseña."
      );
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data ||
        "No se encontró un usuario con ese nombre."
      );
    }
  };

  return (
    <div className="forgot-password-container">
      <section className="forgot-password-left">
        <div className="title-container">
          <h1>Restablece tu contraseña</h1>
        </div>

        <div className="description-container">
          <p>
            Ingresa tu nombre de usuario para recibir el enlace de recuperación a tu correo asociado a este usuario.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleChange}
              required
            />
          </div>

          <p className="secret-link">
            <Link to="/recuperarPalabraSecreta">
              ¿Tienes palabra secreta?
            </Link>
          </p>

          {error   && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}

          <button type="submit" className="reset-btn">
            Solicitar recuperación
          </button>
        </form>
      </section>

      <section className="forgot-password-right">
        <img src={imagenRecuperacion} alt="Recuperación de contraseña" className="imagenRecuperacion" />
      </section>
    </div>
  );
};

export default ForgotPassword;