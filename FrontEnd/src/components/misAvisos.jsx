import React, { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import casaAviso from "../assets/Aviso4.jpg";
import "../misAvisos.css";
import avisosService from "../services/avisosService";
import denunciasService from "../services/denunciasService";
import { getToken, decodeJwt } from "../utils/jwt";
import { Link, useNavigate } from "react-router-dom";
import HeaderPropietario from "./HeaderPropietario";

const MisAvisos = () => {
  const navigate = useNavigate();
  const [avisos, setAvisos] = useState([]);
  const [modal, setModal] = useState({ tipo: null, aviso: null });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const [filtros, setFiltros] = useState({
    min: "", max: "", tipo: "", disponibilidad: "", errorMin: "", errorMax: ""
  });
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    min: "", max: "", tipo: "", disponibilidad: ""
  });
  const [reporte, setReporte] = useState({ motivo: "", comentario: "", aviso: null });

  useEffect(() => {
    avisosService.listarMisAvisos()
      .then(setAvisos)
      .catch(() => alert("Error cargando tus avisos"));
  }, []);

  const abrirModal = (tipo, aviso = null) => setModal({ tipo, aviso });
  const cerrarModal = () => setModal({ tipo: null, aviso: null });

  const enviarReporte = async () => {
    if (!reporte.motivo) return alert("Selecciona un motivo");
    try {
      const { idUsuarios } = decodeJwt(getToken());
      await denunciasService.crearDenuncia({
        idAvisos: { idAvisos: modal.aviso.idAvisos },
        idUsuarios: { idUsuarios },
        razon: reporte.motivo,
        comentario: reporte.comentario
      });
      alert("✅ Reporte enviado");
      cerrarModal();
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Error enviando reporte");
    }
  };

  const disponibilidadMap = { Inmediata: "disponible", Próxima: "no disponible" };

  const avisosFiltrados = avisos.filter(av => {
    const precio = av.precio;
    const min = filtrosAplicados.min ? parseFloat(filtrosAplicados.min) : 0;
    const max = filtrosAplicados.max ? parseFloat(filtrosAplicados.max) : Infinity;
    const okPrecio = precio >= min && precio <= max;
    const okTipo = filtrosAplicados.tipo ? av.tipo === filtrosAplicados.tipo : true;
    const okDisp = filtrosAplicados.disponibilidad
      ? av.estado === disponibilidadMap[filtrosAplicados.disponibilidad]
      : true;
    return okPrecio && okTipo && okDisp;
  });

  return (
    <>
      <HeaderPropietario />

      <div className="misavisos-container" style={{
        backgroundImage: `url(${casaAviso})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "20px",
        minHeight: "100vh"
      }}>
        <h2 className="misavisos-title">Mis Avisos</h2>

        {/* ... aquí podrías reinsertar tu bloque de filtros si lo deseas ... */}

        {avisosFiltrados.length === 0 ? (
          <p className="no-avisos">No tienes avisos que coincidan.</p>
        ) : (
          <div className="avisos-grid">
            {avisosFiltrados.map(aviso => (
              <div key={aviso.idAvisos} className="card-aviso">
                <Link to={`/aviso/${aviso.idAvisos}`} className="aviso-link">
                  {aviso.imagenes?.[0] && (
                    <img src={aviso.imagenes[0]} alt={aviso.titulo} className="aviso-image" />
                  )}
                  <div className="aviso-details">
                    <h3>{aviso.titulo}</h3>
                    <p><strong>Tipo:</strong> {aviso.tipo}</p>
                    <p><strong>Descripción:</strong> {aviso.descripcion}</p>
                    <p><strong>Precio:</strong> ${aviso.precio}/mes</p>
                    <p><strong>Estado:</strong> {aviso.estado}</p>
                  </div>
                </Link>

                <div className="aviso-actions">
                  <button
                    className="action-btn edit"
                    onClick={() => navigate(`/editarAviso/${aviso.idAvisos}`)}
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    className="action-btn create-acuerdo"
                    onClick={() => navigate(`/acuerdo/crear/${aviso.idEspacios}`)}
                  >
                    Crear Acuerdo
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {modal.tipo === "reportar" && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <h3>Reportar Publicación</h3>
            <select
              onChange={e => setReporte(r => ({ ...r, motivo: e.target.value }))}
              defaultValue=""
            >
              <option value="">Seleccionar motivo</option>
              <option value="Contenido inapropiado">Contenido inapropiado</option>
              <option value="Spam">Spam</option>
              <option value="Falsa información">Falsa información</option>
              <option value="Otro">Otro</option>
            </select>
            <textarea
              placeholder="Comentario opcional"
              onChange={e => setReporte(r => ({ ...r, comentario: e.target.value }))}
            />
            <div className="modal-botones">
              <button onClick={enviarReporte} className="modal-eliminar">Enviar</button>
              <button onClick={cerrarModal} className="modal-cancelar">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MisAvisos;
