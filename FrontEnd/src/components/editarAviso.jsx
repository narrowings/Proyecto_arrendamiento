// src/components/EditarAviso.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import avisosService from "../services/avisosService";
import casaAviso from "../assets/casaAviso.jpg";
import "../editarAviso.css";

const EditarAviso = () => {
  const { idAviso } = useParams();
  const navigate = useNavigate();

  const [precioError, setPrecioError] = useState("");
  const [showConditions, setShowConditions] = useState(false);
  const [formData, setFormData] = useState({
    idAvisos: null,
    titulo: "",
    descripcion: "",
    precio: "",
    estado: "Disponible",
    condicionesAdicionales: "No",
    detalleCondiciones: "",   // <- Lo añadimos aquí
    imagenes: [],
    nuevaImagen: null,
  });

  // Fondo
  useEffect(() => {
    document.body.style.backgroundImage = `url(${casaAviso})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.classList.add("editar-body");
    return () => {
      document.body.style.backgroundImage = "";
      document.body.classList.remove("editar-body");
    };
  }, []);

  // Carga inicial
  useEffect(() => {
    avisosService.getById(idAviso)
      .then(aviso => {
        setFormData({
          idAvisos: aviso.idAvisos,
          titulo: aviso.titulo,
          descripcion: aviso.descripcion,
          precio: aviso.precio,
          estado: aviso.estado,
          condicionesAdicionales: aviso.condicionesAdicionales === "No" ? "No" : "Sí",
          detalleCondiciones: aviso.condicionesAdicionales === "No" 
            ? "" 
            : aviso.condicionesAdicionales,
          imagenes: aviso.imagenes || [],
          nuevaImagen: null,
        });
        setShowConditions(aviso.condicionesAdicionales !== "No");
      })
      .catch(() => navigate("/misAvisos"));
  }, [idAviso, navigate]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === "imagen" && files.length) {
      setFormData(f => ({ ...f, nuevaImagen: files[0] }));
    } else {
      setFormData(f => ({ ...f, [name]: value }));
      if (name === "condicionesAdicionales") {
        const visible = value === "Sí";
        setShowConditions(visible);
        if (!visible) {
          setFormData(f => ({ ...f, detalleCondiciones: "" }));
        }
      }
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.precio || formData.precio <= 0) {
      setPrecioError("El precio debe ser un número positivo.");
      return;
    }
    setPrecioError("");

    // Construimos el DTO:
    let condicionesPayload = formData.condicionesAdicionales;
    if (formData.condicionesAdicionales === "Sí") {
      // Si el usuario escribió algo, lo guardamos aquí
      condicionesPayload = formData.detalleCondiciones.trim() || "Sí";
    }

    const dto = {
      idAvisos: formData.idAvisos,
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      precio: formData.precio,
      estado: formData.estado,
      condicionesAdicionales: condicionesPayload,
    };

    const payload = new FormData();
    payload.append(
      "aviso",
      new Blob([JSON.stringify(dto)], { type: "application/json" })
    );
    if (formData.nuevaImagen) {
      payload.append("imagenes", formData.nuevaImagen);
    }

    try {
      const res = await avisosService.editarAviso(formData.idAvisos, payload);
      console.log("Respuesta de editarAviso:", res);
      alert("Aviso actualizado correctamente");
      navigate("/misAvisos");
      window.location.reload();
    } catch (err) {
      console.error("Error al actualizar:", err.response?.data || err);
      alert("Error al actualizar el aviso");
    }
  };

  return (
    
    <div className="editar-container">
      <div className="editar-form-section">
        <h2>Editar Aviso</h2>
        <form className="editar-form" onSubmit={handleSubmit}>
          <label>Título del aviso:</label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
          />

          <label>Descripción del espacio:</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
            style={{ fontFamily: "Arial, sans-serif", fontSize: "16px" }}
          />

          <label>Precio mensual ($):</label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            required
          />
          <p className="error-msg">{precioError}</p>

          <label>Estado:</label>
          <select name="estado" value={formData.estado} onChange={handleChange}>
            <option value="disponible">Disponible</option>
            <option value="ocupado">Ocupado</option>
            <option value="en revision">En revision</option>
            {/*<option value="Inactivo">Inactivo</option>*/}
          </select>

          <label>¿Tiene condiciones adicionales?</label>
          <select
            name="condicionesAdicionales"
            value={formData.condicionesAdicionales}
            onChange={handleChange}
          >
            <option value="No">No</option>
            <option value="Sí">Sí</option>
          </select>

          {showConditions && (
            <div className="form-group">
              <label>Condiciones adicionales:</label>
              <textarea
                name="detalleCondiciones"
                value={formData.detalleCondiciones}
                onChange={handleChange}
                placeholder="Escribe las condiciones aquí..."
                required
              />
            </div>
          )}

          <label>Subir nueva imagen del espacio:</label>
          <input
            type="file"
            name="imagen"
            accept="image/*"
            onChange={handleChange}
          />

          <button type="submit">Finalizar Edición</button>
          <button
            type="button"
            className="volver-btn"
            onClick={() => navigate("/misAvisos")}
          >
            ← Volver a Mis Avisos
          </button>
        </form>
      </div>

      <div className="editar-image-section">
        {formData.nuevaImagen ? (
          <img
            src={URL.createObjectURL(formData.nuevaImagen)}
            alt="Nueva previsualización"
          />
        ) : formData.imagenes.length > 0 ? (
          <img src={formData.imagenes[0]} alt="Imagen actual" />
        ) : (
          <img src={casaAviso} alt="Decoración edición" />
        )}
      </div>
    </div>
  );
};

export default EditarAviso;

