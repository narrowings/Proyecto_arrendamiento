import React, { useState, useEffect } from "react";
import { Flag } from "lucide-react";
import casaAviso from "../assets/Aviso4.jpg";
import "../misAvisos.css";
import avisosService from "../services/avisosService";
import denunciasService from "../services/denunciasService";
import { getToken, decodeJwt } from "../utils/jwt";
import { Link } from "react-router-dom";
import HeaderPropietario from "./HeaderPropietario";
import HeaderInteresado from "./HeaderInteresado";

const BuscarAvisos = () => {
  const token = getToken();
  const { rol } = token ? decodeJwt(token) : {};
  const Header = rol === "Propietario"
    ? HeaderPropietario
    : HeaderInteresado;

  const [avisos, setAvisos] = useState([]);
  const [modal, setModal] = useState({ tipo: null, aviso: null });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const [filtrosTemporales, setFiltrosTemporales] = useState({
    min: "",
    max: "",
    tipo: "",
    disponibilidad: "",
    errorMin: "",
    errorMax: ""
  });

  const [filtrosAplicados, setFiltrosAplicados] = useState({
    min: "",
    max: "",
    tipo: "",
    disponibilidad: ""
  });

  const [reporte, setReporte] = useState({ motivo: "", comentario: "", aviso: null });

  useEffect(() => {
    avisosService.listarTodos()
      .then(setAvisos)
      .catch(err => {
        console.error(err);
        alert("Error cargando avisos");
      });
  }, []);

  const abrirModal = (tipo, aviso = null) => setModal({ tipo, aviso });
  const cerrarModal = () => setModal({ tipo: null, aviso: null });

  const enviarReporte = async () => {
    if (!reporte.motivo) {
      return alert("Por favor selecciona un motivo");
    }

    try {
      const token = getToken();
      const { idUsuarios } = decodeJwt(token);

      const payload = {
        idAvisos: { idAvisos: modal.aviso.idAvisos },
        idUsuarios: { idUsuarios },
        razon: reporte.motivo,
        comentario: reporte.comentario,
      };

      await denunciasService.crearDenuncia(payload);
      alert("✅ Reporte enviado correctamente");
      cerrarModal();
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data || "Hubo un problema enviando el reporte. Intenta de nuevo."
      );
    }
  };

  const handlePrecioChange = (type, value) => {
    const num = parseFloat(value);
    if (num < 0) {
      setFiltrosTemporales(f => ({
        ...f,
        [type]: value,
        [type === 'min' ? 'errorMin' : 'errorMax']: "El precio no puede ser negativo."
      }));
    } else {
      setFiltrosTemporales(f => ({
        ...f,
        [type]: value,
        ...(type === 'min' ? { errorMin: '' } : { errorMax: '' })
      }));
    }
  };

  const limpiarFiltros = () => {
    setFiltrosTemporales({
      min: "",
      max: "",
      tipo: "",
      disponibilidad: "",
      errorMin: "",
      errorMax: ""
    });
    setFiltrosAplicados({
      min: "",
      max: "",
      tipo: "",
      disponibilidad: ""
    });
  };

  const disponibilidad = {
    Inmediata: "disponible",
    Próxima: "no disponible"
  };

  const avisosFiltrados = avisos.filter(aviso => {
    const precio = aviso.precio;
    const min = filtrosAplicados.min ? parseFloat(filtrosAplicados.min) : 0;
    const max = filtrosAplicados.max ? parseFloat(filtrosAplicados.max) : Infinity;
    const coincidePrecio = precio >= min && precio <= max;
    const coincideTipo = filtrosAplicados.tipo ? aviso.tipo === filtrosAplicados.tipo : true;
    const coincideDisponibilidad = filtrosAplicados.disponibilidad
      ? aviso.estado === disponibilidad[filtrosAplicados.disponibilidad]
      : true;
    return coincidePrecio && coincideTipo && coincideDisponibilidad;
  });

  return (
    <>
      <Header />

      <div
        className="misavisos-container"
        style={{
          backgroundImage: `url(${casaAviso})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
          padding: "20px"
        }}
      >
        <h2 className="misavisos-title">Buscar Avisos</h2>

        <div className="filtros-wrapper">
          <button
            className="boton-filtros"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
          >
            {mostrarFiltros ? "Ocultar filtros" : "Mostrar filtros"}
          </button>

          <div className={`contenedor-filtros-dropdown ${mostrarFiltros ? "mostrar" : ""}`}>
            <div className="filtros-form">
              <div className="filtro-item">
                <label>Precio mínimo:</label>
                <input
                  type="number"
                  placeholder="Mínimo"
                  value={filtrosTemporales.min}
                  onChange={e => handlePrecioChange('min', e.target.value)}
                />
                {filtrosTemporales.errorMin && <p className="error">{filtrosTemporales.errorMin}</p>}
              </div>

              <div className="filtro-item">
                <label>Precio máximo:</label>
                <input
                  type="number"
                  placeholder="Máximo"
                  value={filtrosTemporales.max}
                  onChange={e => handlePrecioChange('max', e.target.value)}
                />
                {filtrosTemporales.errorMax && <p className="error">{filtrosTemporales.errorMax}</p>}
              </div>

              <div className="filtro-item">
                <label>Tipo de espacio:</label>
                <select
                  value={filtrosTemporales.tipo}
                  onChange={e => setFiltrosTemporales(f => ({ ...f, tipo: e.target.value }))}
                >
                  <option value="">Todos</option>
                  <option value="Apartamento">Apartamento</option>
                  <option value="Casa">Casa</option>
                  <option value="Oficina">Oficina</option>
                  <option value="Otro">Garage</option>
                  <option value="Otro">Bodega</option>
                </select>
              </div>

              <div className="filtro-item">
                <label>Disponibilidad:</label>
                <select
                  value={filtrosTemporales.disponibilidad}
                  onChange={e => setFiltrosTemporales(f => ({ ...f, disponibilidad: e.target.value }))}
                >
                  <option value="">Todas</option>
                  <option value="Inmediata">Disponible</option>
                  <option value="Próxima">No disponible</option>
                </select>
              </div>

              <button
                className="boton-aplicar-filtros"
                onClick={() => {
                  if (!filtrosTemporales.errorMin && !filtrosTemporales.errorMax) {
                    setFiltrosAplicados({
                      min: filtrosTemporales.min,
                      max: filtrosTemporales.max,
                      tipo: filtrosTemporales.tipo,
                      disponibilidad: filtrosTemporales.disponibilidad
                    });
                    setMostrarFiltros(false);
                  }
                }}
              >
                Aplicar filtros
              </button>

              <button
                className="boton-limpiar-filtros"
                onClick={() => {
                  limpiarFiltros();
                  setMostrarFiltros(false);
                }}
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {avisosFiltrados.length === 0 ? (
          <p className="no-avisos">No hay avisos que coincidan con los filtros seleccionados.</p>
        ) : (
          <div className="avisos-grid">
            {avisosFiltrados.map(aviso => {
              const firstImage = aviso.imagenes?.[0];
              return (
                <div key={aviso.idAvisos} className="aviso-link">
                  <div className="card-aviso">
                    <Link to={`/aviso/${aviso.idAvisos}`}>
                      {firstImage && <img src={firstImage} alt={aviso.titulo} className="aviso-image" />}
                      <div className="aviso-details">
                        <h3>{aviso.titulo}</h3>
                        <p><strong>Precio:</strong> ${aviso.precio}/mes</p>
                        <p><strong>Tipo de espacio:</strong> {aviso.tipo}</p>
                        <p><strong>Descripción:</strong> {aviso.descripcion}</p>
                        <p><strong>Condiciones adicionales:</strong> {aviso.disponibilidad || "No especificada"}</p>
                        <p className={`estado ${aviso.estado === 'Arrendado' ? 'estado1' : ''}`}>
                          <strong>Estado:</strong> {aviso.estado}
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default BuscarAvisos;
