// src/components/Acuerdos.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, decodeJwt } from "../utils/jwt";
import acuerdoService from "../services/acuerdoArrendamientoService";
import HeaderPropietario from "./HeaderPropietario";
import HeaderInteresado from "./HeaderInteresado";
import "../Acuerdos.css";

const Acuerdos = () => {
  const navigate = useNavigate();
  const [acuerdos, setAcuerdos] = useState([]);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    const dec = decodeJwt(token);
    setUsuario(dec);

    acuerdoService.listarAcuerdos()
      .then(data => {
        const lst = data.filter(a => {
          if (dec.rol === "Propietario") {
            return a.idEspacios.usuario.idUsuarios === dec.idUsuarios;
          }
          return a.idUsuarios.idUsuarios === dec.idUsuarios;
        });
        setAcuerdos(lst);
      })
      .catch(console.error);
  }, []);

  if (!usuario) return <p>Cargando...</p>;

  // Seleccionar el Header según el rol
  const Header = usuario.rol === "Propietario" ? HeaderPropietario : HeaderInteresado;

  return (
    <>
      <Header />

      <div className="acuerdos-container">
        <h1>Mis Acuerdos</h1>
        {acuerdos.length === 0 ? (
          <p>No tienes acuerdos.</p>
        ) : (
          <div className="acuerdos-grid">
            {acuerdos.map(a => (
              <div key={a.idAcuerdoArrendamiento} className="acuerdo-card">
                <h3>Acuerdo #{a.idAcuerdoArrendamiento}</h3>
                <p><strong>Espacio:</strong> {a.idEspacios.titulo}</p>
                <p><strong>Usuario:</strong> {a.idUsuarios.nombreUsuario}</p>
                <p>
                  <strong>Periodo:</strong> {a.fechaInicio} — {a.fechaFin}
                </p>
                <p><strong>Estado:</strong> {a.estado}</p>
                <div className="acuerdo-actions">
                  <button
                    className="btn-descargar"
                    onClick={() => acuerdoService.descargarAcuerdo(a.idAcuerdoArrendamiento)}
                  >
                    Descargar PDF
                  </button>

                  {a.estado === 'finalizado' && (
                    <button
                      className="btn-calificar"
                      onClick={() => navigate(`/acuerdo/calificar/${a.idAcuerdoArrendamiento}`)}
                    >
                      Calificar
                    </button>
                  )}

                  {usuario.rol === 'Propietario' && (
                    <button
                      className="btn-modificar"
                      onClick={() => navigate(`/acuerdo/editar/${a.idAcuerdoArrendamiento}`)}
                    >
                      Modificar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Acuerdos;
