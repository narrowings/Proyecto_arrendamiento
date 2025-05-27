// src/components/Espacio.jsx
import React, { useState } from "react";
import "../espacio.css";
import { useNavigate } from "react-router-dom";
import espacioService from "../services/espacioService";
import casa3 from "../assets/casa3.jpg";
import HeaderPropietario from "./HeaderPropietario";  // <- Importa el componente

const Espacio = () => {
  const [formData, setFormData] = useState({
    titulo: "",
    tipo: "",
    estrato: "",
    torre: "",           // Para Apartamento y Habitación
    apto: "",            // Para Apartamento y Habitación
    habitacion: "",      // Para Habitación
    numeroCasa: "",      // Para Casa
    parqueadero: "",     // Para Parqueadero
    bodega: ""           // Para Bodega
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const estratoNum = parseInt(formData.estrato, 10);
    if (!formData.titulo.trim()) newErrors.titulo = "El título es obligatorio.";
    if (!formData.tipo) newErrors.tipo = "Selecciona un tipo.";
    if (isNaN(estratoNum) || estratoNum < 1 || estratoNum > 6)
      newErrors.estrato = "El estrato debe ser entre 1 y 6.";

    switch (formData.tipo) {
      case "Apartamento":
        if (!formData.torre.trim()) newErrors.torre = "No. de torre es obligatorio.";
        if (!formData.apto.trim()) newErrors.apto = "No. de apartamento es obligatorio.";
        break;
      case "Habitación":
        if (!formData.torre.trim()) newErrors.torre = "No. de torre es obligatorio.";
        if (!formData.apto.trim()) newErrors.apto = "No. de apartamento es obligatorio.";
        if (!formData.habitacion.trim()) newErrors.habitacion = "No. de habitación es obligatorio.";
        break;
      case "Casa":
        if (!formData.numeroCasa.trim()) newErrors.numeroCasa = "No. de casa es obligatorio.";
        break;
      case "Parqueadero":
        if (!formData.parqueadero.trim()) newErrors.parqueadero = "No. de parqueadero es obligatorio.";
        break;
      case "Bodega":
        if (!formData.bodega.trim()) newErrors.bodega = "No. de bodega es obligatorio.";
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      titulo: formData.titulo,
      tipo: formData.tipo,
      estrato: parseInt(formData.estrato, 10)
    };
    if (formData.tipo === "Apartamento") {
      payload.torre = formData.torre;
      payload.apto = formData.apto;
    }
    if (formData.tipo === "Habitación") {
      payload.torre = formData.torre;
      payload.apto = formData.apto;
      payload.habitacion = formData.habitacion;
    }
    if (formData.tipo === "Casa") {
      payload.numeroCasa = formData.numeroCasa;
    }
    if (formData.tipo === "Parqueadero") {
      payload.parqueadero = formData.parqueadero;
    }
    if (formData.tipo === "Bodega") {
      payload.bodega = formData.bodega;
    }

    try {
      await espacioService.crearEspacio(payload);
      alert("Espacio creado con éxito.");
      navigate("/crear-aviso");
    } catch (error) {
      const msg = error.response?.data || error.message;
      alert("Error al crear el espacio: " + msg);
    }
  };

  return (
    <>
      {/* HeaderPropietario */}
      <HeaderPropietario />
      
      <div className="espacio-wrapper">
        <div className="espacio-container">
          <h1>Registrar nuevo espacio</h1>
          <div className="espacio-card">
            <form className="espacio-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Título del espacio</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                />
                {errors.titulo && <span className="error">{errors.titulo}</span>}
              </div>

              <div className="form-group">
                <label>Tipo de espacio</label>
                <select name="tipo" value={formData.tipo} onChange={handleChange}>
                  <option value="">-- Selecciona --</option>
                  <option value="Apartamento">Apartamento</option>
                  <option value="Habitación">Habitación</option>
                  <option value="Casa">Casa</option>
                  <option value="Parqueadero">Parqueadero</option>
                  <option value="Bodega">Bodega</option>
                </select>
                {errors.tipo && <span className="error">{errors.tipo}</span>}
              </div>

              {formData.tipo === "Apartamento" && (
                <>
                  <div className="form-group">
                    <label>No. Torre</label>
                    <input
                      type="text"
                      name="torre"
                      value={formData.torre}
                      onChange={handleChange}
                    />
                    {errors.torre && <span className="error">{errors.torre}</span>}
                  </div>
                  <div className="form-group">
                    <label>No. Apto</label>
                    <input
                      type="text"
                      name="apto"
                      value={formData.apto}
                      onChange={handleChange}
                    />
                    {errors.apto && <span className="error">{errors.apto}</span>}
                  </div>
                </>
              )}

              {formData.tipo === "Habitación" && (
                <>
                  <div className="form-group">
                    <label>No. Torre</label>
                    <input
                      type="text"
                      name="torre"
                      value={formData.torre}
                      onChange={handleChange}
                    />
                    {errors.torre && <span className="error">{errors.torre}</span>}
                  </div>
                  <div className="form-group">
                    <label>No. Apto</label>
                    <input
                      type="text"
                      name="apto"
                      value={formData.apto}
                      onChange={handleChange}
                    />
                    {errors.apto && <span className="error">{errors.apto}</span>}
                  </div>
                  <div className="form-group">
                    <label>No. Habitación</label>
                    <input
                      type="text"
                      name="habitacion"
                      value={formData.habitacion}
                      onChange={handleChange}
                    />
                    {errors.habitacion && <span className="error">{errors.habitacion}</span>}
                  </div>
                </>
              )}

              {formData.tipo === "Casa" && (
                <div className="form-group">
                  <label>No. Casa</label>
                  <input
                    type="text"
                    name="numeroCasa"
                    value={formData.numeroCasa}
                    onChange={handleChange}
                  />
                  {errors.numeroCasa && <span className="error">{errors.numeroCasa}</span>}
                </div>
              )}

              {formData.tipo === "Parqueadero" && (
                <div className="form-group">
                  <label>No. Parqueadero</label>
                  <input
                    type="text"
                    name="parqueadero"
                    value={formData.parqueadero}
                    onChange={handleChange}
                  />
                  {errors.parqueadero && <span className="error">{errors.parqueadero}</span>}
                </div>
              )}

              {formData.tipo === "Bodega" && (
                <div className="form-group">
                  <label>No. Bodega</label>
                  <input
                    type="text"
                    name="bodega"
                    value={formData.bodega}
                    onChange={handleChange}
                  />
                  {errors.bodega && <span className="error">{errors.bodega}</span>}
                </div>
              )}

              <div className="form-group">
                <label>Estrato</label>
                <input
                  type="number"
                  name="estrato"
                  value={formData.estrato}
                  onChange={handleChange}
                />
                {errors.estrato && <span className="error">{errors.estrato}</span>}
              </div>

              <button type="submit">Guardar Espacio</button>
            </form>
            <div className="espacio-imagen">
              <img src={casa3} alt="Ilustración" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Espacio;
