import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Flag } from "lucide-react";
import { getToken, decodeJwt } from "../utils/jwt";
import avisosService from "../services/avisosService";
import denunciasService from "../services/denunciasService";
import conversacionService from "../services/conversacionService";
import HeaderPropietario from "../components/HeaderPropietario";
import HeaderInteresado from "../components/HeaderInteresado";
import "../DetalleAviso.css";

const DetalleAviso = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [aviso, setAviso] = useState(null);
  const [modal, setModal] = useState({ tipo: null, aviso: null });
  const [reporte, setReporte] = useState({
    motivo: "",
    comentario: "",
    aviso: null,
  });
  const [imagenPrincipal, setImagenPrincipal] = useState(null);

  const token = getToken();
  const decoded = token ? decodeJwt(token) : {};
  const miId = decoded.idUsuarios;

  useEffect(() => {
    avisosService
      .getById(id)
      .then(data => {
        console.log("📥 aviso cargado:", data);
        setAviso(data);
        if (data.imagenes && data.imagenes.length > 0) {
          setImagenPrincipal(data.imagenes[0]);
        }
      })
      .catch(err => console.error("Error cargando aviso", err));
  }, [id]);

  const abrirModal = () => setModal({ tipo: "reportar", aviso });
  const cerrarModal = () => setModal({ tipo: null, aviso: null });

  const enviarReporte = async () => {
    if (!reporte.motivo) return alert("Por favor selecciona un motivo");
    try {
      const payload = {
        idAvisos: { idAvisos: aviso.idAvisos },
        idUsuarios: { idUsuarios: miId },
        razon: reporte.motivo,
        comentario: reporte.comentario,
      };
      await denunciasService.crearDenuncia(payload);
      alert("✅ Reporte enviado correctamente");
      cerrarModal();
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Error enviando reporte");
    }
  };

  const handleContactar = async () => {
    try {
      const conv = await conversacionService.crearOObtenerConversacion({
        idAvisos: aviso.idAvisos,
        idUsuarioInteresado: miId,
      });
      navigate(`/mensajes/${conv.idConversacion}`);
    } catch (err) {
      console.error("Error creando conversación:", err);
      alert("No se pudo iniciar el chat. Intenta de nuevo.");
    }
  };

  if (!aviso) return <p className="cargando">Cargando aviso...</p>;

  const soyPropietario = miId === aviso.propietarioId;
  const rolNormalizado = decoded.rol?.toUpperCase?.();

  return (
    <>
      {rolNormalizado === "PROPIETARIO" ? <HeaderPropietario /> : <HeaderInteresado />}

      <div className="detalle-aviso-contenedor">
        <div className="detalle-aviso">
          <h1 className="detalle-titulo">{aviso.titulo}</h1>

          <div className="detalle-imagenes-contenedor">
            <div className="detalle-imagen">
              {imagenPrincipal && <img src={imagenPrincipal} alt={aviso.titulo} />}
            </div>

            <div className="detalle-imagenes-secundarias">
              {aviso.imagenes &&
                aviso.imagenes.length > 1 &&
                aviso.imagenes.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${aviso.titulo} imagen ${index + 1}`}
                    className={`imagen-secundaria ${img === imagenPrincipal ? "seleccionada" : ""}`}
                    onClick={() => setImagenPrincipal(img)}
                  />
                ))}
            </div>
          </div>

          <div className="detalle-info">
            <p><strong>Precio:</strong> ${aviso.precio}/mes</p>
            <p><strong>Descripción:</strong> {aviso.descripcion || "Sin descripción"}</p>
            <p><strong>Condiciones adicionales:</strong> {aviso.disponibilidad || "No especificada"}</p>
            <p className={`estado ${aviso.estado === "Arrendado" ? "estado1" : ""}`}>
              <strong>Estado:</strong> {aviso.estado}
            </p>
          </div>

          {!soyPropietario && (
            <>
              <button onClick={abrirModal} className="btn-reportar" title="Reportar aviso">
                <Flag size={16} /> Reportar
              </button>
              <button onClick={handleContactar} className="btn-contactar">
                Contactar
              </button>
            </>
          )}
        </div>

        {modal.tipo === "reportar" && (
          <div className="modal-overlay">
            <div className="modal-contenido">
              <h3>Reportar Publicación</h3>
              <label>Motivo del reporte:</label>
              <select
                value={reporte.motivo}
                onChange={e => setReporte({ ...reporte, motivo: e.target.value })}
              >
                <option value="">Seleccionar motivo</option>
                <option value="Contenido inapropiado">Contenido inapropiado</option>
                <option value="Spam">Spam</option>
                <option value="Falsa información">Falsa información</option>
                <option value="Otro">Otro</option>
              </select>

              <label>Comentarios adicionales (opcional):</label>
              <textarea
                value={reporte.comentario}
                onChange={e => setReporte({ ...reporte, comentario: e.target.value })}
                placeholder="Puedes dejar este campo vacío"
              />

              <div className="modal-botones">
                <button onClick={enviarReporte} className="modal-eliminar">Enviar reporte</button>
                <button onClick={cerrarModal} className="modal-cancelar">Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DetalleAviso;
