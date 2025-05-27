// src/components/Usuario.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate }          from "react-router-dom";
import { UserRound, Star }            from "lucide-react";
import { eliminarUsuario }            from "../services/usuarioService";
import axios                          from "axios";
import { getToken, decodeJwt }        from "../utils/jwt";
import acuerdoService                 from "../services/acuerdoArrendamientoService";
import HeaderInteresado               from "./HeaderInteresado";
import HeaderPropietario              from "./HeaderPropietario";
import "../usuario.css";

const Usuario = () => {
  const [userData, setUserData]       = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [ratingAvg, setRatingAvg]     = useState(null);
  const navigate                      = useNavigate();

  // 1) Cargo perfil
  useEffect(() => {
    const cargarPerfil = async () => {
      const token = getToken();
      if (!token) return navigate("/login");
      const { idUsuarios } = decodeJwt(token);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8080"}/space/usuarios/${idUsuarios}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserData(res.data);
      } catch {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    cargarPerfil();
  }, [navigate]);

  // 2) Una vez que tengo userData, traigo todos los acuerdos y calculo promedio
  useEffect(() => {
    if (!userData) return;
    const isProp = userData.rol.trim().toUpperCase() === "PROPIETARIO";

    acuerdoService
      .listarAcuerdos()
      .then(all => {
        // Extraer sólo los ratings relevantes según rol
        const ratings = all
          .filter(a => 
            isProp
              ? a.idEspacios.usuario.idUsuarios === userData.idUsuarios   // soy propietario → acuerdos de mis espacios
              : a.idUsuarios.idUsuarios    === userData.idUsuarios       // soy interesado → acuerdos que firmé
          )
          .map(a => isProp ? a.calificacionEspacio : a.calificacionUsuario)
          .filter(r => typeof r === "number");

        if (ratings.length > 0) {
          const sum = ratings.reduce((acc, cur) => acc + cur, 0);
          setRatingAvg(sum / ratings.length);
        } else {
          setRatingAvg(null);
        }
      })
      .catch(console.error);
  }, [userData]);

  const abrirModal = () => setMostrarModal(true);
  const cerrarModal = () => setMostrarModal(false);

  const handleEliminarCuenta = async () => {
    try {
      await eliminarUsuario(userData.idUsuarios);
      localStorage.removeItem("token");
      alert("Cuenta eliminada correctamente.");
      navigate("/login");
    } catch {
      alert("Error al eliminar la cuenta.");
    }
  };

  const obtenerFotoPerfil = () =>
    userData?.fotoPerfil?.trim() ? userData.fotoPerfil : "/usuario.png";

  if (!userData) return <div>Cargando...</div>;

  const rolNormalizado = userData.rol.trim().toUpperCase();

  return (
    <>
      {rolNormalizado === "PROPIETARIO" 
        ? <HeaderPropietario /> 
        : <HeaderInteresado />}

      <div className="usuario-container">
        {/* Avatar */}
        <div className="usuario-header">
          <div className="usuario-avatar">
            <img 
              src={obtenerFotoPerfil()} 
              alt="avatar" 
              className="usuario-foto" 
            />
          </div>
        </div>

        {/* Nombre */}
        <div className="usuario-nombre">
          <UserRound size={22} /> <span>{userData.nombreUsuario}</span>
        </div>

        {/* Calificación promedio centrada */}
        <div className="usuario-rating">
          {ratingAvg != null 
            ? <>Calificación: {ratingAvg.toFixed(1)} <Star size={16} /></>
            : <>Sin calificaciones aún</>
          }
        </div>

        {/* Otros datos */}
        <div className="usuario-resumen">
          <div className="resumen-item">
            <strong>Correo:</strong> {userData.email}
          </div>
          <div className="resumen-item">
            <strong>Teléfono:</strong> {userData.telefono}
          </div>
          <div className="resumen-item">
            <strong>Rol:</strong> {userData.rol}
          </div>
        </div>
        <hr className="usuario-divider" />

        {/* Botones */}
        <div className="usuario-opciones">
          <Link to="/actualizarUsuario">
            <button className="usuario-btn">Actualizar</button>
          </Link>
          <button 
            className="usuario-btn eliminar" 
            onClick={abrirModal}
          >
            Eliminar
          </button>
          <Link to="/login">
            <button className="usuario-btn cerrar">
              Cerrar sesión
            </button>
          </Link>
        </div>

        {/* Modal de confirmación */}
        {mostrarModal && (
          <div className="modal-overlay">
            <div className="modal-contenido">
              <h3>⚠️ Eliminación de cuenta</h3>
              <p>Esta acción es irreversible.</p>
              <div className="modal-botones">
                <button 
                  className="modal-eliminar" 
                  onClick={handleEliminarCuenta}
                >
                  Eliminar
                </button>
                <button 
                  className="modal-cancelar" 
                  onClick={cerrarModal}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
  
export default Usuario;
 