// src/components/RecuperarPalabraSecreta.jsx
import React, { useState } from "react";
import imagenRecuperacion from "../assets/imagenRecuperacion.jpg";
import "../recuperarPalabraSecreta.css";


const RecuperarPalabraSecreta = () => {
  const [username, setUsername] = useState("");
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username.trim() || !secret.trim()) {
      setError("Por favor llena ambos campos.");
      return;
    }

    // Simulación de validación (puedes reemplazar esto con una llamada a tu API)
    try {
      if (username === "demo" && secret === "clave123") {
        setSuccess("Validación exitosa. Redirigiendo...");
        // Aquí podrías redirigir o mostrar el campo para nueva contraseña
      } else {
        throw new Error("Usuario o palabra secreta incorrectos.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="forgot-password-container">
      <section className="forgot-password-left">
        <div className="title-container">
          <h1>Recupera con tu palabra secreta</h1>
        </div>

        <div className="description-container">
          <p>
            Si registraste una palabra secreta, ingrésala junto con tu nombre
            de usuario para continuar con la recuperación.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="secret">Palabra secreta</label>
            <input
              type="text"
              id="secret"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}

          <button type="submit" className="reset-btn">
            Verificar
          </button>
        </form>
      </section>

      <section className="forgot-password-right">
        <img
          src={imagenRecuperacion}
          alt="Recuperación con palabra secreta"
          className="imagen-recuperacion"
        />
      </section>
    </div>
  );
};

export default RecuperarPalabraSecreta;