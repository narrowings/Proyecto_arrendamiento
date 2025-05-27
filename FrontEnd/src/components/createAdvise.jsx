// src/pages/CreateAviso.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import avisosService from "../services/avisosService";
import casaAviso from "../assets/casaAviso.jpg";
import HeaderPropietario from "../components/HeaderPropietario"; // Asegúrate de importar el componente
import "../createAdvise.css";

const CreateAviso = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [espacios, setEspacios] = useState([]);
  const [selectedEspacio, setSelectedEspacio] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [thumbnailImages, setThumbnailImages] = useState([]);

  const [formData, setFormData] = useState({
    titulo: "",
    tipo: "", // este campo ya no se usa
    descripcion: "",
    precio: "",
    condicionesAdicionales: "",
    estado: "Disponible",
  });
  const [showConditions, setShowConditions] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    avisosService.listarEspaciosUsuario()
      .then(data => setEspacios(data))
      .catch(() => alert("Error al obtener espacios"));
  }, []);

  const handleConditionChange = e => {
    const value = e.target.value;
    setShowConditions(value === "si");
    setFormData(prev => ({
      ...prev,
      condicionesAdicionales: value === "si" ? prev.condicionesAdicionales : ""
    }));
  };

  const handleChange = e => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files.length > 0) {
      const newImage = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailImages(prev => {
          const newThumbs = prev.length < 4 ? prev : prev.slice(0, 4);
          return [mainImage, ...newThumbs].filter(Boolean);
        });
        setMainImage({ src: reader.result, name: newImage.name + "-" + Date.now(), file: newImage });
      };
      reader.readAsDataURL(newImage);
      fileInputRef.current.value = "";
    } else if (name === "espacio") {
      setSelectedEspacio(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const removeImage = imageName => {
    if (mainImage?.name === imageName) {
      const [newMain, ...rest] = thumbnailImages;
      setMainImage(newMain || null);
      setThumbnailImages(rest);
    } else {
      setThumbnailImages(prev => prev.filter(img => img.name !== imageName));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!selectedEspacio) newErrors.espacio = "Selecciona un espacio.";
    if (!formData.titulo.trim()) newErrors.titulo = "El título no puede estar vacío.";
    if (!formData.descripcion.trim()) newErrors.descripcion = "La descripción no puede estar vacía.";
    if (!formData.precio || parseFloat(formData.precio) <= 0) newErrors.precio = "El precio debe ser positivo.";
    const totalImages = (mainImage ? 1 : 0) + thumbnailImages.length;
    if (totalImages < 3 || totalImages > 5) newErrors.imagenes = "Debes subir entre 3 y 5 imágenes y que no superen lan 5mb en conjunto";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const avisoDto = {
        idEspacios: { idEspacios: parseInt(selectedEspacio, 10) },
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        condicionesAdicionales: formData.condicionesAdicionales || "No especificadas",
        estado: formData.estado,
      };
      const archivos = [(mainImage && mainImage.file), ...thumbnailImages.map(img => img.file)].filter(Boolean);
      await avisosService.crearAviso(avisoDto, archivos);
      alert("Aviso creado con éxito");
      navigate("/misAvisos");
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Error al crear el aviso.");
    }
  };

  return (
    <>
      {/* HeaderPropietario */}
      <HeaderPropietario />

      <div
        className="create-advise-container"
        style={{ backgroundImage: `url(${casaAviso})` }}
      >
        <h1>Crear Nuevo Aviso</h1>
        <div className="create-advise-content">
          <form className="create-advise-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Título del aviso</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
              />
              {errors.titulo && <span className="error">{errors.titulo}</span>}
            </div>

            <div className="form-group">
              <label>Espacio</label>
              <select
                name="espacio"
                value={selectedEspacio}
                onChange={handleChange}
                required
              >
                <option value="">-- Selecciona --</option>
                {espacios.map(e => (
                  <option key={e.idEspacios} value={e.idEspacios}>
                    {e.titulo}
                  </option>
                ))}
              </select>
              {errors.espacio && <span className="error">{errors.espacio}</span>}
            </div>

            <div className="form-group">
              <label>Descripción del espacio</label>
              <textarea
                className="fixed-textarea"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
              />
              {errors.descripcion && (
                <span className="error">{errors.descripcion}</span>
              )}
            </div>

            <div className="form-group">
              <label>Precio mensual</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                required
              />
              {errors.precio && <span className="error">{errors.precio}</span>}
            </div>

            <div className="form-group">
              <label>¿Deseas agregar condiciones adicionales?</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="condiciones"
                    value="si"
                    checked={showConditions}
                    onChange={handleConditionChange}
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name="condiciones"
                    value="no"
                    checked={!showConditions}
                    onChange={handleConditionChange}
                  />
                  No
                </label>
              </div>
            </div>

            {showConditions && (
              <div className="form-group">
                <label>Condiciones adicionales</label>
                <textarea
                  className="fixed-textarea"
                  name="condicionesAdicionales"
                  value={formData.condicionesAdicionales}
                  onChange={handleChange}
                />
              </div>
            )}

            <button type="submit">Publicar Aviso</button>
          </form>

          <div className="create-advise-images-container">
            <label htmlFor="file-upload" className="file-upload-label">
              haz clic para seleccionar una imagen
            </label>
            <input
              type="file"
              id="file-upload"
              onChange={handleChange}
              style={{ display: "none" }}
              ref={fileInputRef}
            />
            {mainImage?.src && (
              <div className="main-image-container">
                <img
                  src={mainImage.src}
                  alt="Imagen principal"
                  className="main-img"
                />
                <button
                  onClick={() => removeImage(mainImage.name)}
                  className="delete-img-btn"
                >
                  Eliminar
                </button>
              </div>
            )}

            <div className="thumbnail-container">
              {thumbnailImages.map((img, index) => (
                <div key={index} className="thumbnail">
                  <img
                    src={img.src}
                    alt={`Miniatura ${index}`}
                    className="thumbnail-img"
                  />
                  <button
                    onClick={() => removeImage(img.name)}
                    className="delete-img-btn"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>

            {errors.imagenes && <span className="error">{errors.imagenes}</span>}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAviso;
