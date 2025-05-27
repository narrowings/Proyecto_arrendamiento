// src/components/ActualizarUsuario.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { actualizarUsuario, obtenerUsuarioPorId } from "../services/usuarioService";
import { getToken, decodeJwt } from "../utils/jwt";
import HeaderPropietario from "./HeaderPropietario";
import HeaderInteresado from "./HeaderInteresado";
import "../actualizarUsuario.css";

const ActualizarUsuario = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [nombreUsuarioActual, setNombreUsuarioActual] = useState("");
  const [telefono, setTelefono] = useState("");
  const navigate = useNavigate();

  const token = getToken();
  const decoded = token ? decodeJwt(token) : {};
  const Header = decoded.rol === "Propietario" ? HeaderPropietario : HeaderInteresado;

  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        if (!token) return;
        const { idUsuarios } = decoded;
        const usuario = await obtenerUsuarioPorId(idUsuarios);

        if (usuario.fotoPerfil) {
          setImagePreview(usuario.fotoPerfil);
        } else {
          setImagePreview("/default-user.png");
        }

        setNombreUsuarioActual(usuario.nombreUsuario);
      } catch (error) {
        console.error("Error cargando usuario:", error);
      }
    };

    cargarDatosUsuario();
  }, [decoded, token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(file.type)) {
      setError("Solo se permiten imágenes JPG, JPEG o PNG.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no debe pesar más de 5 MB.");
      return;
    }

    setError("");
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview("/default-user.png");
    setError("");
  };

  const handleActualizar = async () => {
    try {
      setError("");

      if (telefono.trim() && !/^\d{10}$/.test(telefono.trim())) {
        setError("El teléfono debe tener exactamente 10 dígitos.");
        return;
      }

      if (!token) throw new Error("Sin sesión activa.");
      const { idUsuarios } = decoded;

      const usuario = {};

      const nombreTrim = nombreUsuario.trim();
      if (nombreTrim && nombreTrim.toLowerCase() !== nombreUsuarioActual.toLowerCase()) {
        usuario.nombreUsuario = nombreTrim;
      }

      if (telefono.trim()) {
        usuario.telefono = telefono.trim();
      }

      const formData = new FormData();
      formData.append("usuario", JSON.stringify(usuario));
      if (selectedImage) {
        formData.append("foto", selectedImage);
      }

      await actualizarUsuario(idUsuarios, formData);

      localStorage.removeItem("token");
      alert("¡Perfil actualizado! Por favor vuelve a iniciar sesión.");
      navigate("/login");
    } catch (err) {
      console.error("Error al actualizar:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Hubo un problema al actualizar tu perfil.");
      }
    }
  };

  return (
    <>
      <Header />
      <div className="actualizar-container">
        <h2>Actualizar perfil</h2>
        <div className="actualizar-content">
          <div className="actualizar-imagen">
            <img src={imagePreview} alt="" />
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {selectedImage && (
              <button type="button" onClick={handleRemoveImage} className="eliminar-btn">
                Eliminar imagen
              </button>
            )}
            {error && <p className="error">{error}</p>}
          </div>

          <div className="actualizar-formulario">
            <label>Usuario</label>
            <input
              type="text"
              placeholder="Nuevo usuario"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
            />

            <label>Teléfono</label>
            <input
              type="text"
              placeholder="Nuevo teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />

            <button type="button" className="actualizar-btn" onClick={handleActualizar}>
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActualizarUsuario;
